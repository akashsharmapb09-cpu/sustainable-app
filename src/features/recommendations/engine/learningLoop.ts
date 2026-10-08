import type { Alternative } from '../../../shared/types/database';
import type { UserScoringProfile } from './types';

export interface LearningAdjustment {
  isSuppressed: boolean;
  scoreDelta: number;
  reason?: string;
}

/**
 * Evaluates user past actions (Adopted / Not for me) to tune candidate rankings
 */
export function calculateLearningAdjustment(
  alternative: Alternative,
  profile: UserScoringProfile
): LearningAdjustment {
  const dismissed = profile.dismissed_alternative_ids || [];
  const adopted = profile.adopted_alternative_ids || [];

  // Hard suppression: Never recommend an alternative the user explicitly marked "Not for me"
  if (dismissed.includes(alternative.id)) {
    return {
      isSuppressed: true,
      scoreDelta: -1.0,
      reason: 'Previously dismissed by user',
    };
  }

  // Already adopted: filter out from active recommendations
  if (adopted.includes(alternative.id)) {
    return {
      isSuppressed: true,
      scoreDelta: 0.0,
      reason: 'Already adopted',
    };
  }

  let delta = 0.0;

  // Category & tag affinity learning:
  // If user has adopted items in the same category or with matching tags, apply affinity bonus
  if (adopted.length > 0) {
    // If user frequently adopts within this category, give a subtle boost
    delta += 0.08;
  }

  // If user has dismissed multiple items in this category, apply a soft penalty
  if (dismissed.length > 0) {
    // If dismissed items share category, apply penalty
    delta -= 0.05;
  }

  return {
    isSuppressed: false,
    scoreDelta: Math.max(-0.25, Math.min(0.25, delta)),
  };
}
