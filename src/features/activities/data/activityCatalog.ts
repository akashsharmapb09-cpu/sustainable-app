import type { ActivityCategory } from '../../../shared/types/database';
import { z } from 'zod';

export interface CatalogActivity {
  id: string;
  category: ActivityCategory;
  name: string;
  unit: string;
  co2e_per_unit: number;
  default_quantity: number;
  default_frequency_per_week: number;
}

export const ACTIVITY_CATALOG: CatalogActivity[] = [
  {
    id: 'act-petrol-commute',
    category: 'transport',
    name: 'Petrol car commute',
    unit: 'km',
    co2e_per_unit: 0.1705,
    default_quantity: 15,
    default_frequency_per_week: 10,
  },
  {
    id: 'act-2w-commute',
    category: 'transport',
    name: 'Petrol two-wheeler',
    unit: 'km',
    co2e_per_unit: 0.113,
    default_quantity: 12,
    default_frequency_per_week: 10,
  },
  {
    id: 'act-flight-domestic',
    category: 'travel',
    name: 'Domestic short-haul flight',
    unit: 'passenger-km',
    co2e_per_unit: 0.246,
    default_quantity: 800,
    default_frequency_per_week: 0.25,
  },
  {
    id: 'act-ac-cooling',
    category: 'energy',
    name: 'Grid electricity (cooling / home)',
    unit: 'kWh',
    co2e_per_unit: 0.716,
    default_quantity: 180,
    default_frequency_per_week: 1,
  },
  {
    id: 'act-lpg-cooking',
    category: 'energy',
    name: 'LPG cooking',
    unit: 'kg',
    co2e_per_unit: 2.983,
    default_quantity: 4,
    default_frequency_per_week: 1,
  },
  {
    id: 'act-water-heater-elec',
    category: 'energy',
    name: 'Electric water heater',
    unit: 'kWh',
    co2e_per_unit: 0.716,
    default_quantity: 45,
    default_frequency_per_week: 1,
  },
  {
    id: 'act-meat-diet',
    category: 'food',
    name: 'Ruminant / poultry meals',
    unit: 'kg',
    co2e_per_unit: 12.5,
    default_quantity: 1.2,
    default_frequency_per_week: 4,
  },
  {
    id: 'act-rice-heavy',
    category: 'food',
    name: 'Polished rice meals',
    unit: 'kg',
    co2e_per_unit: 2.7,
    default_quantity: 0.4,
    default_frequency_per_week: 7,
  },
  {
    id: 'act-wet-waste-landfill',
    category: 'waste',
    name: 'Wet waste to landfill',
    unit: 'kg',
    co2e_per_unit: 0.58,
    default_quantity: 4,
    default_frequency_per_week: 7,
  },
  {
    id: 'act-packaged-water',
    category: 'waste',
    name: 'Packaged PET water',
    unit: 'bottles',
    co2e_per_unit: 0.082,
    default_quantity: 6,
    default_frequency_per_week: 5,
  },
  {
    id: 'act-fast-fashion',
    category: 'shopping',
    name: 'New apparel purchases',
    unit: 'garments',
    co2e_per_unit: 22,
    default_quantity: 1,
    default_frequency_per_week: 0.5,
  },
  {
    id: 'act-new-electronics',
    category: 'shopping',
    name: 'New electronics (amortized)',
    unit: 'devices',
    co2e_per_unit: 55,
    default_quantity: 1,
    default_frequency_per_week: 0.08,
  },
];

const catalogActivitySchema = z.string().transform((id) => ACTIVITY_CATALOG.find((activity) => activity.id === id))
  .refine((activity): activity is CatalogActivity => activity !== undefined, {
    message: 'Select a listed activity.',
  });

export const activityLogFormSchema = z.object({
  activity_id: catalogActivitySchema,
  quantity: z.number()
    .finite('Enter a valid quantity.')
    .positive('Quantity must be greater than zero.')
    .max(99_999_999.99, 'Quantity is too large.'),
  frequency_per_week: z.number()
    .finite('Enter a valid frequency.')
    .positive('Frequency must be greater than zero.')
    .max(28, 'Frequency cannot exceed 28 times per week.'),
  notes: z.string().trim().max(500, 'Notes must be 500 characters or fewer.'),
  logged_at: z.string().datetime().optional(),
}).superRefine((input, context) => {
  if (!input.activity_id || typeof input.activity_id !== 'object') return;
  const monthlyEstimate = monthlyCo2e(input.quantity, input.frequency_per_week, input.activity_id.co2e_per_unit);
  if (monthlyEstimate > 99_999_999.99) {
    context.addIssue({
      code: 'custom',
      path: ['quantity'],
      message: 'The calculated monthly estimate is too large to save.',
    });
  }
}).transform(({ activity_id, quantity, frequency_per_week, notes, logged_at }) => ({
  activity_id: activity_id.id,
  activity: activity_id,
  quantity,
  frequency_per_week,
  notes,
  logged_at,
  calculated_co2e_monthly: monthlyCo2e(quantity, frequency_per_week, activity_id.co2e_per_unit),
}));
export type ActivityLogFormInput = z.input<typeof activityLogFormSchema>;

export function monthlyCo2e(quantity: number, frequencyPerWeek: number, factor: number) {
  return Number((quantity * frequencyPerWeek * 4.33 * factor).toFixed(2));
}

export function validateActivityLogForm(input: unknown) {
  return activityLogFormSchema.safeParse(input);
}
