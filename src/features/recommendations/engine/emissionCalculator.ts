import type { Alternative } from '../../../shared/types/database';
import { parseCO2ToKg } from '../../../shared/lib/co2';
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
  const baselineValue = baselineActivity?.calculated_co2e_monthly;
  const baselineMonthly = Number.isFinite(baselineValue)
    ? parseCO2ToKg(`${Math.max(0, baselineValue)} kg`)
    : 0;
  const ratio = Number.isFinite(alternative.co2e_saved_ratio)
    ? Math.max(0, Math.min(1.0, alternative.co2e_saved_ratio))
    : 0;
  const rawExpected = baselineMonthly * ratio;
  const expected = Number.isFinite(rawExpected) ? parseCO2ToKg(`${rawExpected} kg`) : 0;

  // Uncertainty factor: standard 10% to 15% uncertainty in life-cycle analysis
  const requestedUncertainty = baselineActivity.emission_factor_uncertainty ?? 0.12;
  const uncertainty = Number.isFinite(requestedUncertainty)
    ? Math.max(0, Math.min(0.5, requestedUncertainty))
    : 0.12;

  const rawLow = expected * (1 - uncertainty);
  const rawHigh = expected * (1 + uncertainty);
  const low = Number.isFinite(rawLow) ? parseCO2ToKg(`${Number(rawLow.toFixed(2))} kg`) : 0;
  const high = Number.isFinite(rawHigh) ? parseCO2ToKg(`${Number(rawHigh.toFixed(2))} kg`) : 0;

  return {
    low: Math.max(0, low),
    expected: parseCO2ToKg(`${Number(expected.toFixed(2))} kg`),
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
