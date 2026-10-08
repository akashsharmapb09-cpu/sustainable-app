import type { Alternative } from '../../../shared/types/database';
import type {
  ActivityContext,
  ScoredRecommendation,
  UserScoringProfile,
  FactorSubScores,
  EngineWeights,
} from './types';
import { getCalibratedWeights } from './weights';
import {
  clamp,
  normalizeImpact,
  normalizeCostSavings,
  normalizeFeasibility,
  computePreferenceMatch,
  computeEffortPenalty,
} from './normalizer';
import { calculateEmissionSavingsRange, calculateCostDeltaRange } from './emissionCalculator';
import { calculateLearningAdjustment } from './learningLoop';

/**
 * Computes top 2 explainability factors based on strongest subscore contributions
 */
function deriveExplanationFactors(
  subScores: FactorSubScores,
  alt: Alternative,
  co2eSavedMonthly: number
): [string, string] {
  const reasons: Array<{ weight: number; text: string }> = [];

  // Impact factor
  if (subScores.impact > 0.6) {
    const pct = Math.round(alt.co2e_saved_ratio * 100);
    reasons.push({
      weight: subScores.impact * 1.2,
      text: `Reduces carbon footprint by ${pct}% (~${Math.round(co2eSavedMonthly)} kg CO2e/month)`,
    });
  }

  // Cost factor
  if (alt.cost_delta_monthly_inr < -500) {
    const savings = Math.abs(Math.round(alt.cost_delta_monthly_inr));
    reasons.push({
      weight: subScores.costSavings * 1.1,
      text: `Saves an estimated ₹${savings.toLocaleString('en-IN')}/month in expenses`,
    });
  }

  // Effort / Feasibility factor
  if (alt.difficulty === 'easy') {
    reasons.push({
      weight: (1 - subScores.effortPenalty) * 0.9,
      text: 'Straightforward to adopt with zero lifestyle friction',
    });
  } else if (subScores.feasibility > 0.8) {
    reasons.push({
      weight: subScores.feasibility * 0.8,
      text: 'Readily accessible in your region with established infrastructure',
    });
  }

  // Preference factor
  if (subScores.preferenceMatch > 0.7) {
    reasons.push({
      weight: subScores.preferenceMatch,
      text: 'Strongly aligned with your stated lifestyle focus areas',
    });
  }

  // Fallbacks if fewer than 2 reasons triggered
  if (reasons.length === 0) {
    reasons.push({ weight: 0.5, text: 'Verified lower-emission alternative with established data' });
  }
  if (reasons.length === 1) {
    reasons.push({ weight: 0.4, text: 'Pragmatic step toward household carbon reduction' });
  }

  reasons.sort((a, b) => b.weight - a.weight);
  return [reasons[0].text, reasons[1].text];
}

/**
 * Scores an individual alternative against an activity context and user profile
 */
export function scoreAlternative(
  alternative: Alternative,
  activity: ActivityContext,
  profile: UserScoringProfile,
  weights: EngineWeights
): ScoredRecommendation | null {
  // 1. Check learning loop suppression
  const learning = calculateLearningAdjustment(alternative, profile);
  if (learning.isSuppressed) {
    return null;
  }

  // 2. Emission & cost calculations
  const co2eRange = calculateEmissionSavingsRange(activity, alternative);
  const costRange = calculateCostDeltaRange(alternative);

  // 3. Compute factor subscores (each 0.0 - 1.0)
  const impact = normalizeImpact(alternative.co2e_saved_ratio, co2eRange.expected);
  const feasibility = normalizeFeasibility(
    alternative.feasibility_score,
    profile.region || 'IN',
    alternative.region_availability || ['GLOBAL'],
    alternative.prerequisites || []
  );
  const costSavings = normalizeCostSavings(alternative.cost_delta_monthly_inr);
  const preferenceMatch = computePreferenceMatch(
    alternative.category,
    alternative.tags || [],
    profile.interests || []
  );
  const effortPenalty = computeEffortPenalty(alternative.difficulty, profile.effort_level);

  // 4. Calculate raw score
  // Formula: Score = w1*impact + w2*feasibility + w3*cost_savings + w4*preference_match - w5*effort_penalty + delta
  const rawScore =
    weights.w1_impact * impact +
    weights.w2_feasibility * feasibility +
    weights.w3_cost_savings * costSavings +
    weights.w4_preference_match * preferenceMatch -
    weights.w5_effort_penalty * effortPenalty +
    learning.scoreDelta;

  const finalScore = Number(clamp(rawScore, 0.0, 1.0).toFixed(4));

  const subScores: FactorSubScores = {
    impact: Number(impact.toFixed(3)),
    feasibility: Number(feasibility.toFixed(3)),
    costSavings: Number(costSavings.toFixed(3)),
    preferenceMatch: Number(preferenceMatch.toFixed(3)),
    effortPenalty: Number(effortPenalty.toFixed(3)),
    historyAdjustment: Number(learning.scoreDelta.toFixed(3)),
  };

  // Determine confidence rating
  let confidence: 'high' | 'medium' | 'moderate' = 'moderate';
  if (feasibility >= 0.8 && impact >= 0.5) {
    confidence = 'high';
  } else if (feasibility >= 0.6) {
    confidence = 'medium';
  }

  // Generate plain English explanation factors
  const explanationFactors = deriveExplanationFactors(subScores, alternative, co2eRange.expected);

  return {
    alternative,
    score: finalScore,
    rank: 1, // Will be set after multi-candidate sorting
    confidence,
    co2e_saved_range: co2eRange,
    cost_delta_range: costRange,
    explanation_factors: explanationFactors,
    caveats: alternative.caveats || null,
    subScores,
  };
}

/**
 * Returns top ranked alternatives for a logged activity
 */
export function rankRecommendations(
  activity: ActivityContext,
  allAlternatives: Alternative[],
  profile: UserScoringProfile,
  limit = 3
): ScoredRecommendation[] {
  const weights = getCalibratedWeights(profile);

  // Filter candidates matching the category
  let candidates = allAlternatives.filter(
    (alt) => alt.category === activity.category && alt.is_active
  );

  // If no candidates in direct category, fallback to all active
  if (candidates.length === 0) {
    candidates = allAlternatives.filter((alt) => alt.is_active);
  }

  const scoredList: ScoredRecommendation[] = [];

  for (const alt of candidates) {
    const scored = scoreAlternative(alt, activity, profile, weights);
    if (scored !== null) {
      scoredList.push(scored);
    }
  }

  // Sort descending by score
  scoredList.sort((a, b) => b.score - a.score);

  // Assign final rank indices
  const topRanked = scoredList.slice(0, limit).map((rec, index) => ({
    ...rec,
    rank: index + 1,
  }));

  return topRanked;
}

/**
 * Cold-Start Recommendation Handler
 * When the user has not logged any activities yet, surfaces top high-impact,
 * low-friction, high-feasibility options tailored to their onboarding profile.
 */
export function getColdStartRecommendations(
  allAlternatives: Alternative[],
  profile: UserScoringProfile,
  limit = 3
): ScoredRecommendation[] {
  // Synthetic baseline activity representing average urban household baseline
  const syntheticActivity: ActivityContext = {
    category: 'energy',
    activity_name: 'Average Urban Household Baseline',
    quantity: 150,
    unit: 'kWh',
    frequency_per_week: 7,
    calculated_co2e_monthly: 107.4, // Average 150 kWh grid baseline
    emission_factor_uncertainty: 0.10,
  };

  const weights = getCalibratedWeights(profile);
  const scoredList: ScoredRecommendation[] = [];

  for (const alt of allAlternatives.filter((a) => a.is_active)) {
    const scored = scoreAlternative(alt, syntheticActivity, profile, weights);
    if (scored !== null) {
      scoredList.push(scored);
    }
  }

  // Sort descending by score
  scoredList.sort((a, b) => b.score - a.score);

  return scoredList.slice(0, limit).map((rec, index) => ({
    ...rec,
    rank: index + 1,
  }));
}
