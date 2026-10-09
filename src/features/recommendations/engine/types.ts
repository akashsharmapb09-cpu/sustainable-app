import type { ActivityCategory, EffortLevel, Alternative } from '../../../shared/types/database';

export interface UserScoringProfile {
  id?: string;
  region?: string | null;
  effort_level: EffortLevel;
  budget_sensitivity: 'low' | 'medium' | 'high';
  interests: string[];
  adopted_alternative_ids?: string[];
  dismissed_alternative_ids?: string[];
  action_history?: Array<{
    alternative_id: string;
    status: 'adopted' | 'maybe_later' | 'not_for_me';
    updated_at: string;
    category?: ActivityCategory;
    tags?: string[];
  }>;
  reference_time?: string;
  preferred_currency?: 'INR' | 'USD' | 'EUR';
}

export interface ActivityContext {
  id?: string;
  category: ActivityCategory;
  activity_name: string;
  quantity: number;
  unit: string;
  frequency_per_week: number;
  calculated_co2e_monthly: number;
  emission_factor_uncertainty?: number; // e.g. 0.10 for +/- 10%
}

export interface FactorSubScores {
  impact: number;          // 0.0 - 1.0
  feasibility: number;     // 0.0 - 1.0
  costSavings: number;     // 0.0 - 1.0
  preferenceMatch: number; // 0.0 - 1.0
  effortPenalty: number;   // 0.0 - 1.0
  historyAdjustment: number; // e.g. -0.2 to +0.2
}

export interface ScoredRecommendation {
  alternative: Alternative;
  score: number;           // Final normalized score (0.0 - 1.0)
  rank: number;            // 1, 2, 3...
  confidence: 'high' | 'medium' | 'moderate';
  co2e_saved_range: {
    low: number;
    expected: number;
    high: number;
  } | null;
  cost_delta_range: {
    low: number;
    expected: number;
    high: number;
  };
  explanation_factors: [string, string]; // Top 2 reasons in clear plain English
  caveats: string | null;
  subScores: FactorSubScores;
}

export interface EngineWeights {
  w1_impact: number;
  w2_feasibility: number;
  w3_cost_savings: number;
  w4_preference_match: number;
  w5_effort_penalty: number;
}
