import { z } from 'zod';
import type { Goal } from '../../shared/types/database';

export const goalFormSchema = z.object({
  category: z.enum(['transport', 'food', 'energy', 'shopping', 'waste', 'travel', 'all']),
  target_co2e_reduction_pct: z.number()
    .finite('Enter a valid reduction target.')
    .min(1, 'Choose a target of at least 1%.')
    .max(100, 'A reduction target cannot exceed 100%.'),
  target_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a valid target date.')
    .refine((date) => {
      const parsed = new Date(`${date}T00:00:00.000Z`);
      return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
    }, 'Choose a valid target date.')
    .refine((date) => date >= new Date().toISOString().slice(0, 10), 'Choose today or a future target date.'),
});

export type GoalFormInput = z.input<typeof goalFormSchema>;

export function goalProgress(goal: Goal, currentMonthlyKg: number): number | null {
  const baseline = goal.baseline_co2e_monthly;
  if (baseline === null || !Number.isFinite(baseline) || baseline <= 0 || !Number.isFinite(currentMonthlyKg)) {
    return null;
  }
  const target = baseline * (1 - goal.target_co2e_reduction_pct / 100);
  if (baseline <= target) return null;
  return Math.max(0, Math.min(100, ((baseline - currentMonthlyKg) / (baseline - target)) * 100));
}
