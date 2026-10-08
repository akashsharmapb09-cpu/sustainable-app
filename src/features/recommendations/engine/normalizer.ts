import type { EffortLevel } from '../../../shared/types/database';

/**
 * Clamps numeric value strictly between [min, max]
 */
export function clamp(val: number, min = 0.0, max = 1.0): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Normalizes CO2e impact to 0..1 scale
 * Higher proportional and absolute emissions cut yields higher score
 */
export function normalizeImpact(ratio: number, expectedSavedKg: number): number {
  // Blend fractional reduction ratio (70%) with absolute kg saved scale (30%)
  const clampedRatio = clamp(ratio, 0.0, 1.0);
  const absoluteScale = clamp(expectedSavedKg / 100.0, 0.0, 1.0); // 100kg/mo is benchmark high
  return clamp(clampedRatio * 0.7 + absoluteScale * 0.3);
}

/**
 * Normalizes monthly cost delta to 0..1 scale
 * Negative cost delta represents financial savings (desirable).
 * Positive cost delta represents recurring expenditure.
 */
export function normalizeCostSavings(costDeltaMonthlyInr: number): number {
  // Benchmark: saving ₹3000/mo maps to ~0.90, neutral ₹0 maps to ~0.55, +₹2500 cost maps to ~0.15
  const normalized = 0.55 - (costDeltaMonthlyInr / 5000.0) * 0.45;
  return clamp(normalized, 0.0, 1.0);
}

/**
 * Calculates geographic and prerequisite feasibility (0..1)
 */
export function normalizeFeasibility(
  baseFeasibility: number,
  userRegion: string,
  regionAvailability: string[],
  prerequisites: string[]
): number {
  const isRegionAvailable =
    regionAvailability.includes('GLOBAL') || regionAvailability.includes(userRegion);

  if (!isRegionAvailable) {
    return 0.1; // Steep penalty if not available in region
  }

  // Slight deduction for each prerequisite requirement
  const prereqDeduction = Math.min(0.2, (prerequisites?.length || 0) * 0.05);
  return clamp(baseFeasibility - prereqDeduction, 0.1, 1.0);
}

/**
 * Calculates preference alignment based on user interests and alternative tags (0..1)
 */
export function computePreferenceMatch(
  category: string,
  tags: string[],
  userInterests: string[]
): number {
  if (!userInterests || userInterests.length === 0) {
    return 0.5; // Neutral baseline when user has selected no specific interests
  }

  const normalizedInterests = userInterests.map((i) => i.toLowerCase().trim());
  const normalizedTags = [...tags.map((t) => t.toLowerCase().trim()), category.toLowerCase().trim()];

  let matches = 0;
  for (const interest of normalizedInterests) {
    if (normalizedTags.some((tag) => tag.includes(interest) || interest.includes(tag))) {
      matches++;
    }
  }

  // Scale from 0.5 (no match) up to 1.0 (strong match)
  const boost = Math.min(0.5, matches * 0.2);
  return clamp(0.5 + boost, 0.0, 1.0);
}

/**
 * Computes effort penalty based on user tolerance vs alternative difficulty (0..1)
 */
export function computeEffortPenalty(
  altDifficulty: EffortLevel,
  userEffort: EffortLevel
): number {
  if (altDifficulty === 'easy') {
    return 0.0; // Zero penalty for effortless actions
  }

  if (altDifficulty === 'moderate') {
    switch (userEffort) {
      case 'easy':
        return 0.5;
      case 'moderate':
        return 0.2;
      case 'committed':
        return 0.05;
    }
  }

  if (altDifficulty === 'committed') {
    switch (userEffort) {
      case 'easy':
        return 0.95; // Extreme penalty: easy users will rarely see committed actions
      case 'moderate':
        return 0.55;
      case 'committed':
        return 0.15;
    }
  }

  return 0.2;
}
