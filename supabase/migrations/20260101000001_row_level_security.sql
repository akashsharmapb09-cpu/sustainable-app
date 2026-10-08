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
