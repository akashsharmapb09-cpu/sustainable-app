-- GreenSwap Supabase setup script
-- Paste this file into the Supabase SQL Editor and run once.
-- Forward migrations are in filename order; teardown scripts under rollback/ are excluded.

-- ============================================================================
-- Source: 20260101000000_initial_schema.sql
-- ============================================================================
-- =============================================================================
-- Migration: 20260101000000_initial_schema.sql
-- Description: Core schema, types, tables, constraints, indexes and triggers
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    region TEXT NOT NULL DEFAULT 'IN',
    household_size INT NOT NULL DEFAULT 1 CHECK (household_size >= 1 AND household_size <= 20),
    diet TEXT NOT NULL DEFAULT 'omnivore' CHECK (diet IN ('vegan', 'vegetarian', 'pescatarian', 'flexitarian', 'omnivore')),
    commute_mode TEXT NOT NULL DEFAULT 'car_petrol' CHECK (commute_mode IN ('walk_cycle', 'public_transit', 'two_wheeler', 'car_ev', 'car_petrol', 'car_diesel', 'carpool')),
    budget_sensitivity TEXT NOT NULL DEFAULT 'medium' CHECK (budget_sensitivity IN ('low', 'medium', 'high')),
    effort_level TEXT NOT NULL DEFAULT 'moderate' CHECK (effort_level IN ('easy', 'moderate', 'committed')),
    interests TEXT[] NOT NULL DEFAULT '{}',
    preferred_currency TEXT NOT NULL DEFAULT 'INR' CHECK (preferred_currency IN ('INR', 'USD', 'EUR')),
    preferred_units TEXT NOT NULL DEFAULT 'metric' CHECK (preferred_units IN ('metric', 'imperial')),
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    notifications_email BOOLEAN NOT NULL DEFAULT true,
    notifications_weekly_digest BOOLEAN NOT NULL DEFAULT true,
    share_anonymous_stats BOOLEAN NOT NULL DEFAULT false,
    dark_mode BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. USER ROLES (Protected Role-Based Access Control)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 4. EMISSION FACTORS TABLE (Versioned and public-source referenced)
CREATE TABLE IF NOT EXISTS public.emission_factors (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('transport', 'food', 'energy', 'shopping', 'waste', 'travel')),
    name TEXT NOT NULL,
    co2e_per_unit NUMERIC(10, 4) NOT NULL CHECK (co2e_per_unit >= 0),
    unit TEXT NOT NULL,
    region TEXT NOT NULL DEFAULT 'GLOBAL',
    year INT NOT NULL,
    source TEXT NOT NULL,
    source_url TEXT NOT NULL,
    confidence_interval NUMERIC(4, 2) NOT NULL DEFAULT 0.10 CHECK (confidence_interval >= 0 AND confidence_interval <= 0.50),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. BASELINE ACTIVITIES CATALOG
CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('transport', 'food', 'energy', 'shopping', 'waste', 'travel')),
    name TEXT NOT NULL,
    description TEXT,
    default_unit TEXT NOT NULL,
    emission_factor_id TEXT NOT NULL REFERENCES public.emission_factors(id),
    default_frequency_per_week INT NOT NULL DEFAULT 5,
    default_quantity NUMERIC(10, 2) NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ACTIVITY LOGS TABLE (User-logged activity entries)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_id TEXT REFERENCES public.activities(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('transport', 'food', 'energy', 'shopping', 'waste', 'travel')),
    activity_name TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL,
    frequency_per_week NUMERIC(4, 1) NOT NULL DEFAULT 1 CHECK (frequency_per_week > 0 AND frequency_per_week <= 28),
    calculated_co2e_monthly NUMERIC(10, 2) NOT NULL CHECK (calculated_co2e_monthly >= 0),
    notes TEXT,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ALTERNATIVES TABLE (Eco-friendly options with cost, difficulty, citations)
CREATE TABLE IF NOT EXISTS public.alternatives (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('transport', 'food', 'energy', 'shopping', 'waste', 'travel')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    why_better TEXT NOT NULL,
    baseline_activity_id TEXT REFERENCES public.activities(id) ON DELETE SET NULL,
    co2e_saved_ratio NUMERIC(5, 4) NOT NULL CHECK (co2e_saved_ratio >= 0 AND co2e_saved_ratio <= 1.0),
    cost_delta_monthly_inr NUMERIC(10, 2) NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'moderate', 'committed')),
    feasibility_score NUMERIC(3, 2) NOT NULL DEFAULT 0.8 CHECK (feasibility_score >= 0 AND feasibility_score <= 1.0),
    prerequisites TEXT[] DEFAULT '{}',
    caveats TEXT,
    region_availability TEXT[] NOT NULL DEFAULT '{"GLOBAL"}',
    tags TEXT[] DEFAULT '{}',
    source_citation TEXT NOT NULL,
    source_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. RECOMMENDATIONS TABLE (Generated ranked suggestions per logged activity)
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_log_id UUID REFERENCES public.activity_logs(id) ON DELETE CASCADE,
    alternative_id TEXT NOT NULL REFERENCES public.alternatives(id) ON DELETE CASCADE,
    score NUMERIC(5, 4) NOT NULL,
    rank INT NOT NULL CHECK (rank >= 1 AND rank <= 10),
    co2e_saved_monthly_low NUMERIC(10, 2) NOT NULL,
    co2e_saved_monthly_expected NUMERIC(10, 2) NOT NULL,
    co2e_saved_monthly_high NUMERIC(10, 2) NOT NULL,
    cost_delta_monthly_low NUMERIC(10, 2) NOT NULL,
    cost_delta_monthly_expected NUMERIC(10, 2) NOT NULL,
    cost_delta_monthly_high NUMERIC(10, 2) NOT NULL,
    confidence TEXT NOT NULL CHECK (confidence IN ('high', 'medium', 'moderate')),
    explanation_factors JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. USER ACTIONS TABLE (Adopted / Maybe Later / Not For Me)
CREATE TABLE IF NOT EXISTS public.user_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    alternative_id TEXT NOT NULL REFERENCES public.alternatives(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('adopted', 'maybe_later', 'not_for_me')),
    adopted_at TIMESTAMPTZ,
    feedback_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, alternative_id)
);

-- 10. GOALS TABLE
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('transport', 'food', 'energy', 'shopping', 'waste', 'travel', 'all')),
    target_co2e_reduction_pct NUMERIC(5, 2) NOT NULL CHECK (target_co2e_reduction_pct > 0 AND target_co2e_reduction_pct <= 100),
    target_date DATE NOT NULL,
    baseline_co2e_monthly NUMERIC(10, 2) CHECK (baseline_co2e_monthly IS NULL OR baseline_co2e_monthly >= 0),
    baseline_month_start DATE,
    achieved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. CHALLENGES & USER CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS public.challenges (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('transport', 'food', 'energy', 'shopping', 'waste', 'travel', 'general')),
    duration_days INT NOT NULL DEFAULT 7,
    co2e_impact_potential_kg NUMERIC(8, 2) NOT NULL DEFAULT 5.0,
    badge_key TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, challenge_id)
);

-- 12. BADGES & USER BADGES
CREATE TABLE IF NOT EXISTS public.badges (
    key TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    requirement_description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_key TEXT NOT NULL REFERENCES public.badges(key) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, badge_key)
);

-- 13. AUDIT LOG (Security and compliance events)
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    feedback_type TEXT NOT NULL CHECK (feedback_type IN ('suggestion', 'alternative_request', 'bug', 'methodology')),
    message TEXT NOT NULL,
    email TEXT,
    resolved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. DATA EXPORT REQUESTS (GDPR / DPDP Compliance)
CREATE TABLE IF NOT EXISTS public.data_export_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'expired')),
    export_format TEXT NOT NULL DEFAULT 'json' CHECK (export_format IN ('json', 'csv')),
    download_url TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- PERFORMANCE INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_category ON public.activity_logs(category);
CREATE INDEX IF NOT EXISTS idx_activity_logs_logged_at ON public.activity_logs(logged_at DESC);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON public.recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_activity_log ON public.recommendations(activity_log_id);

CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON public.user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_status ON public.user_actions(status);

CREATE INDEX IF NOT EXISTS idx_alternatives_category ON public.alternatives(category);
CREATE INDEX IF NOT EXISTS idx_alternatives_active ON public.alternatives(is_active);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);

-- =============================================================================
-- AUTOMATED USER CREATION TRIGGER
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;

    INSERT INTO public.audit_log (user_id, action, metadata)
    VALUES (
        NEW.id,
        'auth.signup',
        jsonb_build_object('email', NEW.email, 'timestamp', NOW())
    );

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Source: 20260101000001_row_level_security.sql
-- ============================================================================
-- =============================================================================
-- Migration: 20260101000001_row_level_security.sql
-- Description: Production Row Level Security (RLS) - Default Deny Tenant Isolation
-- =============================================================================

-- Helper Function: Check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$;

-- -----------------------------------------------------------------------------
-- 1. PROFILES (Tenant Isolation)
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_insert_own"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
    ON public.profiles FOR DELETE
    USING (auth.uid() = id OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 2. USER PREFERENCES
-- -----------------------------------------------------------------------------
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_preferences_select_own"
    ON public.user_preferences FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_preferences_insert_own"
    ON public.user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_preferences_update_own"
    ON public.user_preferences FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_preferences_delete_own"
    ON public.user_preferences FOR DELETE
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 3. USER ROLES (Protected Table)
-- -----------------------------------------------------------------------------
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_roles_select_own"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_roles_admin_manage"
    ON public.user_roles FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 4. EMISSION FACTORS (Public Read, Admin Write)
-- -----------------------------------------------------------------------------
ALTER TABLE public.emission_factors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "emission_factors_read_public"
    ON public.emission_factors FOR SELECT
    USING (true);

CREATE POLICY "emission_factors_admin_write"
    ON public.emission_factors FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. ACTIVITIES CATALOG (Public Read, Admin Write)
-- -----------------------------------------------------------------------------
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activities_read_public"
    ON public.activities FOR SELECT
    USING (true);

CREATE POLICY "activities_admin_write"
    ON public.activities FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. ACTIVITY LOGS (Tenant Isolation)
-- -----------------------------------------------------------------------------
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity_logs_select_own"
    ON public.activity_logs FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "activity_logs_insert_own"
    ON public.activity_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "activity_logs_update_own"
    ON public.activity_logs FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "activity_logs_delete_own"
    ON public.activity_logs FOR DELETE
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 7. ALTERNATIVES CATALOG (Public Read, Admin Write)
-- -----------------------------------------------------------------------------
ALTER TABLE public.alternatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "alternatives_read_public"
    ON public.alternatives FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "alternatives_admin_write"
    ON public.alternatives FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 8. RECOMMENDATIONS (Tenant Isolation)
-- -----------------------------------------------------------------------------
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recommendations_select_own"
    ON public.recommendations FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "recommendations_insert_own"
    ON public.recommendations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "recommendations_delete_own"
    ON public.recommendations FOR DELETE
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 9. USER ACTIONS (Tenant Isolation)
-- -----------------------------------------------------------------------------
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_actions_select_own"
    ON public.user_actions FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_actions_insert_own"
    ON public.user_actions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_actions_update_own"
    ON public.user_actions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_actions_delete_own"
    ON public.user_actions FOR DELETE
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 10. GOALS (Tenant Isolation)
-- -----------------------------------------------------------------------------
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "goals_select_own"
    ON public.goals FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "goals_insert_own"
    ON public.goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "goals_update_own"
    ON public.goals FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "goals_delete_own"
    ON public.goals FOR DELETE
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 11. CHALLENGES & USER CHALLENGES
-- -----------------------------------------------------------------------------
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "challenges_read_public"
    ON public.challenges FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "challenges_admin_write"
    ON public.challenges FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_challenges_select_own"
    ON public.user_challenges FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_challenges_insert_own"
    ON public.user_challenges FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_challenges_update_own"
    ON public.user_challenges FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 12. BADGES & USER BADGES
-- -----------------------------------------------------------------------------
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges_read_public"
    ON public.badges FOR SELECT
    USING (true);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_badges_select_own"
    ON public.user_badges FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_badges_insert_own"
    ON public.user_badges FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 13. AUDIT LOG (Immutable: append-only, user can see own, admin can see all)
-- -----------------------------------------------------------------------------
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_select_own"
    ON public.audit_log FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "audit_log_insert_authenticated"
    ON public.audit_log FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Notice: NO UPDATE OR DELETE POLICIES EXIST ON AUDIT_LOG (Enforces strict immutability)

-- -----------------------------------------------------------------------------
-- 14. FEEDBACK & EXPORT REQUESTS
-- -----------------------------------------------------------------------------
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feedback_insert_any"
    ON public.feedback FOR INSERT
    WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "feedback_select_own"
    ON public.feedback FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

ALTER TABLE public.data_export_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "data_export_select_own"
    ON public.data_export_requests FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "data_export_insert_own"
    ON public.data_export_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- Source: 20260101000002_seed_emission_factors.sql
-- ============================================================================
-- =============================================================================
-- Migration: 20260101000002_seed_emission_factors.sql
-- Description: Verifiable emission factors from DEFRA 2024, CEA India 2023, US EPA, IPCC AR6
-- =============================================================================

INSERT INTO public.emission_factors 
(id, category, name, co2e_per_unit, unit, region, year, source, source_url, confidence_interval, notes)
VALUES
-- Transport Factors
('trns-car-petrol-in', 'transport', 'Passenger Car (Petrol, Average Engine)', 0.1705, 'km', 'IN', 2024, 'DEFRA 2024 / ARAI India', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.10, 'Average passenger vehicle, petrol powertrain'),
('trns-car-diesel-in', 'transport', 'Passenger Car (Diesel, Medium)', 0.1710, 'km', 'IN', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.10, 'Diesel passenger vehicle'),
('trns-car-ev-in', 'transport', 'Electric Car (Grid Charged, India CEA)', 0.0930, 'km', 'IN', 2023, 'CEA India CO2 Baseline Database v19', 'https://cea.nic.in/cdm-co2-baseline-database', 0.12, 'Calculated at 130 Wh/km on average Indian national grid emission factor (0.716 kg CO2/kWh)'),
('trns-2w-petrol-in', 'transport', 'Two-Wheeler Motorcycle / Scooter (Petrol 100-150cc)', 0.0435, 'km', 'IN', 2024, 'India GHG Platform / DEFRA 2024', 'https://www.indiaghgplatform.org/', 0.08, 'Standard Indian commuter motorbike or scooter'),
('trns-2w-ev-in', 'transport', 'Electric Scooter (Grid Charged, India CEA)', 0.0180, 'km', 'IN', 2023, 'CEA India / BEE 2023', 'https://cea.nic.in/cdm-co2-baseline-database', 0.10, 'Estimated at 25 Wh/km on Indian grid factor'),
('trns-auto-cng-in', 'transport', 'Auto-Rickshaw (CNG / Shared Passenger)', 0.0380, 'passenger_km', 'IN', 2023, 'TERI India / CSTEP', 'https://www.teriin.org/', 0.15, 'Average occupancy of 2.2 passengers'),
('trns-metro-in', 'transport', 'Metro Rail / Rapid Urban Transit', 0.0150, 'passenger_km', 'IN', 2023, 'DMRC Annual Sustainability Report / DEFRA 2024', 'https://www.delhimetrorail.com/', 0.10, 'Regenerative braking mass transit'),
('trns-bus-diesel-in', 'transport', 'City Transit Bus (Diesel)', 0.0890, 'passenger_km', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.12, 'Average municipal bus load factor'),
('trns-bus-electric-in', 'transport', 'City Transit Bus (Electric)', 0.0320, 'passenger_km', 'IN', 2023, 'CEA India / CESL e-Bus Benchmark', 'https://cea.nic.in/', 0.12, 'Electric city bus passenger-km'),
('trns-train-electric-in', 'transport', 'Intercity Train (Indian Railways Electric)', 0.0210, 'passenger_km', 'IN', 2023, 'Indian Railways Sustainability Disclosure', 'https://indianrailways.gov.in/', 0.15, 'Broad gauge electrified route average'),
('trns-flight-domestic', 'transport', 'Domestic Flight (<1000 km, with Radiative Forcing)', 0.2450, 'passenger_km', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.15, 'Includes IPCC radiative forcing multiplier 1.9x'),
('trns-flight-longhaul', 'transport', 'Long-Haul Flight (>3700 km, with Radiative Forcing)', 0.1930, 'passenger_km', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.15, 'Economy seating class with high altitude contrail factor'),
('trns-walk-cycle', 'transport', 'Walking & Active Bicycle Commute', 0.0000, 'km', 'GLOBAL', 2024, 'IPCC AR6 WGIII', 'https://www.ipcc.ch/report/ar6/wg3/', 0.00, 'Direct zero operational tailpipe emissions'),

-- Energy Factors
('nrg-grid-elec-in', 'energy', 'Grid Electricity (India National Weighted Average)', 0.7160, 'kWh', 'IN', 2023, 'CEA India CO2 Baseline Database v19', 'https://cea.nic.in/cdm-co2-baseline-database', 0.05, 'Combined margin grid intensity across all regional grids'),
('nrg-grid-elec-us', 'energy', 'Grid Electricity (US eGRID National Average)', 0.3860, 'kWh', 'US', 2024, 'US EPA eGRID 2024', 'https://www.epa.gov/egrid', 0.05, 'US annual non-baseload and baseload generation average'),
('nrg-grid-elec-eu', 'energy', 'Grid Electricity (EU-27 Average)', 0.2300, 'kWh', 'EU', 2023, 'European Environment Agency (EEA)', 'https://www.eea.europa.eu/', 0.05, 'EU electricity production greenhouse gas intensity'),
('nrg-lpg-cooking-in', 'energy', 'LPG Liquefied Petroleum Gas Cylinder', 2.9830, 'kg', 'GLOBAL', 2024, 'DEFRA 2024 / IPCC AR6', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.05, '14.2 kg domestic cooking gas cylinder benchmark'),
('nrg-png-naturalgas', 'energy', 'Piped Natural Gas (PNG)', 2.0200, 'm3', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.05, 'City gas distribution network'),
('nrg-solar-rooftop', 'energy', 'Rooftop Solar PV (Life-cycle Embodied)', 0.0410, 'kWh', 'GLOBAL', 2023, 'NREL / IPCC Life Cycle Assessment', 'https://www.nrel.gov/analysis/life-cycle-assessment.html', 0.15, 'Full life-cycle manufacturing and end-of-life amortization'),

-- Food Factors
('food-beef-ruminant', 'food', 'Beef / Ruminant Meat', 27.0000, 'kg', 'GLOBAL', 2018, 'Poore & Nemecek (Science 2018) / IPCC AR6', 'https://science.sciencemag.org/content/360/6392/987', 0.15, 'High enteric fermentation and feed conversion'),
('food-mutton-goat', 'food', 'Mutton / Goat Meat', 24.5000, 'kg', 'GLOBAL', 2024, 'DEFRA 2024 / Poore & Nemecek', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.15, 'Small ruminant pastoral and intensive systems'),
('food-poultry-chicken', 'food', 'Poultry / Chicken Meat', 6.1000, 'kg', 'GLOBAL', 2024, 'DEFRA 2024 / FAO', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.10, 'Standard broiler production system'),
('food-dairy-milk', 'food', 'Cow Dairy Milk', 1.3900, 'liter', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.10, 'Whole pasteurized cow milk'),
('food-plant-milk', 'food', 'Plant Milk (Soy / Oat / Almond)', 0.3800, 'liter', 'GLOBAL', 2023, 'Poore & Nemecek 2018', 'https://science.sciencemag.org/content/360/6392/987', 0.12, 'Commercial non-dairy milk alternative'),
('food-eggs', 'food', 'Chicken Eggs', 4.6700, 'kg', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.10, 'Shell eggs (approx 16 eggs per kg)'),
('food-rice-paddy', 'food', 'Rice (Methane Intensive Cultivation)', 2.7000, 'kg', 'GLOBAL', 2021, 'IPCC AR6 / IRRI', 'https://www.ipcc.ch/', 0.12, 'Continuously flooded paddy fields producing CH4'),
('food-millets-pulses', 'food', 'Lentils / Dal / Millets (Ragi, Jowar)', 0.8500, 'kg', 'IN', 2023, 'ICRISAT / Poore & Nemecek', 'https://www.icrisat.org/', 0.10, 'Drought-tolerant leguminous and coarse grains'),
('food-vegetables-seasonal', 'food', 'Local Seasonal Field Vegetables', 0.4000, 'kg', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.15, 'Unheated local open field seasonal crops'),

-- Shopping Factors
('shop-apparel-virgin', 'shopping', 'Fast Fashion Cotton / Synthetic Garment (Virgin)', 12.5000, 'item', 'GLOBAL', 2023, 'WRAP UK / Ellen MacArthur Foundation', 'https://wrap.org.uk/', 0.20, 'Cradle-to-consumer virgin textile supply chain'),
('shop-apparel-thrift', 'shopping', 'Second-hand / Pre-loved Garment', 1.2000, 'item', 'GLOBAL', 2023, 'WRAP UK', 'https://wrap.org.uk/', 0.15, 'Laundering and transport logistics only (90% savings)'),
('shop-phone-new', 'shopping', 'New Smartphone (Cradle-to-Gate Manufacturing)', 70.0000, 'device', 'GLOBAL', 2023, 'Apple / Fairphone Environmental LCA', 'https://www.apple.com/environment/', 0.10, 'Embodied emissions in silicon fabrication and casing'),
('shop-phone-refurb', 'shopping', 'Refurbished Smartphone', 14.0000, 'device', 'GLOBAL', 2022, 'ADEME France', 'https://presse.ademe.fr/', 0.12, 'Refurbishment and distribution amortization'),

-- Waste Factors
('wst-landfill-general', 'waste', 'Landfilled Mixed Solid Waste', 0.5800, 'kg', 'GLOBAL', 2024, 'US EPA WARM 2024 / IPCC AR6', 'https://www.epa.gov/warm', 0.15, 'Anaerobic decomposition generating methane gas'),
('wst-composting-organic', 'waste', 'Aerobic Compost (Home / Community)', 0.0800, 'kg', 'GLOBAL', 2024, 'US EPA WARM 2024', 'https://www.epa.gov/warm', 0.15, 'Controlled aerobic organic degradation'),
('wst-plastic-bottle-pet', 'waste', 'Single-Use 1L PET Bottle', 0.0828, 'item', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.10, 'Virgin polymer production, blow molding and disposal')
ON CONFLICT (id) DO UPDATE SET
    co2e_per_unit = EXCLUDED.co2e_per_unit,
    source = EXCLUDED.source,
    source_url = EXCLUDED.source_url,
    confidence_interval = EXCLUDED.confidence_interval,
    notes = EXCLUDED.notes;

-- -----------------------------------------------------------------------------
-- BASELINE ACTIVITIES SEEDING
-- -----------------------------------------------------------------------------
INSERT INTO public.activities
(id, category, name, description, default_unit, emission_factor_id, default_frequency_per_week, default_quantity)
VALUES
('act-petrol-commute', 'transport', 'Solo Petrol Car Commute', 'Driving a petrol vehicle to work or college', 'km', 'trns-car-petrol-in', 5, 15.0),
('act-diesel-commute', 'transport', 'Solo Diesel Car Commute', 'Driving a diesel car for daily commute', 'km', 'trns-car-diesel-in', 5, 20.0),
('act-2w-commute', 'transport', 'Petrol Two-Wheeler Commute', 'Riding a 110-150cc scooter/motorcycle', 'km', 'trns-2w-petrol-in', 6, 12.0),
('act-flight-domestic', 'transport', 'Domestic Flights (Short-Haul)', 'Flights between major cities', 'passenger_km', 'trns-flight-domestic', 1, 500.0),
('act-ac-cooling', 'energy', 'Air Conditioning (Standard 3-Star Split AC)', 'Cooling bedroom/office during hot months', 'kWh', 'nrg-grid-elec-in', 7, 6.0),
('act-water-heater-elec', 'energy', 'Electric Storage Geyser', 'Heating bath water using immersion/geyser', 'kWh', 'nrg-grid-elec-in', 7, 3.0),
('act-lpg-cooking', 'energy', 'Cooking with LPG Cylinders', 'Stove gas consumption for family meals', 'kg', 'nrg-lpg-cooking-in', 7, 0.45),
('act-meat-diet', 'food', 'Non-Vegetarian Meals (Chicken / Mutton)', 'Eating meat courses several times a week', 'kg', 'food-poultry-chicken', 4, 0.25),
('act-dairy-heavy', 'food', 'Daily Dairy Consumption', 'Milk, paneer, and curd consumption', 'liter', 'food-dairy-milk', 7, 1.0),
('act-rice-heavy', 'food', 'Polished White Rice Staple', 'Daily white rice portions', 'kg', 'food-rice-paddy', 7, 0.35),
('act-fast-fashion', 'shopping', 'Fast Fashion & Online Clothing Purchases', 'Buying brand new apparel monthly', 'item', 'shop-apparel-virgin', 1, 3.0),
('act-new-electronics', 'shopping', 'Smartphone & Gadget Replacement', 'Upgrading tech devices yearly', 'device', 'shop-phone-new', 1, 1.0),
('act-wet-waste-landfill', 'waste', 'Unsegregated Organic Food Waste', 'Throwing kitchen scraps directly into municipal trash', 'kg', 'wst-landfill-general', 7, 0.8),
('act-packaged-water', 'waste', 'Single-Use Packaged Mineral Water', 'Buying bottled water while on the go', 'item', 'wst-plastic-bottle-pet', 5, 2.0)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    emission_factor_id = EXCLUDED.emission_factor_id,
    default_frequency_per_week = EXCLUDED.default_frequency_per_week,
    default_quantity = EXCLUDED.default_quantity;

-- ============================================================================
-- Source: 20260101000003_seed_alternatives_and_badges.sql
-- ============================================================================
-- =============================================================================
-- Migration: 20260101000003_seed_alternatives_and_badges.sql
-- Description: 60+ Realistic Alternatives with Honest Caveats, Badges & Challenges
-- =============================================================================

INSERT INTO public.alternatives
(id, category, title, description, why_better, baseline_activity_id, co2e_saved_ratio, cost_delta_monthly_inr, difficulty, feasibility_score, prerequisites, caveats, region_availability, tags, source_citation)
VALUES
-- =============================================================================
-- 1. TRANSPORT ALTERNATIVES (12 Entries)
-- =============================================================================
('alt-metro-commute', 'transport', 'Switch Commute to Metro Transit', 
 'Replace solo car or taxi drives with rapid urban rail (Delhi Metro, Namma Metro, Mumbai Metro, etc.).', 
 'Mass transit moves hundreds per train with regenerative braking, slashing per-capita emissions by ~91% vs a petrol car.',
 'act-petrol-commute', 0.9120, -3200.00, 'moderate', 0.85, 
 '{"Transit line within 1.5 km", "Smart transit card"}',
 'Savings apply if first/last mile is walked, cycled, or taken via shared e-rickshaw rather than solo cab.',
 '{"IN", "GLOBAL"}', '{"transit", "commute", "urban", "high-impact"}', 'DMRC Sustainability Report 2023 / DEFRA 2024'),

('alt-electric-2w', 'transport', 'Adopt an Electric Two-Wheeler (EV Scooter)', 
 'Upgrade your daily petrol scooter or motorbike to an electric two-wheeler.', 
 'Electric motors are ~80% efficient compared to ~25% for internal combustion, cutting operational emissions by ~58% even on the coal-heavy Indian grid.',
 'act-2w-commute', 0.5862, -1450.00, 'moderate', 0.90, 
 '{"Dedicated 5A/15A charging socket at parking", "Upfront capital/EMI"}',
 'Full life-cycle battery manufacturing emissions break even after approx. 8,000 km of urban riding.',
 '{"IN"}', '{"ev", "scooter", "commute", "fuel-savings"}', 'BEE India EV Guidelines / CEA Baseline 2023'),

('alt-shared-e-rickshaw', 'transport', 'Shared E-Rickshaw for Last-Mile Transit', 
 'Choose battery-operated e-rickshaws for station and market feeder connections instead of petrol autos.', 
 'Shared electric micro-transit operates at high passenger density, emitting up to 60% less per passenger-km.',
 'act-petrol-commute', 0.6000, -800.00, 'easy', 0.95, 
 '{}',
 'Check that drivers use formal charging points rather than unregulated unmetered taps.',
 '{"IN"}', '{"micro-mobility", "electric", "affordable"}', 'TERI Micro-Mobility Study 2023'),

('alt-carpool-work', 'transport', 'Ride-Share / Two-Person Carpool', 
 'Share your vehicle with a colleague or neighbor traveling on the same corridor 3 days a week.', 
 'Halves the fuel burnt and tailpipe emissions per passenger without requiring new vehicle investment.',
 'act-petrol-commute', 0.5000, -2200.00, 'easy', 0.80, 
 '{"Compatible schedule with colleague"}',
 'Detours longer than 20% of the total commute distance erode net emissions gains.',
 '{"IN", "GLOBAL"}', '{"carpool", "no-cost", "commute"}', 'IPCC AR6 Transport Chapter'),

('alt-bicycle-short-trips', 'transport', 'Bicycle Commute for Sub-4km Trips', 
 'Use an acoustic or geared bicycle for trips under 4 km (errands, gym, local market).', 
 'Zero operational emissions and zero combustion pollutants, while improving cardiovascular fitness.',
 'act-2w-commute', 1.0000, -650.00, 'moderate', 0.75, 
 '{"Road safety awareness", "Helmet", "Bicycle lane or secondary roads"}',
 'Ensure safe routes during peak rush hours or extreme summer heat.',
 '{"IN", "GLOBAL"}', '{"cycling", "active-mobility", "zero-carbon"}', 'European Cyclists Federation LCA / DEFRA 2024'),

('alt-train-intercity', 'transport', 'Intercity Vande Bharat / Express Train vs Flight', 
 'Book an electrified express train instead of domestic short flights for journeys under 550 km (e.g. Mumbai-Goa, Delhi-Jaipur).', 
 'High-speed electric rail produces 91% lower CO2e per passenger-km compared to domestic short-haul flights with radiative forcing.',
 'act-flight-domestic', 0.9142, -2800.00, 'moderate', 0.85, 
 '{"Advance booking via IRCTC"}',
 'Only viable where travel time remains under 6 to 7 hours.',
 '{"IN"}', '{"rail", "travel", "intercity", "high-impact"}', 'Indian Railways Sustainability 2023 / DEFRA 2024'),

('alt-eco-driving', 'transport', 'Eco-Driving Habit: Steady Throttle & 50-60 km/h', 
 'Maintain steady cruising speeds, shift gears early, keep correct tire pressure, and avoid sudden acceleration.', 
 'Improves fuel economy by 12% to 18% in existing petrol and diesel engines with zero financial expense.',
 'act-petrol-commute', 0.1500, -850.00, 'easy', 0.98, 
 '{}',
 'Traffic congestion limits ability to sustain steady momentum.',
 '{"IN", "GLOBAL"}', '{"habit", "free", "fuel-savings"}', 'US EPA Fuel Economy Guide 2024'),

('alt-wfh-hybrid', 'transport', 'Consolidate In-Office Days to 3x/Week', 
 'Negotiate a hybrid schedule eliminating 2 round-trip commutes each week.', 
 'Directly eliminates 40% of monthly commute distance, time, and fuel consumption.',
 'act-petrol-commute', 0.4000, -2100.00, 'moderate', 0.70, 
 '{"Employer remote work policy"}',
 'Home AC and power consumption increase slightly during work hours.',
 '{"IN", "GLOBAL"}', '{"remote-work", "commute", "lifestyle"}', 'IEA Working From Home Energy Analysis'),

('alt-electric-bus-pass', 'transport', 'Monthly Municipal Electric Bus Pass', 
 'Shift from solo ride-hailing to city electric bus fleets (e.g. DTC, BEST, BMTC EV fleets).', 
 'High-capacity electric buses produce less than 0.032 kg CO2e/passenger-km while costing a fraction of cab fares.',
 'act-petrol-commute', 0.8123, -3800.00, 'moderate', 0.80, 
 '{"Bus stop within 600m"}',
 'Timetable punctuality can vary during peak monsoon or traffic congestion.',
 '{"IN"}', '{"bus", "transit", "budget"}', 'CESL India e-Bus Performance Data 2023'),

('alt-tire-pressure-calibration', 'transport', 'Monthly Nitrogen/Air Tire Calibration', 
 'Inflate tires to OEM rated cold pressure every 3-4 weeks.', 
 'Under-inflated tires increase rolling resistance by 5-10%, burning unnecessary fuel.',
 'act-petrol-commute', 0.0400, -250.00, 'easy', 0.95, 
 '{}',
 'Check tires when cool (before driving long distances).',
 '{"IN", "GLOBAL"}', '{"maintenance", "quick-win"}', 'ARAI Automotive Research Association of India'),

('alt-shared-cab-pooling', 'transport', 'Use Cab Pooling Over Solo Ride-Hailing', 
 'Choose shared/pool rides on ride-hailing platforms when public transit is unavailable.', 
 'Distributes vehicle fuel consumption across multiple riders traveling along the same corridor.',
 'act-petrol-commute', 0.3500, -1200.00, 'easy', 0.85, 
 '{}',
 'May add 10-15 minutes of pickup detours.',
 '{"IN", "GLOBAL"}', '{"ride-sharing", "urban"}', 'International Transport Forum 2023'),

('alt-electric-car-transition', 'transport', 'Transition to Compact Electric Car (EV)', 
 'Replace primary household petrol hatchback with a compact BEV charged via home smart charger.', 
 'Reduces tailpipe greenhouse emissions to zero and cuts operational emissions by ~45% on the Indian grid.',
 'act-petrol-commute', 0.4545, -4500.00, 'committed', 0.65, 
 '{"Designated residential parking bay with power meter", "Capital investment"}',
 'Best paired with rooftop solar to maximize clean power generation.',
 '{"IN", "GLOBAL"}', '{"ev", "automotive", "long-term"}', 'CEA India 2023 / ARAI Benchmark'),

-- =============================================================================
-- 2. ENERGY & APPLIANCE ALTERNATIVES (12 Entries)
-- =============================================================================
('alt-bldc-ceiling-fans', 'energy', 'Switch to 5-Star BLDC Ceiling Fans', 
 'Replace legacy 75W induction ceiling fans with brushless DC (BLDC) motor 28W fans.', 
 'Consumes 62% less electricity per operating hour with no drop in airflow, saving ~47W per running fan continuously.',
 'act-ac-cooling', 0.6200, -320.00, 'easy', 0.95, 
 '{"Standard ceiling hook and wiring"}',
 'Upfront fan replacement cost typically amortizes within 10 to 14 months of daily use.',
 '{"IN"}', '{"energy-efficiency", "bldc", "electricity-bill"}', 'Bureau of Energy Efficiency (BEE) India 2023'),

('alt-ac-26-degrees', 'energy', 'Calibrate AC Thermostat to 24°C–26°C with Fan', 
 'Raise your room air conditioner setpoint from 18°-20°C to 24°-26°C while running a ceiling fan on low.', 
 'Every 1°C increase in AC setpoint reduces compressor energy consumption by 6%, delivering ~25% power savings.',
 'act-ac-cooling', 0.2500, -680.00, 'easy', 0.99, 
 '{}',
 'Clean AC dust filters every fortnight to sustain compressor heat exchange efficiency.',
 '{"IN", "GLOBAL"}', '{"ac", "zero-cost", "quick-win"}', 'BEE India Cooling Standard / ASHRAE 55'),

('alt-induction-cooktop', 'energy', 'Transition from LPG to Induction Cooktop', 
 'Cook primary boiled and simmering dishes using a 2000W magnetic induction cooktop rather than gas burners.', 
 'Induction transfers 84-90% of heat directly to cookware versus 40-50% for open gas flames, cutting kitchen heat and fuel cost.',
 'act-lpg-cooking', 0.3800, -220.00, 'moderate', 0.90, 
 '{"Ferromagnetic / induction-bottom cookware"}',
 'High-heat Indian open-flame cooking (e.g. phulka puffing) may require adaptation or wire mesh grates.',
 '{"IN", "GLOBAL"}', '{"cooking", "clean-energy", "kitchen"}', 'US Dept of Energy / TERI India Clean Cooking 2023'),

('alt-solar-water-heater', 'energy', 'Install Rooftop Solar Water Heater', 
 'Replace electric heating geysers with evacuated tube collector (ETC) rooftop solar thermal systems.', 
 'Heats domestic bath water using direct solar radiation with zero grid power draw for 300+ days a year.',
 'act-water-heater-elec', 0.8500, -750.00, 'committed', 0.70, 
 '{"Rooftop terrace access", "Plumbing riser pipe"}',
 'Requires electric backup element during heavy monsoon overcast weeks.',
 '{"IN"}', '{"solar-thermal", "water-heater", "high-savings"}', 'MNRE Ministry of New and Renewable Energy India'),

('alt-rooftop-solar-pv', 'energy', 'Grid-Tied Rooftop Solar PV System (3kW)', 
 'Install a net-metered rooftop solar photovoltaic array under national subsidy schemes (PM Surya Ghar).', 
 'Generates clean, renewable electricity on-site, cutting household grid reliance by 70% to 90%.',
 'act-ac-cooling', 0.8800, -2800.00, 'committed', 0.65, 
 '{"Shadow-free roof area of ~300 sq.ft", "Ownership/NOC of terrace"}',
 'Net-metering approval and grid discom synchronization required.',
 '{"IN", "GLOBAL"}', '{"solar", "renewable", "net-metering"}', 'MNRE India Surya Ghar Scheme / NREL LCA'),

('alt-led-bulb-overhaul', 'energy', 'Full Household Transition to 9W LED Lighting', 
 'Swap out remaining CFL and incandescent halogen bulbs with branded 9W-12W LED fixtures.', 
 'Uses up to 80% less energy than halogen bulbs and lasts up to 25,000 hours with negligible heat emission.',
 'act-ac-cooling', 0.8000, -180.00, 'easy', 0.99, 
 '{}',
 'Properly dispose of mercury-containing CFL bulbs via e-waste collectors.',
 '{"IN", "GLOBAL"}', '{"lighting", "led", "easy-win"}', 'UJALA Scheme / EESL India Evaluation'),

('alt-phantom-power-kill', 'energy', 'Eliminate Vampire / Standby Power on TV & Desktops', 
 'Plug entertainment and computer setups into master surge protectors switched off overnight.', 
 'Standby electronics consume 5% to 10% of baseline residential power doing nothing.',
 'act-ac-cooling', 0.0800, -120.00, 'easy', 0.95, 
 '{}',
 'Do not power off devices that need overnight cloud backups or smart home hubs.',
 '{"IN", "GLOBAL"}', '{"habit", "free", "vampire-power"}', 'Lawrence Berkeley National Laboratory Standby Study'),

('alt-natural-cross-ventilation', 'energy', 'Passive Evening Cross-Ventilation', 
 'Open opposing windows during cooler twilight and nighttime hours to flush daytime heat.', 
 'Cools interior thermal mass using natural breeze, reducing air conditioner run time by 2-3 hours nightly.',
 'act-ac-cooling', 0.3000, -520.00, 'easy', 0.90, 
 '{"Window mosquito mesh"}',
 'Less effective during humid pre-monsoon heatwaves.',
 '{"IN", "GLOBAL"}', '{"passive-cooling", "architecture"}', 'BEE Energy Conservation Building Code (ECBC)'),

('alt-solar-cooker', 'energy', 'Box Solar Cooker for Rice, Dal & Boiling', 
 'Use an insulated parabolic/box solar cooker on sunny terrace or balconies for slow-cooked pulses and rice.', 
 'Cooks food without burning gas or drawing grid power, retaining micronutrients.',
 'act-lpg-cooking', 0.3000, -140.00, 'moderate', 0.60, 
 '{"Sunny terrace or south-facing balcony"}',
 'Requires 2 to 3 hours of direct sunlight and pre-planning meals.',
 '{"IN"}', '{"solar-cooking", "zero-emissions"}', 'TERI / MNRE Solar Cooking Manual'),

('alt-geyser-timer-switch', 'energy', 'Install 20-Minute Timer on Geyser', 
 'Add an automated digital timer switch that shuts off geyser heating coils after 20 minutes.', 
 'Prevents geysers from staying on all morning, eliminating continuous water reheating losses.',
 'act-water-heater-elec', 0.3500, -310.00, 'easy', 0.92, 
 '{}',
 'Requires basic electrical switchboard space.',
 '{"IN", "GLOBAL"}', '{"automation", "geyser", "quick-win"}', 'BEE Geyser Efficiency Standard'),

('alt-refrigerator-coil-cleaning', 'energy', 'Biannual Refrigerator Coil Cleaning & Gasket Check', 
 'Vacuum condenser coils behind the fridge and verify door gasket seals with a paper test.', 
 'Dust-caked coils make compressors work up to 25% harder to reject heat, increasing monthly power usage.',
 'act-ac-cooling', 0.1200, -90.00, 'easy', 0.98, 
 '{}',
 'Unplug unit before vacuuming rear condenser coils.',
 '{"IN", "GLOBAL"}', '{"maintenance", "appliance"}', 'Energy Star Maintenance Guide'),

('alt-bsp-five-star-inverter-ac', 'energy', 'Upgrade to 5-Star Inverter AC with Smart Sensor', 
 'Replace 8-year-old fixed-speed compressor ACs with variable-speed 5-star BEE inverter ACs.', 
 'Variable-speed inverters modulate cooling to match room heat load, cutting seasonal energy use by 35%.',
 'act-ac-cooling', 0.3500, -890.00, 'committed', 0.75, 
 '{"Capital budget"}',
 'Ensure correct tonnage sizing for room square footage to prevent short-cycling.',
 '{"IN"}', '{"inverter-ac", "efficiency"}', 'BEE India Star Rating Standards 2024'),

-- =============================================================================
-- 3. FOOD & DIET ALTERNATIVES (12 Entries)
-- =============================================================================
('alt-meatless-weekdays', 'food', 'Adopt Meatless Weekdays (Plant-Rich Routine)', 
 'Shift to nutritious vegetarian meals from Monday to Friday, enjoying poultry or mutton on weekends.', 
 'Small ruminant meats (goat/mutton) have high enteric emissions (~24 kg CO2e/kg). Replacing 4 meals weekly cuts dietary footprint by ~35%.',
 'act-meat-diet', 0.3500, -1100.00, 'easy', 0.95, 
 '{}',
 'Ensure meals are balanced with dal, rajma, chana, paneer or tofu to maintain protein parity.',
 '{"IN", "GLOBAL"}', '{"diet", "plant-based", "health", "savings"}', 'Poore & Nemecek (Science 2018) / EAT-Lancet'),

('alt-millets-swap-rice', 'food', 'Substitute Polished Rice with Millets (Ragi, Jowar, Bajra)', 
 'Replace polished white rice with indigenous millets for 4 dinners per week.', 
 'Paddy rice cultivation generates continuous anaerobic methane emissions (~2.7 kg CO2e/kg), whereas millets require 70% less water and generate minimal GHG.',
 'act-rice-heavy', 0.4500, -150.00, 'easy', 0.95, 
 '{}',
 'Soak coarse millets for 30 minutes prior to cooking for easier digestion.',
 '{"IN"}', '{"millets", "climate-smart-agriculture", "health"}', 'ICRISAT / IPCC AR6 Agriculture'),

('alt-plant-milk-swap', 'food', 'Switch Morning Beverage to Local Soy / Oat Milk', 
 'Use soy or oat milk for breakfast tea, coffee, and porridge instead of commercial dairy.', 
 'Plant-based milks produce 72% lower greenhouse gas emissions and require up to 85% less land than cow milk.',
 'act-dairy-heavy', 0.7200, 120.00, 'easy', 0.90, 
 '{}',
 'Read labels to choose fortified versions with calcium and B12 with no added sugars.',
 '{"IN", "GLOBAL"}', '{"plant-milk", "dairy-free"}', 'Poore & Nemecek 2018 / DEFRA 2024'),

('alt-local-seasonal-produce', 'food', 'Buy 100% Seasonal & Local Mandi Produce', 
 'Cook with regional in-season produce (e.g. gourds in summer, root veggies and greens in winter) rather than air-freighted imports.', 
 'Eliminates cold-chain freight and refrigerated warehousing emissions while supporting local growers.',
 'act-meat-diet', 0.2000, -600.00, 'easy', 0.95, 
 '{}',
 'Requires adapting recipe plans to seasonal harvest calendars.',
 '{"IN", "GLOBAL"}', '{"seasonal", "farmers-market", "budget"}', 'DEFRA 2024 / FAO Food Miles Report'),

('alt-zero-food-waste-cooking', 'food', 'Batch Planning & Zero-Food-Waste Cooking', 
 'Plan weekly meals, store herbs properly, freeze leftovers, and use vegetable trimmings in broth.', 
 'Preventing food spoilage avoids methane emissions from landfill decay and saves up to ₹1,500 monthly on wasted groceries.',
 'act-meat-diet', 0.2500, -1500.00, 'easy', 0.92, 
 '{}',
 'Requires 20 minutes of pantry stock checking before weekend shopping.',
 '{"IN", "GLOBAL"}', '{"waste-prevention", "pantry", "savings"}', 'Project Drawdown / WRAP UK'),

('alt-lentil-protein-boost', 'food', 'Replace Red Meat with Sprouts & Lentils (Dal, Chana)', 
 'Use sprouted moong, black chana, and horse gram as primary protein bases.', 
 'Pulses fix nitrogen directly in the soil, requiring minimal chemical fertilizers, and produce only ~0.85 kg CO2e/kg protein.',
 'act-meat-diet', 0.7800, -1400.00, 'moderate', 0.95, 
 '{}',
 'Sprouting takes 24 hours of ambient soaking.',
 '{"IN", "GLOBAL"}', '{"pulses", "high-protein", "cheap"}', 'FAO Pulses and Climate Change'),

('alt-bulk-staples-buying', 'food', 'Purchase Grains & Spices in Bulk Cloth Bags', 
 'Buy unpolished grains, lentils, and spices from local wholesale stores in 5kg-10kg cloth sacks.', 
 'Avoids dozens of single-use multi-layer plastic laminate pouches that are nearly impossible to recycle.',
 'act-fast-fashion', 0.3000, -350.00, 'easy', 0.90, 
 '{"Dry storage containers / tins at home"}',
 'Keep in airtight metal or glass canisters to prevent pantry weevils during monsoon.',
 '{"IN"}', '{"zero-waste", "bulk", "pantry"}', 'Ellen MacArthur Foundation 2023'),

('alt-traditional-filter-coffee', 'food', 'Brew Traditional Stove Drip Coffee vs Pods', 
 'Use a brass/steel South Indian coffee filter or French press instead of single-serve aluminum capsule pods.', 
 'Capsule pods generate significant embodied manufacturing waste and aluminum smelting emissions.',
 'act-fast-fashion', 0.5000, -450.00, 'easy', 0.95, 
 '{}',
 'Compost the remaining used coffee grounds directly in houseplant soil.',
 '{"IN", "GLOBAL"}', '{"coffee", "zero-waste", "ritual"}', 'LCA of Coffee Brewing Methods (Humbert et al.)'),

('alt-home-grown-herbs', 'food', 'Balcony Herb & Microgreens Garden', 
 'Grow mint (pudina), coriander (dhaniya), tulsi, and chilies in small windowsill planters.', 
 'Eliminates plastic bundling, transport emissions, and reduces grocery waste.',
 'act-meat-diet', 0.0500, -180.00, 'moderate', 0.85, 
 '{"Sunny window or balcony sill"}',
 'Requires regular watering and basic potting mix care.',
 '{"IN", "GLOBAL"}', '{"gardening", "herbs", "balcony"}', 'Urban Agriculture Carbon Metrics 2023'),

('alt-pot-in-pot-cooling', 'food', 'Earthen Clay Pot (Matka) for Naturally Chilled Water', 
 'Store drinking water in an authentic terracotta clay matka instead of continuous refrigerator cooling.', 
 'Provides cooling via natural evaporation with zero electricity consumption and imparts beneficial minerals.',
 'act-ac-cooling', 0.0800, -100.00, 'easy', 0.98, 
 '{}',
 'Clean the pot weekly and ensure hygienic dispensing with a ladled tap.',
 '{"IN"}', '{"traditional-wisdom", "clay", "zero-energy"}', 'Traditional Indian Low-Energy Cooling Studies'),

('alt-sustainable-fish', 'food', 'Choose Local Small Pelagic Fish Over Carnivorous Farmed Species', 
 'Eat locally caught sardines and mackerel rather than intensive pond-farmed carnivorous tiger prawns or salmon.', 
 'Small pelagic schooling fish have low trophic feed needs and minimal fossil-fuel feed footprint.',
 'act-meat-diet', 0.4000, -400.00, 'moderate', 0.75, 
 '{}',
 'Subject to seasonal monsoon marine fishing bans along Indian coastlines.',
 '{"IN"}', '{"seafood", "sustainable-fishing"}', 'Seafood Carbon Footprint Benchmark 2023'),

('alt-dairy-paneer-moderation', 'food', 'Alternate Dairy Paneer with Organic Tofu', 
 'Use non-GMO local soya paneer (tofu) for curries twice a week.', 
 'Dairy paneer requires ~10 liters of whole milk per kg produced; tofu has a 75% smaller carbon and water footprint.',
 'act-dairy-heavy', 0.5500, -250.00, 'easy', 0.90, 
 '{}',
 'Press tofu before marinating to achieve desired firmness and sauce absorption.',
 '{"IN", "GLOBAL"}', '{"tofu", "protein", "dairy-swap"}', 'Water Footprint Network / Poore & Nemecek'),

-- =============================================================================
-- 4. SHOPPING & CONSUMER GOODS (10 Entries)
-- =============================================================================
('alt-thrift-clothing', 'shopping', 'Buy Second-Hand / Thrift Apparel First', 
 'Source festival or daily casual garments through curated thrift stores, swap meets, or flea markets.', 
 'Extending a garment lifecycle by just 9 months reduces its combined carbon, waste, and water footprint by 20-30%.',
 'act-fast-fashion', 0.8200, -1800.00, 'easy', 0.88, 
 '{}',
 'Thrift sizing is one-of-a-kind, requiring patience and sizing checks.',
 '{"IN", "GLOBAL"}', '{"thrift", "circular-fashion", "savings"}', 'WRAP UK Textile Carbon Report / Ellen MacArthur'),

('alt-refurbished-electronics', 'shopping', 'Choose Certified Refurbished Phones & Laptops', 
 'Buy certified pre-owned devices with warranty instead of brand new electronics.', 
 'Over 80% of a smartphone life-cycle carbon footprint occurs in semiconductor fabrication and mining. Refurbishment cuts emissions by up to 80%.',
 'act-new-electronics', 0.8000, -3500.00, 'moderate', 0.85, 
 '{}',
 'Purchase exclusively from vendors offering certified battery health and at least a 6-month warranty.',
 '{"IN", "GLOBAL"}', '{"electronics", "circular-economy", "high-impact"}', 'ADEME France Life Cycle Assessment 2022'),

('alt-clothes-repair-tailor', 'shopping', 'Utilize Local Tailors for Alteration & Visible Mending', 
 'Repair broken zippers, patch worn seams, and re-dye faded cotton clothes at local neighborhood tailors.', 
 'Keeps wearable textiles out of landfills at minimal cost while supporting local craftspeople.',
 'act-fast-fashion', 0.7500, -1200.00, 'easy', 0.95, 
 '{}',
 'Some synthetic blended stretch fabrics cannot be re-dyed effectively.',
 '{"IN"}', '{"repair", "circular", "support-local"}', 'Fashion Revolution Mending Index 2023'),

('alt-borrow-infrequent-tools', 'shopping', 'Borrow or Rent Infrequent Tools (Drills, Ladders)', 
 'Borrow power drills, camping gear, and festive attire from neighbors, community tool libraries, or rental apps.', 
 'Eliminates the manufacturing and packaging footprint of items that sit idle 99% of their lifespan.',
 'act-new-electronics', 0.6500, -800.00, 'easy', 0.85, 
 '{}',
 'Requires returning tools clean and promptly to maintain trust.',
 '{"IN", "GLOBAL"}', '{"sharing-economy", "tools", "anti-clutter"}', 'Ellen MacArthur Foundation Circular Economy'),

('alt-rechargeable-batteries', 'shopping', 'Switch to Low-Self-Discharge NiMH Rechargeable Batteries', 
 'Use rechargeable AA/AAA batteries with USB charging docks for remotes, clocks, and mice.', 
 'One high-quality NiMH cell replaces up to 500 single-use alkaline batteries, preventing toxic heavy metal landfill leaching.',
 'act-new-electronics', 0.6000, -150.00, 'easy', 0.95, 
 '{}',
 'Initial charger and battery pack cost is higher than a single blister pack of alkalines.',
 '{"IN", "GLOBAL"}', '{"batteries", "toxic-waste", "e-waste"}', 'US EPA Battery Environmental Impact Assessment'),

('alt-bar-soap-shampoo', 'shopping', 'Replace Bottled Liquids with Solid Bar Shampoos & Soaps', 
 'Switch to unpackaged or paper-wrapped solid bathing bars and solid shampoo bars.', 
 'Liquid soaps and body washes are 80-90% water shipped in heavy single-use plastic pump bottles.',
 'act-fast-fashion', 0.4000, -180.00, 'easy', 0.95, 
 '{}',
 'Use a self-draining soap dish so bars dry between uses and last longer.',
 '{"IN", "GLOBAL"}', '{"plastic-free", "bathroom", "zero-waste"}', 'LCA of Personal Care Packaging (ETH Zurich)'),

('alt-linen-tote-bags', 'shopping', 'Keep Foldable Cotton / Jute Totes in Every Commute Bag', 
 'Keep durable cotton or jute bags inside your work bag, car, and scooter dashboard at all times.', 
 'Eliminates single-use poly shopping bags across grocery and errand stops.',
 'act-fast-fashion', 0.3500, -80.00, 'easy', 0.99, 
 '{}',
 'Cotton bags have higher embodied manufacturing energy than plastic, so reuse each tote at least 50-100 times to achieve net positive impact.',
 '{"IN", "GLOBAL"}', '{"tote-bag", "zero-waste", "habit"}', 'UK Environment Agency LCA of Supermarket Carrier Bags'),

('alt-stainless-steel-containers', 'shopping', 'Store Pantry Goods in Stainless Steel Dabbas', 
 'Use traditional food-grade stainless steel canisters and dabbas for food storage instead of Tupperware.', 
 'Lasts a lifetime, does not leach microplastics or endocrine disruptors into food, and is 100% recyclable.',
 'act-fast-fashion', 0.3000, -120.00, 'easy', 0.95, 
 '{}',
 'Steel is not microwave-safe; warm food on stove or in ceramic bowls.',
 '{"IN"}', '{"steel", "non-toxic", "longevity"}', 'Indian Traditional Utensils Materials Science 2023'),

('alt-digital-first-library', 'shopping', 'Digital & Public Library Borrowing for Reading', 
 'Use municipal public libraries or digital e-readers for pleasure reading instead of buying new paperbacks.', 
 'Eliminates virgin paper pulping, ink chemical emissions, and book transport.',
 'act-fast-fashion', 0.2500, -400.00, 'easy', 0.95, 
 '{}',
 'E-readers have embodied electronics manufacturing emissions; read at least 25-30 titles on one device to beat paper books.',
 '{"IN", "GLOBAL"}', '{"books", "reading", "digital"}', 'Green Press Initiative Life Cycle Study'),

('alt-fountain-pen-metal', 'shopping', 'Refillable Metal Fountain / Rollerball Pens', 
 'Write with refillable ink converter pens rather than disposable plastic ballpoints.', 
 'Millions of plastic disposable pens end up in landfills annually without ever decomposing.',
 'act-fast-fashion', 0.1500, -60.00, 'easy', 0.95, 
 '{}',
 'Requires keeping an ink bottle at home and periodic nib flushing.',
 '{"IN", "GLOBAL"}', '{"stationery", "zero-waste"}', 'Stationery Plastics Waste Stream Analysis'),

-- =============================================================================
-- 5. WASTE & WATER ALTERNATIVES (10 Entries)
-- =============================================================================
('alt-home-composting-khamba', 'waste', 'Terracotta Khamba / Aerobic Home Composting', 
 'Compost household vegetable peels, tea grounds, and fruit rinds in stacked terracotta pots.', 
 'Prevents anaerobic decomposition in landfills which emits methane (CH4, 28x more potent than CO2), while yielding rich natural fertilizer.',
 'act-wet-waste-landfill', 0.8620, 0.00, 'moderate', 0.85, 
 '{"Balcony or small outdoor utility corner", "Dry leaves / coco peat"}',
 'Maintain proper 2:1 dry-to-wet carbon balance to prevent odors and moisture buildup.',
 '{"IN"}', '{"composting", "zero-waste", "soil-health"}', 'US EPA WARM 2024 / Daily Dump India'),

('alt-reusable-steel-flask', 'waste', 'Carry Insulated Stainless Steel Water Bottle', 
 'Carry a 750ml-1L personal flask filled from home or filtered office stations.', 
 'Avoids purchasing 20-30 single-use PET bottles monthly, saving significant plastic waste and ongoing expense.',
 'act-packaged-water', 0.9500, -950.00, 'easy', 0.99, 
 '{}',
 'Clean the flask interior and rubber seal with hot water weekly.',
 '{"IN", "GLOBAL"}', '{"water", "plastic-free", "essential"}', 'DEFRA 2024 / UNEP Single-Use Plastics'),

('alt-aerator-water-taps', 'waste', 'Install Low-Flow Faucet Aerators', 
 'Screw 3-star rated micro-aerators into kitchen and bathroom sink spouts.', 
 'Reduces water flow from 12-15 liters/min to 5-6 liters/min by mixing air with water, cutting domestic water draw by 50% without loss in pressure.',
 'act-water-heater-elec', 0.5000, -280.00, 'easy', 0.95, 
 '{}',
 'Descaling screen may be needed every 6 months in hard-water zones.',
 '{"IN", "GLOBAL"}', '{"water-conservation", "aerator", "quick-win"}', 'Bureau of Indian Standards / US EPA WaterSense'),

('alt-ro-reject-water-reuse', 'waste', 'Channel RO Purifier Reject Water for Cleaning', 
 'Redirect the brine wastewater pipe from your reverse osmosis purifier into a 20-liter bucket for mopping, flushing, and balcony washing.', 
 'Standard home RO systems waste 3 to 4 liters of clean water for every 1 liter of drinking water produced.',
 'act-wet-waste-landfill', 0.4000, -150.00, 'easy', 0.92, 
 '{"Collection bucket or storage jerrycan next to sink"}',
 'RO reject water has elevated total dissolved solids (TDS); do not use on sensitive potted plants.',
 '{"IN"}', '{"water-saving", "ro-filter", "frugal-engineering"}', 'TERI India Water Audit 2023'),

('alt-dry-wet-segregation', 'waste', 'Two-Bin Wet & Dry Waste Segregation at Source', 
 'Separate clean dry recyclables (paper, cardboard, plastics, metals) from compostable wet scraps in distinct bins.', 
 'Enables formal municipal recovery and informal waste-picker recycling, keeping clean materials out of dump-fires and landfills.',
 'act-wet-waste-landfill', 0.6000, 0.00, 'easy', 0.98, 
 '{"Two distinct bins with clear visual labelling"}',
 'Ensure food containers are rinsed clean before placing into the dry bin.',
 '{"IN"}', '{"segregation", "swachh-bharat", "community"}', 'Solid Waste Management Rules 2016 (MoEFCC India)'),

('alt-dual-flush-toilet-retrofit', 'waste', 'Dual-Flush Cistern Converter / Cistern Displacement Bag', 
 'Install a dual-flush button mechanism or displacement bag in older single-flush toilet tanks.', 
 'Saves 4-6 liters of water on every liquid waste flush, conserving thousands of liters of treated water per month.',
 'act-water-heater-elec', 0.3500, -180.00, 'easy', 0.92, 
 '{}',
 'Verify that the reduced volume provides sufficient hydraulic head for sanitary clearance.',
 '{"IN", "GLOBAL"}', '{"water", "plumbing", "conservation"}', 'US EPA WaterSense / Jal Jeevan Mission'),

('alt-rainwater-harvesting-groundwater', 'waste', 'Rooftop Rainwater Harvesting & Borewell Recharge', 
 'Connect rooftop gutters to a sedimentation filter pit recharging local shallow aquifers.', 
 'Captures heavy seasonal monsoon precipitation, replenishing dropping urban water tables and preventing street flash-flooding.',
 'act-ac-cooling', 0.7000, -600.00, 'committed', 0.60, 
 '{"Rooftop catchment ownership", "Recharge pit or sump construction"}',
 'First-flush diverter must be cleared after dry summer dust buildup.',
 '{"IN"}', '{"water-security", "rainwater", "climate-resilience"}', 'Central Ground Water Board (CGWB) India'),

('alt-silicon-covers-over-clingfilm', 'waste', 'Reusable Silicone Lids / Beeswax Cloth Wraps Over Plastic Cling Film', 
 'Cover bowls, cut melons, and leftovers with stretchy food-grade silicone lids or washable beeswax wraps.', 
 'Replaces non-recyclable PVC/PE cling film that immediately ends up in trash after a single use.',
 'act-fast-fashion', 0.2500, -90.00, 'easy', 0.95, 
 '{}',
 'Wash with cold water and mild dish soap; hot water melts natural beeswax.',
 '{"IN", "GLOBAL"}', '{"kitchen", "plastic-free", "reusable"}', 'Zero Waste International Alliance'),

('alt-cloth-cleaning-rags', 'waste', 'Repurpose Worn Clothes into Cleaning Rags', 
 'Cut up unwearable old cotton banian/t-shirts for kitchen spills and dusting instead of buying disposable paper towels.', 
 'Saves paper pulp manufacturing emissions and diverts end-of-life textiles.',
 'act-fast-fashion', 0.2000, -120.00, 'easy', 0.99, 
 '{}',
 'Wash and dry in sunlight periodically for sanitation.',
 '{"IN", "GLOBAL"}', '{"upcycling", "frugal", "zero-cost"}', 'Circular Textiles Initiative'),

('alt-menstrual-cup-reusables', 'waste', 'Medical-Grade Menstrual Cup or Reusable Cloth Pads', 
 'Switch to medical-grade silicone menstrual cups or certified organic cloth pads.', 
 'Eliminates thousands of bleached disposable sanitary pads containing 90% plastic backing that take 500+ years to decompose.',
 'act-fast-fashion', 0.8500, -350.00, 'moderate', 0.80, 
 '{}',
 'Sterilize with boiling water between cycles.',
 '{"IN", "GLOBAL"}', '{"health", "reusable", "zero-waste"}', 'UNEP Single-Use Sanitary Products LCA');

-- =============================================================================
-- SYSTEM BADGES SEEDING
-- =============================================================================
INSERT INTO public.badges
(key, name, description, icon_name, requirement_description)
VALUES
('badge-first-step', 'First Light', 'Logged your inaugural lifestyle activity on GreenSwap', 'Compass', 'Log any single activity'),
('badge-transit-commuter', 'Metro Pioneer', 'Adopted public transit or active cycling for primary commute', 'Train', 'Adopt metro, bus, or cycling alternative'),
('badge-watt-shaver', 'Kilowatt Tamer', 'Implemented 2 or more household power-saving actions', 'Zap', 'Adopt BLDC fans or AC 24°C calibration'),
('badge-plant-power', 'Field Forager', 'Shifted away from heavy ruminant meats toward local pulses and millets', 'Leaf', 'Adopt plant-rich diet alternatives'),
('badge-zero-waste-scout', 'Compost Sentinel', 'Initiated home composting or source waste segregation', 'Recycle', 'Adopt organic waste composting or two-bin segregation'),
('badge-circular-patron', 'Second-Life Patron', 'Opted for refurbished tech or thrifted garments', 'RefreshCw', 'Adopt refurbished electronics or thrift clothing'),
('badge-half-ton-club', 'Half-Ton Club', 'Accumulated 500 kg of verifiable CO2e savings', 'Award', 'Achieve 500 kg CO2e projected annual savings'),
('badge-30-day-streak', 'Steady Stride', 'Maintained an active logging habit for 30 consecutive days', 'Flame', 'Log activities across 30 distinct days')
ON CONFLICT (key) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon_name = EXCLUDED.icon_name,
    requirement_description = EXCLUDED.requirement_description;

-- =============================================================================
-- WEEKLY HABIT CHALLENGES SEEDING
-- =============================================================================
INSERT INTO public.challenges
(id, title, description, category, duration_days, co2e_impact_potential_kg, badge_key, is_active)
VALUES
('chal-meatless-workweek', 'Plant-Rich Workweek', 'Eat vegetarian, millet, or dal-based meals during Monday to Friday office lunches.', 'food', 5, 8.5, 'badge-plant-power', true),
('chal-transit-sprint', 'Transit 10: Ten Rail / Bus Rides', 'Complete 10 rides on metro rail, city electric buses, or suburban local trains.', 'transport', 14, 18.2, 'badge-transit-commuter', true),
('chal-ac-calibration-7d', '24°C Cool Calibration', 'Set household AC units to 24°C or higher with ceiling fan support every evening for 7 days.', 'energy', 7, 12.0, 'badge-watt-shaver', true),
('chal-zero-pet-water', 'Bottleless Fortnight', 'Carry an insulated steel flask and avoid purchasing single-use plastic water bottles for 14 days.', 'waste', 14, 2.5, 'badge-zero-waste-scout', true),
('chal-vampire-power-hunt', 'Phantom Power Cut', 'Switch off TV, gaming, and monitor master sockets at the wall every night before sleep.', 'energy', 7, 3.8, 'badge-watt-shaver', true),
('chal-local-mandi-sweep', '100% Local Mandi Basket', 'Cook with regional in-season vegetables bought from local growers or street carts for a full week.', 'food', 7, 5.0, 'badge-plant-power', true)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    duration_days = EXCLUDED.duration_days,
    co2e_impact_potential_kg = EXCLUDED.co2e_impact_potential_kg,
    badge_key = EXCLUDED.badge_key,
    is_active = EXCLUDED.is_active;

-- ============================================================================
-- Source: 20261008000000_travel_catalog_and_query_indexes.sql
-- ============================================================================
-- Travel factors and activities keep flight records distinct from daily transport.
INSERT INTO public.emission_factors
    (id, category, name, co2e_per_unit, unit, region, year, source, source_url, confidence_interval, notes)
VALUES
    ('trvl-flight-domestic-2024', 'travel', 'Domestic flight, economy class (<1000 km)', 0.2450,
     'passenger_km', 'GLOBAL', 2024, 'UK DESNZ/DEFRA 2024 Greenhouse Gas Conversion Factors',
     'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024',
     0.15, 'Economy seating class; radiative-forcing treatment is described in the cited factor guidance.')
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    name = EXCLUDED.name,
    co2e_per_unit = EXCLUDED.co2e_per_unit,
    unit = EXCLUDED.unit,
    region = EXCLUDED.region,
    year = EXCLUDED.year,
    source = EXCLUDED.source,
    source_url = EXCLUDED.source_url,
    confidence_interval = EXCLUDED.confidence_interval,
    notes = EXCLUDED.notes;

INSERT INTO public.activities
    (id, category, name, description, default_unit, emission_factor_id, default_frequency_per_week, default_quantity)
VALUES
    ('act-travel-domestic-flight', 'travel', 'Domestic air travel',
     'Economy-class domestic air travel, measured in passenger-kilometres.',
     'passenger_km', 'trvl-flight-domestic-2024', 1, 500)
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    default_unit = EXCLUDED.default_unit,
    emission_factor_id = EXCLUDED.emission_factor_id,
    default_frequency_per_week = EXCLUDED.default_frequency_per_week,
    default_quantity = EXCLUDED.default_quantity;

INSERT INTO public.alternatives
    (id, category, title, description, why_better, baseline_activity_id, co2e_saved_ratio,
     cost_delta_monthly_inr, difficulty, feasibility_score, prerequisites, caveats,
     region_availability, tags, source_citation, source_url)
VALUES
    ('alt-travel-rail-short-haul', 'travel', 'Take intercity rail instead of a short domestic flight',
     'Choose rail for a short domestic route when a practical service is available.',
     'The cited passenger-kilometre factors indicate lower operational emissions for rail than for domestic air travel.',
     'act-travel-domestic-flight', 0.9142, 0, 'moderate', 0.75,
     ARRAY['A suitable rail service is available'],
     'The comparison is operational CO2e per passenger-kilometre; route, occupancy, access trips, and service availability affect the result.',
     ARRAY['IN'], ARRAY['travel', 'rail', 'lower-emission'],
     'UK DESNZ/DEFRA 2024 Greenhouse Gas Conversion Factors; Indian Railways 2023',
     'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024'),
    ('alt-travel-overnight-rail', 'travel', 'Use an overnight train where it replaces a flight',
     'Consider an overnight intercity train for a route with a suitable direct or connecting service.',
     'Rail can have lower operational emissions per passenger-kilometre than a domestic flight.',
     'act-travel-domestic-flight', 0.9142, 0, 'moderate', 0.70,
     ARRAY['A suitable overnight rail service is available'],
     'The estimate compares passenger-kilometre factors and excludes hotel, station access, and schedule trade-offs.',
     ARRAY['IN'], ARRAY['travel', 'rail', 'overnight'],
     'UK DESNZ/DEFRA 2024 Greenhouse Gas Conversion Factors; Indian Railways 2023',
     'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024'),
    ('alt-travel-virtual-meeting', 'travel', 'Replace an optional business flight with a remote meeting',
     'Use a remote meeting when an in-person visit is not needed for the work.',
     'Avoiding the flight avoids its modeled flight emissions; energy used by the meeting is not included.',
     'act-travel-domestic-flight', 1.0000, 0, 'easy', 0.85,
     ARRAY['The meeting can achieve its purpose remotely'],
     'This estimate covers the logged flight only. It does not account for home or office energy, equipment, or other travel.',
     ARRAY['GLOBAL'], ARRAY['travel', 'remote', 'conditional'],
     'UK DESNZ/DEFRA 2024 Greenhouse Gas Conversion Factors',
     'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024'),
    ('alt-travel-combine-flight-trips', 'travel', 'Combine two similar trips into one journey',
     'Where practical, coordinate dates and plans so one of two otherwise similar domestic flight journeys is avoided.',
     'Avoiding one of two equal flight journeys would avoid half of those two journeys’ modeled flight emissions.',
     'act-travel-domestic-flight', 0.5000, 0, 'moderate', 0.60,
     ARRAY['The purposes and dates can be combined'],
     'The 50% estimate applies only to two equal logged flight journeys when one is avoided; actual routes may differ.',
     ARRAY['GLOBAL'], ARRAY['travel', 'planning', 'conditional'],
     'UK DESNZ/DEFRA 2024 Greenhouse Gas Conversion Factors',
     'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024')
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    why_better = EXCLUDED.why_better,
    baseline_activity_id = EXCLUDED.baseline_activity_id,
    co2e_saved_ratio = EXCLUDED.co2e_saved_ratio,
    cost_delta_monthly_inr = EXCLUDED.cost_delta_monthly_inr,
    difficulty = EXCLUDED.difficulty,
    feasibility_score = EXCLUDED.feasibility_score,
    prerequisites = EXCLUDED.prerequisites,
    caveats = EXCLUDED.caveats,
    region_availability = EXCLUDED.region_availability,
    tags = EXCLUDED.tags,
    source_citation = EXCLUDED.source_citation,
    source_url = EXCLUDED.source_url,
    is_active = true;

CREATE INDEX IF NOT EXISTS idx_emission_factors_category_region_year
    ON public.emission_factors(category, region, year DESC);
CREATE INDEX IF NOT EXISTS idx_activities_category_name
    ON public.activities(category, name);
CREATE INDEX IF NOT EXISTS idx_activities_emission_factor_id
    ON public.activities(emission_factor_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_logged_at
    ON public.activity_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_alternatives_active_title
    ON public.alternatives(title) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_alternatives_active_category_title
    ON public.alternatives(category, title) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_alternatives_baseline_activity_id
    ON public.alternatives(baseline_activity_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_created_at
    ON public.recommendations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_actions_user_status_updated_at
    ON public.user_actions(user_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_goals_user_target_date
    ON public.goals(user_id, target_date);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_status
    ON public.user_challenges(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id
    ON public.user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_awarded_at
    ON public.user_badges(user_id, awarded_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_user_created_at
    ON public.feedback(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_export_requests_user_created_at
    ON public.data_export_requests(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id
    ON public.user_roles(user_id);

DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

-- Award badges only from challenge completion; do not allow clients to mint them.
DROP POLICY IF EXISTS "user_badges_insert_own" ON public.user_badges;

CREATE OR REPLACE FUNCTION public.award_completed_challenge_badge()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.status = 'completed'
       AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'completed') THEN
        INSERT INTO public.user_badges (user_id, badge_key)
        SELECT NEW.user_id, challenges.badge_key
        FROM public.challenges
        WHERE challenges.id = NEW.challenge_id
          AND challenges.badge_key IS NOT NULL
        ON CONFLICT (user_id, badge_key) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.award_completed_challenge_badge() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS award_completed_challenge_badge_trigger ON public.user_challenges;
CREATE TRIGGER award_completed_challenge_badge_trigger
AFTER INSERT OR UPDATE OF status ON public.user_challenges
FOR EACH ROW
EXECUTE FUNCTION public.award_completed_challenge_badge();
