-- =============================================================================
-- Migration: 20260101000004_rollback.sql
-- Description: Reversible rollback script for GreenSwap database schema
-- =============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();

DROP TABLE IF EXISTS public.data_export_requests CASCADE;
DROP TABLE IF EXISTS public.feedback CASCADE;
DROP TABLE IF EXISTS public.audit_log CASCADE;
DROP TABLE IF EXISTS public.user_badges CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;
DROP TABLE IF EXISTS public.user_challenges CASCADE;
DROP TABLE IF EXISTS public.challenges CASCADE;
DROP TABLE IF EXISTS public.goals CASCADE;
DROP TABLE IF EXISTS public.user_actions CASCADE;
DROP TABLE IF EXISTS public.recommendations CASCADE;
DROP TABLE IF EXISTS public.alternatives CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.emission_factors CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.user_preferences CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
