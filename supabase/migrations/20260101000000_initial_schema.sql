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
