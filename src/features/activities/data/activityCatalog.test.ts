import { describe, expect, it } from 'vitest';
import { ACTIVITY_CATALOG, monthlyCo2e, validateActivityLogForm } from './activityCatalog';

describe('activity log catalog', () => {
  it('calculates monthly emissions using 4.33 weeks', () => {
    expect(monthlyCo2e(10, 2, 0.5)).toBe(43.3);
  });

  it('derives activity details and emissions from the selected catalog entry', () => {
    const activity = ACTIVITY_CATALOG[0];
    const result = validateActivityLogForm({
      activity_id: activity.id,
      quantity: 10,
      frequency_per_week: 2,
      notes: '',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.activity).toEqual(activity);
      expect(result.data.calculated_co2e_monthly).toBe(monthlyCo2e(10, 2, activity.co2e_per_unit));
    }
  });

  it.each([
    { activity_id: 'unknown', quantity: 1, frequency_per_week: 1, notes: '' },
    { activity_id: ACTIVITY_CATALOG[0].id, quantity: 0, frequency_per_week: 1, notes: '' },
    { activity_id: ACTIVITY_CATALOG[0].id, quantity: Number.NaN, frequency_per_week: 1, notes: '' },
    { activity_id: ACTIVITY_CATALOG[0].id, quantity: 1, frequency_per_week: 29, notes: '' },
    { activity_id: ACTIVITY_CATALOG[0].id, quantity: 1, frequency_per_week: 1, notes: 'x'.repeat(501) },
  ])('rejects invalid form input %#', (input) => {
    expect(validateActivityLogForm(input).success).toBe(false);
  });

  it('rejects monthly estimates that exceed the database numeric column limit', () => {
    expect(validateActivityLogForm({
      activity_id: 'act-new-electronics',
      quantity: 99_999_999,
      frequency_per_week: 28,
      notes: '',
    }).success).toBe(false);
  });

  it('accepts a monthly frequency below one per week', () => {
    const flight = ACTIVITY_CATALOG.find((activity) => activity.id === 'act-flight-domestic');
    expect(flight).toBeDefined();
    expect(validateActivityLogForm({
      activity_id: flight!.id,
      quantity: 800,
      frequency_per_week: 0.25,
      notes: '',
    }).success).toBe(true);
  });
});
