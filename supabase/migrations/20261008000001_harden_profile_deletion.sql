-- Account deletion must go through the authenticated Edge Function so the Auth
-- identity and its cascading application data are removed together.
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
