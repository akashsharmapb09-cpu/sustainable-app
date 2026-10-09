import type { Alternative } from '../../../shared/types/database';
import type { UserScoringProfile } from './types';

export interface LearningAdjustment {
  isSuppressed: boolean;
  scoreDelta: number;
  reason?: string;
}

const ACTION_DECAY_DAYS = 90;
const EXPLICIT_DISMISSAL_SUPPRESSION_DAYS = 30;

function getActionRecency(actionDate: string, referenceTime: string): number {
  const actionTimestamp = Date.parse(actionDate);
  const referenceTimestamp = Date.parse(referenceTime);
  if (!Number.isFinite(actionTimestamp) || !Number.isFinite(referenceTimestamp)) return 0;

  const ageDays = Math.max(0, (referenceTimestamp - actionTimestamp) / 86_400_000);
  return Math.exp(-ageDays / ACTION_DECAY_DAYS);
}

function getSimilarity(
  category: string,
  tags: string[],
  actionCategory?: string,
  actionTags: string[] = []
): number {
  if (!actionCategory) return 0;
  const categoryMatch = category === actionCategory ? 0.5 : 0;
  const candidateTags = new Set(tags.map((tag) => tag.toLowerCase()));
  const priorTags = new Set(actionTags.map((tag) => tag.toLowerCase()));
  if (candidateTags.size === 0 || priorTags.size === 0) return categoryMatch;

  const overlap = [...candidateTags].filter((tag) => priorTags.has(tag)).length;
  const tagMatch = (overlap / Math.max(candidateTags.size, priorTags.size)) * 0.5;
  return categoryMatch + tagMatch;
}

/**
 * Applies recent feedback with a 90-day exponential decay. An explicit dismissal
 * suppresses that item for 30 days; older feedback becomes a diminishing penalty.
 */
export function calculateLearningAdjustment(
  alternative: Alternative,
  profile: UserScoringProfile
): LearningAdjustment {
  const history = profile.action_history;
  if (!history) {
    const dismissed = profile.dismissed_alternative_ids || [];
    const adopted = profile.adopted_alternative_ids || [];
    if (dismissed.includes(alternative.id)) {
      return { isSuppressed: true, scoreDelta: -1, reason: 'Previously dismissed by user' };
    }
    if (adopted.includes(alternative.id)) {
      return { isSuppressed: true, scoreDelta: 0, reason: 'Already adopted' };
    }
    return { isSuppressed: false, scoreDelta: 0 };
  }

  let scoreDelta = 0;
  let isSuppressed = false;

  for (const action of history) {
    if (action.status === 'maybe_later') continue;

    const recency = getActionRecency(action.updated_at, profile.reference_time ?? '');
    if (recency === 0) continue;

    if (action.alternative_id === alternative.id) {
      if (action.status === 'adopted') {
        isSuppressed = true;
      } else if (recency >= Math.exp(-EXPLICIT_DISMISSAL_SUPPRESSION_DAYS / ACTION_DECAY_DAYS)) {
        isSuppressed = true;
      } else {
        scoreDelta -= 0.2 * recency;
      }
      continue;
    }

    const similarity = getSimilarity(
      alternative.category,
      alternative.tags ?? [],
      action.category,
      action.tags
    );
    if (similarity > 0) {
      scoreDelta += (action.status === 'adopted' ? 0.08 : -0.12) * recency * similarity;
    }
  }

  return {
    isSuppressed,
    scoreDelta: Math.max(-0.25, Math.min(0.25, scoreDelta)),
    reason: isSuppressed ? 'Recently dismissed or already adopted' : undefined,
  };
}
