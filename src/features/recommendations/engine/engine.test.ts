import { describe, it, expect } from 'vitest';
import type { Alternative } from '../../../shared/types/database';
import type { ActivityContext, UserScoringProfile } from './types';
import {
  rankRecommendations,
  getColdStartRecommendations,
  scoreAlternative,
} from './engine';
import { getCalibratedWeights } from './weights';
import { calculateEmissionSavingsRange, calculateCostDeltaRange } from './emissionCalculator';
import {
  clamp,
  computeEffortPenalty,
  normalizeImpact,
  normalizeCostSavings,
  normalizeFeasibility,
} from './normalizer';
import { calculateLearningAdjustment } from './learningLoop';

// Sample Candidate Alternatives for Testing
const mockAlternatives: Alternative[] = [
  {
    id: 'alt-metro-commute',
    category: 'transport',
    title: 'Switch Commute to Metro Transit',
    description: 'Use city rapid transit.',
    why_better: 'High capacity mass electric transit cuts emissions by ~91%.',
    baseline_activity_id: 'act-petrol-commute',
    co2e_saved_ratio: 0.912,
    cost_delta_monthly_inr: -3200,
    difficulty: 'moderate',
    feasibility_score: 0.9,
    prerequisites: ['Transit line nearby'],
    caveats: 'Savings apply if first/last mile is not driven via solo cab.',
    region_availability: ['IN', 'GLOBAL'],
    tags: ['transit', 'commute', 'urban'],
    source_citation: 'DMRC 2023 / DEFRA 2024',
    source_url: 'https://example.com/dmrc',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'alt-bicycle-short-trips',
    category: 'transport',
    title: 'Bicycle for Sub-4km Trips',
    description: 'Acoustic bicycle commute.',
    why_better: 'Zero direct tailpipe emissions.',
    baseline_activity_id: 'act-petrol-commute',
    co2e_saved_ratio: 1.0,
    cost_delta_monthly_inr: -650,
    difficulty: 'moderate',
    feasibility_score: 0.75,
    prerequisites: ['Bicycle lane or secondary road'],
    caveats: 'Subject to safe weather and road conditions.',
    region_availability: ['IN', 'GLOBAL'],
    tags: ['cycling', 'active-mobility'],
    source_citation: 'DEFRA 2024',
    source_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'alt-eco-driving',
    category: 'transport',
    title: 'Eco-Driving Habit: Steady Throttle',
    description: 'Drive between 50-60 km/h smoothly.',
    why_better: 'Cuts fuel burn by 15% with zero upfront cost.',
    baseline_activity_id: 'act-petrol-commute',
    co2e_saved_ratio: 0.15,
    cost_delta_monthly_inr: -850,
    difficulty: 'easy',
    feasibility_score: 0.98,
    prerequisites: [],
    caveats: null,
    region_availability: ['GLOBAL'],
    tags: ['habit', 'fuel-savings'],
    source_citation: 'US EPA Fuel Economy 2024',
    source_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'alt-electric-car',
    category: 'transport',
    title: 'Transition to Electric Car (EV)',
    description: 'Purchase a four-wheeler BEV.',
    why_better: 'Zero tailpipe emissions and higher efficiency.',
    baseline_activity_id: 'act-petrol-commute',
    co2e_saved_ratio: 0.45,
    cost_delta_monthly_inr: -4500,
    difficulty: 'committed',
    feasibility_score: 0.65,
    prerequisites: ['Designated parking with 15A socket', 'High capital'],
    caveats: 'Requires home charger and breaks even after 8000km.',
    region_availability: ['IN'],
    tags: ['ev', 'automotive'],
    source_citation: 'CEA India 2023',
    source_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'alt-bldc-fan',
    category: 'energy',
    title: 'Switch to 5-Star BLDC Ceiling Fans',
    description: 'Replace 75W fan with 28W fan.',
    why_better: 'Consumes 62% less electricity.',
    baseline_activity_id: null,
    co2e_saved_ratio: 0.62,
    cost_delta_monthly_inr: -320,
    difficulty: 'easy',
    feasibility_score: 0.95,
    prerequisites: [],
    caveats: 'Upfront cost amortizes in ~12 months.',
    region_availability: ['IN'],
    tags: ['energy-efficiency', 'bldc'],
    source_citation: 'BEE India 2023',
    source_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const mockActivity: ActivityContext = {
  category: 'transport',
  activity_name: 'Solo Petrol Car Commute',
  quantity: 20,
  unit: 'km',
  frequency_per_week: 5,
  calculated_co2e_monthly: 73.8, // 20km * 5 days * 4.33 weeks * 0.1705 kg/km
  emission_factor_uncertainty: 0.10,
};

const defaultProfile: UserScoringProfile = {
  region: 'IN',
  effort_level: 'moderate',
  budget_sensitivity: 'medium',
  interests: ['transit', 'urban'],
};

describe('Recommendation Scoring Engine Test Suite', () => {
  describe('Mathematical Properties & Boundedness', () => {
    it('proves all final recommendation scores are strictly bounded within [0.0, 1.0]', () => {
      // Property test across multiple permutations of effort, budget, and activities
      const effortLevels = ['easy', 'moderate', 'committed'] as const;
      const budgetSensitivities = ['low', 'medium', 'high'] as const;

      for (const effort of effortLevels) {
        for (const budget of budgetSensitivities) {
          const testProfile: UserScoringProfile = {
            region: 'IN',
            effort_level: effort,
            budget_sensitivity: budget,
            interests: ['transit'],
          };
          const weights = getCalibratedWeights(testProfile);

          for (const alt of mockAlternatives) {
            const scored = scoreAlternative(alt, mockActivity, testProfile, weights);
            if (scored) {
              expect(scored.score).toBeGreaterThanOrEqual(0.0);
              expect(scored.score).toBeLessThanOrEqual(1.0);
            }
          }
        }
      }
    });

    it('proves emission uncertainty ranges maintain low <= expected <= high', () => {
      for (const alt of mockAlternatives) {
        const range = calculateEmissionSavingsRange(mockActivity, alt);
        expect(range.low).toBeLessThanOrEqual(range.expected);
        expect(range.expected).toBeLessThanOrEqual(range.high);
        expect(range.low).toBeGreaterThanOrEqual(0);
      }
    });

    it('proves cost delta ranges calculate honest variance bounds', () => {
      const altWithSavings = mockAlternatives[0]; // -3200 INR
      const range = calculateCostDeltaRange(altWithSavings);
      expect(range.expected).toBe(-3200);
      expect(range.low).toBeLessThan(range.expected); // greater savings: -3680
      expect(range.high).toBeGreaterThan(range.expected); // conservative savings: -2720
    });

    it('keeps generated recommendation scores and ranges finite and bounded', () => {
      for (let index = 0; index < 300; index++) {
        const baseline = index * 0.73;
        const ratio = (index % 121) / 100;
        const activity = { ...mockActivity, calculated_co2e_monthly: baseline };
        const alternative = { ...mockAlternatives[index % mockAlternatives.length], co2e_saved_ratio: ratio };
        const scored = scoreAlternative(
          alternative,
          activity,
          defaultProfile,
          getCalibratedWeights(defaultProfile)
        );
        if (!scored) continue;

        const range = scored.co2e_saved_range;
        expect(range).not.toBeNull();
        if (!range) continue;
        expect(Number.isFinite(scored.score)).toBe(true);
        expect(scored.score).toBeGreaterThanOrEqual(0);
        expect(scored.score).toBeLessThanOrEqual(1);
        expect(range.low).toBeLessThanOrEqual(range.expected);
        expect(range.expected).toBeLessThanOrEqual(range.high);
      }
    });
  });

  describe('Adaptive Weight Calibration', () => {
    it('shifts effort penalty heavily against committed actions for easy-effort users', () => {
      const easyPenalty = computeEffortPenalty('committed', 'easy');
      const committedPenalty = computeEffortPenalty('committed', 'committed');

      expect(easyPenalty).toBe(0.95);
      expect(committedPenalty).toBe(0.15);
      expect(easyPenalty).toBeGreaterThan(committedPenalty);
    });

    it('adjusts cost weight upward when user has high budget sensitivity', () => {
      const normalWeights = getCalibratedWeights({ effort_level: 'moderate', budget_sensitivity: 'medium' });
      const budgetSensitiveWeights = getCalibratedWeights({ effort_level: 'moderate', budget_sensitivity: 'high' });

      expect(budgetSensitiveWeights.w3_cost_savings).toBeGreaterThan(normalWeights.w3_cost_savings);
    });
  });

  describe('Ranking Order & Output Contracts', () => {
    it('returns top 3 ranked recommendations sorted in descending order of score', () => {
      const results = rankRecommendations(mockActivity, mockAlternatives, defaultProfile, 3);

      expect(results).toHaveLength(3);
      expect(results[0].rank).toBe(1);
      expect(results[1].rank).toBe(2);
      expect(results[2].rank).toBe(3);

      expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
      expect(results[1].score).toBeGreaterThanOrEqual(results[2].score);
    });

    it('includes top 2 explainability factors for every returned recommendation', () => {
      const results = rankRecommendations(mockActivity, mockAlternatives, defaultProfile, 3);

      for (const rec of results) {
        expect(rec.explanation_factors).toHaveLength(2);
        expect(typeof rec.explanation_factors[0]).toBe('string');
        expect(typeof rec.explanation_factors[1]).toBe('string');
        expect(rec.explanation_factors[0].length).toBeGreaterThan(5);
        expect(rec.explanation_factors[1].length).toBeGreaterThan(5);
      }
    });

    it('preserves scientific caveats on applicable alternatives', () => {
      const results = rankRecommendations(mockActivity, mockAlternatives, defaultProfile, 3);
      const metroRec = results.find((r) => r.alternative.id === 'alt-metro-commute');
      expect(metroRec).toBeDefined();
      expect(metroRec?.caveats).toContain('Savings apply if first/last mile');
    });
  });

  describe('Learning Loop & Feedback Adaptation', () => {
    it('suppresses alternatives marked "Not for me" completely', () => {
      const profileWithDismissal: UserScoringProfile = {
        ...defaultProfile,
        dismissed_alternative_ids: ['alt-metro-commute'], // User dismissed metro
      };

      const results = rankRecommendations(mockActivity, mockAlternatives, profileWithDismissal, 3);

      // alt-metro-commute should NOT be present anywhere in results
      const foundDismissed = results.some((r) => r.alternative.id === 'alt-metro-commute');
      expect(foundDismissed).toBe(false);
    });

    it('filters out already adopted alternatives so users get fresh recommendations', () => {
      const profileWithAdopted: UserScoringProfile = {
        ...defaultProfile,
        adopted_alternative_ids: ['alt-metro-commute'],
      };

      const results = rankRecommendations(mockActivity, mockAlternatives, profileWithAdopted, 3);
      const foundAdopted = results.some((r) => r.alternative.id === 'alt-metro-commute');
      expect(foundAdopted).toBe(false);
    });

    it('suppresses a fresh dismissal and lets that suppression decay after 30 days', () => {
      const action = {
        alternative_id: 'alt-metro-commute',
        status: 'not_for_me' as const,
        updated_at: '2026-01-01T00:00:00.000Z',
        category: 'transport' as const,
        tags: ['transit', 'commute'],
      };
      const fresh = calculateLearningAdjustment(mockAlternatives[0], {
        ...defaultProfile,
        reference_time: '2026-01-15T00:00:00.000Z',
        action_history: [action],
      });
      const old = calculateLearningAdjustment(mockAlternatives[0], {
        ...defaultProfile,
        reference_time: '2026-04-15T00:00:00.000Z',
        action_history: [action],
      });

      expect(fresh.isSuppressed).toBe(true);
      expect(old.isSuppressed).toBe(false);
      expect(old.scoreDelta).toBeLessThan(0);
    });

    it('lowers similar alternatives after a dismissal, with recency decay', () => {
      const recentAction = {
        alternative_id: 'alt-other-transit',
        status: 'not_for_me' as const,
        updated_at: '2026-04-01T00:00:00.000Z',
        category: 'transport' as const,
        tags: ['transit', 'commute'],
      };
      const recent = calculateLearningAdjustment(mockAlternatives[0], {
        ...defaultProfile,
        reference_time: '2026-04-02T00:00:00.000Z',
        action_history: [recentAction],
      });
      const old = calculateLearningAdjustment(mockAlternatives[0], {
        ...defaultProfile,
        reference_time: '2026-10-01T00:00:00.000Z',
        action_history: [recentAction],
      });

      expect(recent.scoreDelta).toBeLessThan(0);
      expect(Math.abs(old.scoreDelta)).toBeLessThan(Math.abs(recent.scoreDelta));
    });

    it('boosts similar alternatives after an adoption without rewarding unrelated items', () => {
      const adoptedAction = {
        alternative_id: 'alt-other-transit',
        status: 'adopted' as const,
        updated_at: '2026-04-01T00:00:00.000Z',
        category: 'transport' as const,
        tags: ['transit', 'commute'],
      };
      const similar = calculateLearningAdjustment(mockAlternatives[0], {
        ...defaultProfile,
        reference_time: '2026-04-02T00:00:00.000Z',
        action_history: [adoptedAction],
      });
      const unrelated = calculateLearningAdjustment(mockAlternatives[4], {
        ...defaultProfile,
        reference_time: '2026-04-02T00:00:00.000Z',
        action_history: [adoptedAction],
      });

      expect(similar.scoreDelta).toBeGreaterThan(0);
      expect(unrelated.scoreDelta).toBe(0);
    });
  });

  describe('Cold-Start Handling', () => {
    it('returns high-impact, accessible recommendations when no activities are logged yet', () => {
      const coldStart = getColdStartRecommendations(mockAlternatives, defaultProfile, 3);

      expect(coldStart).toHaveLength(3);
      expect(coldStart[0].rank).toBe(1);
      expect(coldStart[0].score).toBeGreaterThan(0);
      expect(coldStart[0].alternative.is_active).toBe(true);
      expect(coldStart[0].co2e_saved_range).toBeNull();
    });
  });

  describe('Edge Cases & Defensive Handling', () => {
    it('handles activity with zero quantity gracefully without NaN or errors', () => {
      const zeroActivity: ActivityContext = {
        ...mockActivity,
        quantity: 0,
        calculated_co2e_monthly: 0,
      };

      const results = rankRecommendations(zeroActivity, mockAlternatives, defaultProfile, 3);
      expect(results.length).toBeGreaterThan(0);
      for (const r of results) {
        expect(r.co2e_saved_range).not.toBeNull();
        if (!r.co2e_saved_range) continue;
        expect(Number.isNaN(r.score)).toBe(false);
        expect(r.co2e_saved_range.expected).toBe(0);
      }
    });

    it('handles unknown user region by safely falling back to GLOBAL availability', () => {
      const unknownRegionProfile: UserScoringProfile = {
        ...defaultProfile,
        region: 'UNKNOWN_COUNTRY_XYZ',
      };

      const results = rankRecommendations(mockActivity, mockAlternatives, unknownRegionProfile, 3);
      expect(results.length).toBeGreaterThan(0);
      // Eco driving has GLOBAL availability
      const ecoDriving = results.find((r) => r.alternative.id === 'alt-eco-driving');
      expect(ecoDriving).toBeDefined();
    });

    it('handles case where all category alternatives are dismissed without throwing', () => {
      const allDismissedProfile: UserScoringProfile = {
        ...defaultProfile,
        dismissed_alternative_ids: mockAlternatives.map((a) => a.id),
      };

      const results = rankRecommendations(mockActivity, mockAlternatives, allDismissedProfile, 3);
      expect(results).toHaveLength(0); // Gracefully returns empty array
    });

    it('does not use alternatives from unrelated categories as a fallback', () => {
      const energyOnly = mockAlternatives.filter((alternative) => alternative.category === 'energy');
      expect(rankRecommendations(mockActivity, energyOnly, defaultProfile, 3)).toEqual([]);
    });

    it('returns no results for an invalid recommendation limit', () => {
      expect(rankRecommendations(mockActivity, mockAlternatives, defaultProfile, -1)).toEqual([]);
      expect(rankRecommendations(mockActivity, mockAlternatives, defaultProfile, Number.NaN)).toEqual([]);
    });

    it('excludes alternatives not available in the user region', () => {
      expect(normalizeFeasibility(0.9, 'IN', ['EU'], [])).toBe(0);
      const euOnly = {
        ...mockAlternatives[0],
        region_availability: ['EU'],
      };
      expect(scoreAlternative(euOnly, mockActivity, defaultProfile, getCalibratedWeights(defaultProfile))).toBeNull();
    });

    it('keeps global alternatives available when the user region is missing', () => {
      expect(normalizeFeasibility(0.9, undefined, ['GLOBAL'], [])).toBe(0.9);
      expect(normalizeFeasibility(0.9, undefined, ['IN'], [])).toBe(0);
    });

    it('treats non-finite emission inputs as zero rather than producing NaN', () => {
      const range = calculateEmissionSavingsRange(
        { ...mockActivity, calculated_co2e_monthly: Number.NaN, emission_factor_uncertainty: Number.NaN },
        mockAlternatives[0]
      );
      expect(range).toEqual({ low: 0, expected: 0, high: 0 });
      expect(clamp(Number.NaN)).toBe(0);
      expect(calculateCostDeltaRange({ ...mockAlternatives[0], cost_delta_monthly_inr: Number.NaN }))
        .toEqual({ low: 0, expected: 0, high: 0 });
    });

    it('normalizes helper edge values properly', () => {
      expect(clamp(-5)).toBe(0);
      expect(clamp(15)).toBe(1);
      expect(normalizeImpact(1.5, 200)).toBe(1);
      expect(normalizeCostSavings(10000)).toBe(0);
      expect(normalizeCostSavings(-10000)).toBe(1);
    });
  });
});
