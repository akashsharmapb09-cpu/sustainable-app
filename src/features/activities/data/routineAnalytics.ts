import type { ActivityCategory, ActivityLog, Alternative, UserAction } from '../../../shared/types/database';

export interface RoutineWeeklyPoint {
  label: string;
  start: string;
  kg: number;
}

export interface RoutineCategoryPoint {
  category: ActivityCategory;
  kg: number;
  percentage: number;
}

export interface RoutineDayPoint {
  dateKey: string;
  label: string;
  logged: boolean;
  isToday: boolean;
}

export interface RoutineAnalyticsSummary {
  adopted: Array<{ action: UserAction; alternative: Alternative }>;
  monthlyCo2SavedKg: number;
  monthlyCashSavingsInr: number;
  categoryBreakdown: RoutineCategoryPoint[];
  weeklyTrend: RoutineWeeklyPoint[];
  currentStreakDays: number;
  last14Days: RoutineDayPoint[];
  adoptedSavingsByAlternative: Record<string, number>;
  waterRelatedSwapCount: number;
  currentMonthLogCount: number;
}

const WEEKS_TO_SHOW = 4;
const DAYS_TO_SHOW = 14;
const MONTHS_PER_YEAR = 12;
const WEEKS_PER_MONTH = 4.33;

function validDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function roundKg(value: number): number {
  return Number(Math.max(0, value).toFixed(2));
}

function getActivityDate(log: ActivityLog): Date | null {
  // logged_at is the date the user says the activity happened, not the date the page rendered.
  return validDate(log.logged_at);
}

/**
 * Analytics deliberately uses the same saved activity logs and adopted alternatives as
 * Progress and Recommendations. Alternative CO₂ ratios are applied only to logs whose
 * activity_id matches the alternative's baseline_activity_id.
 */
export function calculateRoutineAnalytics(
  logs: ActivityLog[],
  actions: UserAction[],
  alternatives: Alternative[],
  now: Date = new Date(),
): RoutineAnalyticsSummary {
  const alternativesById = new Map(alternatives.map((alternative) => [alternative.id, alternative]));
  const adopted = actions
    .filter((action) => action.status === 'adopted')
    .map((action) => ({ action, alternative: alternativesById.get(action.alternative_id) }))
    .filter((item): item is { action: UserAction; alternative: Alternative } => Boolean(item.alternative))
    .sort((a, b) => (b.action.adopted_at ?? b.action.updated_at).localeCompare(a.action.adopted_at ?? a.action.updated_at));

  // When several adopted swaps affect the same baseline activity, combine their effects
  // multiplicatively so the total reduction cannot exceed the underlying logged footprint.
  const ratiosByBaseline = new Map<string, number>();
  const adoptedByBaseline = new Map<string, Array<{ id: string; ratio: number }>>();
  for (const { alternative } of adopted) {
    const baselineId = alternative.baseline_activity_id;
    if (!baselineId) continue;
    const ratio = clampRatio(alternative.co2e_saved_ratio);
    if (ratio <= 0) continue;
    const current = ratiosByBaseline.get(baselineId) ?? 0;
    ratiosByBaseline.set(baselineId, 1 - (1 - current) * (1 - ratio));
    const list = adoptedByBaseline.get(baselineId) ?? [];
    list.push({ id: alternative.id, ratio });
    adoptedByBaseline.set(baselineId, list);
  }

  const savingForLog = (log: ActivityLog): number => {
    if (!log.activity_id || !Number.isFinite(log.calculated_co2e_monthly)) return 0;
    const ratio = ratiosByBaseline.get(log.activity_id) ?? 0;
    return Math.max(0, log.calculated_co2e_monthly) * ratio;
  };

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const currentMonthLogs = logs.filter((log) => {
    const loggedAt = getActivityDate(log);
    return !!loggedAt && loggedAt >= monthStart && loggedAt < nextMonthStart;
  });

  let monthlyCo2SavedKg = 0;
  const categoryTotals = new Map<ActivityCategory, number>();
  const baselineTotals = new Map<string, number>();
  for (const log of currentMonthLogs) {
    const saved = savingForLog(log);
    monthlyCo2SavedKg += saved;
    categoryTotals.set(log.category, (categoryTotals.get(log.category) ?? 0) + saved);
    if (log.activity_id) {
      baselineTotals.set(log.activity_id, (baselineTotals.get(log.activity_id) ?? 0) + Math.max(0, log.calculated_co2e_monthly));
    }
  }

  // Share each baseline's combined savings across its adopted alternatives for card-level figures.
  const adoptedSavingsByAlternative: Record<string, number> = {};
  for (const [baselineId, entries] of adoptedByBaseline) {
    const rawRatioTotal = entries.reduce((total, entry) => total + entry.ratio, 0);
    const savedForBaseline = (baselineTotals.get(baselineId) ?? 0) * (ratiosByBaseline.get(baselineId) ?? 0);
    if (rawRatioTotal <= 0) continue;
    for (const entry of entries) {
      adoptedSavingsByAlternative[entry.id] =
        (adoptedSavingsByAlternative[entry.id] ?? 0) + savedForBaseline * (entry.ratio / rawRatioTotal);
    }
  }

  const categoryBreakdown = [...categoryTotals.entries()]
    .filter(([, kg]) => kg > 0)
    .map(([category, kg]) => ({
      category,
      kg: roundKg(kg),
      percentage: monthlyCo2SavedKg > 0 ? Math.round((kg / monthlyCo2SavedKg) * 100) : 0,
    }))
    .sort((a, b) => b.kg - a.kg);

  // Each activity log stores a monthly estimate. For the weekly chart, convert it to
  // a weekly equivalent and group it by the date the activity was logged.
  const currentWeekStart = startOfDay(now);
  currentWeekStart.setDate(currentWeekStart.getDate() - ((currentWeekStart.getDay() + 6) % 7));
  const weeklyTrend: RoutineWeeklyPoint[] = [];
  for (let index = WEEKS_TO_SHOW - 1; index >= 0; index -= 1) {
    const start = new Date(currentWeekStart);
    start.setDate(start.getDate() - index * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const kg = logs.reduce((total, log) => {
      const loggedAt = getActivityDate(log);
      if (!loggedAt || loggedAt < start || loggedAt >= end) return total;
      return total + savingForLog(log) / WEEKS_PER_MONTH;
    }, 0);
    weeklyTrend.push({
      label: new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' }).format(start),
      start: dateKey(start),
      kg: roundKg(kg),
    });
  }

  // Count consecutive days with at least one self-reported activity log. Allow the
  // current day to be empty until midnight by starting from yesterday when appropriate.
  const loggedDateKeys = new Set(
    logs
      .map(getActivityDate)
      .filter((date): date is Date => Boolean(date))
      .map(dateKey),
  );
  const today = startOfDay(now);
  let streakCursor = today;
  if (!loggedDateKeys.has(dateKey(streakCursor))) {
    const yesterday = new Date(streakCursor);
    yesterday.setDate(yesterday.getDate() - 1);
    if (loggedDateKeys.has(dateKey(yesterday))) streakCursor = yesterday;
  }
  let currentStreakDays = 0;
  while (loggedDateKeys.has(dateKey(streakCursor))) {
    currentStreakDays += 1;
    streakCursor.setDate(streakCursor.getDate() - 1);
  }

  const last14Days: RoutineDayPoint[] = [];
  for (let index = DAYS_TO_SHOW - 1; index >= 0; index -= 1) {
    const day = new Date(today);
    day.setDate(day.getDate() - index);
    last14Days.push({
      dateKey: dateKey(day),
      label: new Intl.DateTimeFormat(undefined, { weekday: 'narrow' }).format(day),
      logged: loggedDateKeys.has(dateKey(day)),
      isToday: dateKey(day) === dateKey(today),
    });
  }

  const monthlyCashSavingsInr = adopted.reduce(
    (total, { alternative }) => total - alternative.cost_delta_monthly_inr,
    0,
  );
  const waterRelatedSwapCount = adopted.filter(({ alternative }) =>
    alternative.tags.some((tag) => /water|shower|aerator|water-heater/i.test(tag)),
  ).length;

  // Water litres are not a field in the app's activity/alternative schema. Expose the
  // count of water-related adopted swaps, but do not invent a volume estimate.
  return {
    adopted,
    monthlyCo2SavedKg: roundKg(monthlyCo2SavedKg),
    monthlyCashSavingsInr: Math.round(monthlyCashSavingsInr),
    categoryBreakdown,
    weeklyTrend,
    currentStreakDays,
    last14Days,
    adoptedSavingsByAlternative: Object.fromEntries(
      Object.entries(adoptedSavingsByAlternative).map(([id, kg]) => [id, roundKg(kg)]),
    ),
    waterRelatedSwapCount,
    currentMonthLogCount: currentMonthLogs.length,
  };
}
