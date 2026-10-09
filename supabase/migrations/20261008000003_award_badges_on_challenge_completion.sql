-- Badges are awarded by a database trigger on self-reported challenge completion.
-- Clients cannot directly mint achievements through the user_badges table.
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
