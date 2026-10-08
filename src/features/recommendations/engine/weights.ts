import type { EngineWeights, UserScoringProfile } from './types';

/**
 * Computes transparent scoring weights calibrated to user profile
 * 
 * Formula:
 * Score = w1*impact + w2*feasibility + w3*cost_savings + w4*preference_match - w5*effort_penalty
 */
export function getCalibratedWeights(profile: Pick<UserScoringProfile, 'effort_level' | 'budget_sensitivity'>): EngineWeights {
  let base: EngineWeights;

  switch (profile.effort_level) {
    case 'easy':
      base = {
        w1_impact: 0.25,
        w2_feasibility: 0.35,
        w3_cost_savings: 0.20,
        w4_preference_match: 0.20,
        w5_effort_penalty: 0.30,
      };
      break;

    case 'committed':
      base = {
        w1_impact: 0.45,
        w2_feasibility: 0.20,
        w3_cost_savings: 0.15,
        w4_preference_match: 0.20,
        w5_effort_penalty: 0.05,
      };
      break;

    case 'moderate':
    default:
      base = {
        w1_impact: 0.35,
        w2_feasibility: 0.25,
        w3_cost_savings: 0.20,
        w4_preference_match: 0.20,
        w5_effort_penalty: 0.15,
      };
      break;
  }

  // Adjust for budget sensitivity
  if (profile.budget_sensitivity === 'high') {
    base.w3_cost_savings += 0.10;
    base.w1_impact = Math.max(0.15, base.w1_impact - 0.05);
    base.w4_preference_match = Math.max(0.10, base.w4_preference_match - 0.05);
  } else if (profile.budget_sensitivity === 'low') {
    base.w3_cost_savings = Math.max(0.05, base.w3_cost_savings - 0.05);
    base.w1_impact += 0.05;
  }

  return base;
}
