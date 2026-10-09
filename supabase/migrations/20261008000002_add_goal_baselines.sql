-- Store the user's monthly footprint when setting a goal so progress is measured
-- against an explicit baseline rather than a fabricated estimate.
ALTER TABLE public.goals
    ADD COLUMN IF NOT EXISTS baseline_co2e_monthly NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS baseline_month_start DATE;

ALTER TABLE public.goals
    ADD CONSTRAINT goals_baseline_co2e_monthly_nonnegative
    CHECK (baseline_co2e_monthly IS NULL OR baseline_co2e_monthly >= 0);
