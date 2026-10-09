import type { ActivityLog, Badge, Challenge, Goal, Profile, UserAction, UserActionStatus, UserBadge, UserChallenge } from '../types/database';

const k = {
  profile: (userId: string) => `greenswap:profile:${userId}`,
  logs: (userId: string) => `greenswap:logs:${userId}`,
  actions: (userId: string) => `greenswap:actions:${userId}`,
  challenges: (userId: string) => `greenswap:challenges:${userId}`,
  goals: (userId: string) => `greenswap:goals:${userId}`,
  badges: (userId: string) => `greenswap:badges:${userId}`,
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalProfile(userId: string): Profile | null {
  return read<Profile | null>(k.profile(userId), null);
}

export function setLocalProfile(profile: Profile) {
  write(k.profile(profile.id), profile);
}

export function clearLocalUserData(userId: string) {
  localStorage.removeItem(k.profile(userId));
  localStorage.removeItem(k.logs(userId));
  localStorage.removeItem(k.actions(userId));
  localStorage.removeItem(k.challenges(userId));
  localStorage.removeItem(k.goals(userId));
  localStorage.removeItem(k.badges(userId));
}

export function getLocalLogs(userId: string): ActivityLog[] {
  return read<ActivityLog[]>(k.logs(userId), []);
}

export function upsertLocalLog(userId: string, log: ActivityLog) {
  const logs = getLocalLogs(userId).filter((item) => item.id !== log.id);
  logs.unshift(log);
  write(k.logs(userId), logs);
}

export function deleteLocalLog(userId: string, id: string) {
  write(
    k.logs(userId),
    getLocalLogs(userId).filter((item) => item.id !== id)
  );
}

export function getLocalActions(userId: string): UserAction[] {
  return read<UserAction[]>(k.actions(userId), []);
}

export function upsertLocalAction(
  userId: string,
  alternativeId: string,
  status: UserActionStatus
): UserAction {
  const now = new Date().toISOString();
  const existing = getLocalActions(userId);
  const next: UserAction = {
    id: `${userId}:${alternativeId}`,
    user_id: userId,
    alternative_id: alternativeId,
    status,
    adopted_at: status === 'adopted' ? now : null,
    feedback_reason: null,
    created_at: existing.find((a) => a.alternative_id === alternativeId)?.created_at ?? now,
    updated_at: now,
  };
  write(k.actions(userId), [
    next,
    ...existing.filter((item) => item.alternative_id !== alternativeId),
  ]);
  return next;
}

export function getLocalChallenges(userId: string): UserChallenge[] {
  return read<UserChallenge[]>(k.challenges(userId), []);
}

export function upsertLocalChallenge(
  userId: string,
  challengeId: string,
  status: UserChallenge['status']
): UserChallenge {
  const now = new Date().toISOString();
  const existing = getLocalChallenges(userId);
  const next: UserChallenge = {
    id: `${userId}:${challengeId}`,
    user_id: userId,
    challenge_id: challengeId,
    status,
    started_at: existing.find((item) => item.challenge_id === challengeId)?.started_at ?? now,
    completed_at: status === 'completed' ? now : null,
  };
  write(k.challenges(userId), [
    next,
    ...existing.filter((item) => item.challenge_id !== challengeId),
  ]);
  return next;
}

export function getLocalGoals(userId: string): Goal[] {
  return read<Goal[]>(k.goals(userId), []);
}

export function addLocalGoal(goal: Goal): Goal {
  const goals = getLocalGoals(goal.user_id);
  write(k.goals(goal.user_id), [goal, ...goals]);
  return goal;
}

export function getLocalBadges(userId: string): UserBadge[] {
  return read<UserBadge[]>(k.badges(userId), []);
}

export function awardLocalChallengeBadge(userId: string, badgeKey: string | null): UserBadge | null {
  if (!badgeKey) return null;
  const existing = getLocalBadges(userId);
  const alreadyAwarded = existing.find((badge) => badge.badge_key === badgeKey);
  if (alreadyAwarded) return alreadyAwarded;
  const badge: UserBadge = {
    id: `${userId}:${badgeKey}`,
    user_id: userId,
    badge_key: badgeKey,
    awarded_at: new Date().toISOString(),
  };
  write(k.badges(userId), [badge, ...existing]);
  return badge;
}

export const DEMO_BADGES: Badge[] = [
  {
    key: 'badge-transit-commuter',
    name: 'Metro Pioneer',
    description: 'Adopted public transit or active cycling for primary commute',
    icon_name: 'Train',
    requirement_description: 'Complete the Transit 10 challenge',
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    key: 'badge-watt-shaver',
    name: 'Kilowatt Tamer',
    description: 'Implemented 2 or more household power-saving actions',
    icon_name: 'Zap',
    requirement_description: 'Adopt BLDC fans or AC 24°C calibration',
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    key: 'badge-plant-power',
    name: 'Field Forager',
    description: 'Shifted away from heavy ruminant meats toward local pulses and millets',
    icon_name: 'Leaf',
    requirement_description: 'Adopt plant-rich diet alternatives',
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    key: 'badge-zero-waste-scout',
    name: 'Compost Sentinel',
    description: 'Initiated home composting or source waste segregation',
    icon_name: 'Recycle',
    requirement_description: 'Adopt organic waste composting or two-bin segregation',
    created_at: '2026-01-01T00:00:00.000Z',
  },
];

export const DEMO_CHALLENGES: Challenge[] = [
  {
    id: 'chal-meatless-workweek',
    title: 'Plant-Rich Workweek',
    description: 'Choose vegetarian, millet, or dal-based meals during weekday lunches.',
    category: 'food',
    duration_days: 5,
    co2e_impact_potential_kg: 8.5,
    badge_key: 'badge-plant-power',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'chal-transit-sprint',
    title: 'Transit 10',
    description: 'Complete ten rides using metro rail, city buses, or suburban trains.',
    category: 'transport',
    duration_days: 14,
    co2e_impact_potential_kg: 18.2,
    badge_key: 'badge-transit-commuter',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'chal-ac-calibration-7d',
    title: '24°C Cool Calibration',
    description: 'Set household AC units to 24°C or higher with ceiling fan support.',
    category: 'energy',
    duration_days: 7,
    co2e_impact_potential_kg: 12,
    badge_key: 'badge-watt-shaver',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'chal-zero-pet-water',
    title: 'Bottleless Fortnight',
    description: 'Carry a reusable flask and avoid buying single-use bottled water.',
    category: 'waste',
    duration_days: 14,
    co2e_impact_potential_kg: 2.5,
    badge_key: 'badge-zero-waste-scout',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'chal-vampire-power-hunt',
    title: 'Phantom Power Cut',
    description: 'Switch off entertainment and computer devices at the wall before sleep.',
    category: 'energy',
    duration_days: 7,
    co2e_impact_potential_kg: 3.8,
    badge_key: 'badge-watt-shaver',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'chal-local-mandi-sweep',
    title: 'Local Mandi Basket',
    description: 'Cook with in-season regional vegetables sourced from local growers.',
    category: 'food',
    duration_days: 7,
    co2e_impact_potential_kg: 5,
    badge_key: 'badge-plant-power',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
];

export function defaultProfile(userId: string, email: string, fullName?: string | null): Profile {
  const now = new Date().toISOString();
  return {
    id: userId,
    email,
    full_name: fullName ?? null,
    region: 'IN',
    household_size: 3,
    diet: 'omnivore',
    commute_mode: 'car_petrol',
    budget_sensitivity: 'medium',
    effort_level: 'moderate',
    interests: ['energy', 'transport'],
    preferred_currency: 'INR',
    preferred_units: 'metric',
    onboarding_completed: false,
    created_at: now,
    updated_at: now,
  };
}
