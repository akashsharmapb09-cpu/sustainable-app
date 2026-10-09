import { describe, expect, it } from 'vitest';
import type { Goal } from '../../shared/types/database';
import { goalFormSchema, goalProgress } from './goalTracking';

const futureDate = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
const pastDate = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

const goal: Goal = {
  id: 'goal-1',
  user_id: 'user-1',
  category: 'all',
  target_co2e_reduction_pct: 20,
  target_date: '2026-12-31',
  baseline_co2e_monthly: 100,
  baseline_month_start: '2026-10-01',
  achieved: false,
  created_at: '2026-10-08T00:00:00.000Z',
};

describe('reduction goals', () => {
  it('validates goal targets and dates', () => {
    expect(goalFormSchema.safeParse({
      category: 'transport',
      target_co2e_reduction_pct: 25,
      target_date: futureDate,
    }).success).toBe(true);
    expect(goalFormSchema.safeParse({
      category: 'unknown',
      target_co2e_reduction_pct: 0,
      target_date: 'not-a-date',
    }).success).toBe(false);
    expect(goalFormSchema.safeParse({
      category: 'all',
      target_co2e_reduction_pct: 20,
      target_date: '2026-02-30',
    }).success).toBe(false);
    expect(goalFormSchema.safeParse({
      category: 'all',
      target_co2e_reduction_pct: 20,
      target_date: pastDate,
    }).success).toBe(false);
  });

  it('calculates progress against the saved baseline and target', () => {
    expect(goalProgress(goal, 90)).toBe(50);
    expect(goalProgress(goal, 80)).toBe(100);
    expect(goalProgress(goal, 110)).toBe(0);
  });

  it('does not invent progress without a valid baseline', () => {
    expect(goalProgress({ ...goal, baseline_co2e_monthly: null }, 80)).toBeNull();
    expect(goalProgress({ ...goal, baseline_co2e_monthly: 0 }, 0)).toBeNull();
  });
});
