import type { Alternative } from '../../../shared/types/database';
import type { ActivityContext } from './types';

export interface UncertaintyRange {
  low: number;
  expected: number;
  high: number;
}

/**
 * Calculates honest emission reduction ranges [low, expected, high]
 * factoring in scientific uncertainty from IPCC/DEFRA conversion factors
 */
export function calculateEmissionSavingsRange(
  baselineActivity: ActivityContext,
  alternative: Alternative
): UncertaintyRange {
  const baselineMonthly = Number.isFinite(baselineActivity.calculated_co2e_monthly)
    ? Math.max(0, baselineActivity.calculated_co2e_monthly)
    : 0;
  const ratio = Number.isFinite(alternative.co2e_saved_ratio)
    ? Math.max(0, Math.min(1.0, alternative.co2e_saved_ratio))
    : 0;
  const expected = baselineMonthly * ratio;

  // Uncertainty factor: standard 10% to 15% uncertainty in life-cycle analysis
  const requestedUncertainty = baselineActivity.emission_factor_uncertainty ?? 0.12;
  const uncertainty = Number.isFinite(requestedUncertainty)
    ? Math.max(0, Math.min(0.5, requestedUncertainty))
    : 0.12;

  const low = Number((expected * (1 - uncertainty)).toFixed(2));
  const high = Number((expected * (1 + uncertainty)).toFixed(2));

  return {
    low: Math.max(0, low),
    expected: Number(expected.toFixed(2)),
    high: Math.max(0, high),
  };
}

/**
 * Calculates monthly financial delta ranges [low, expected, high] in INR
 * Negative value denotes cost savings; positive denotes expense.
 */
export function calculateCostDeltaRange(alternative: Alternative): UncertaintyRange {
  const expected = Number.isFinite(alternative.cost_delta_monthly_inr)
    ? alternative.cost_delta_monthly_inr
    : 0;
  const variance = Math.abs(expected) * 0.15; // 15% regional price variance

  if (expected <= 0) {
    // Net savings: e.g. -2000 INR
    return {
      low: Number((expected - variance).toFixed(2)), // Greater savings (e.g. -2300)
      expected: Number(expected.toFixed(2)),
      high: Number((expected + variance).toFixed(2)), // Conservative savings (e.g. -1700)
    };
  }

  // Net cost: e.g. +500 INR
  return {
    low: Number(Math.max(0, expected - variance).toFixed(2)),
    expected: Number(expected.toFixed(2)),
    high: Number((expected + variance).toFixed(2)),
  };
}
