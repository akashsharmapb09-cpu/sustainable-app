BEGIN;

CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT extensions.plan(8);

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated',
     'rls-a@greenswap.test', '', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"RLS A"}'),
    ('22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated',
     'rls-b@greenswap.test', '', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"RLS B"}');

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);

INSERT INTO public.activity_logs
    (user_id, category, activity_name, quantity, unit, frequency_per_week, calculated_co2e_monthly)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'transport', 'RLS test commute', 1, 'km', 1, 0.17);

SELECT extensions.is(
    (SELECT count(*) FROM public.activity_logs WHERE activity_name = 'RLS test commute'),
    1::bigint,
    'a user can read their own activity log'
);

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', true);

SELECT extensions.is(
    (SELECT count(*) FROM public.activity_logs WHERE activity_name = 'RLS test commute'),
    0::bigint,
    'a different user cannot read the activity log'
);

SELECT extensions.throws_ok(
    $$INSERT INTO public.activity_logs
        (user_id, category, activity_name, quantity, unit, frequency_per_week, calculated_co2e_monthly)
      VALUES
        ('11111111-1111-4111-8111-111111111111', 'transport', 'forged owner', 1, 'km', 1, 0.17)$$,
    '42501',
    'a user cannot insert an activity log for another user'
);

SELECT extensions.throws_ok(
    $$INSERT INTO public.user_roles (user_id, role)
      VALUES ('22222222-2222-4222-8222-222222222222', 'admin')$$,
    '42501',
    'a user cannot grant themselves an admin role'
);

SELECT extensions.ok(
    (SELECT count(*) > 0 FROM public.alternatives WHERE is_active),
    'authenticated users can read the active alternatives catalog'
);

RESET ROLE;

SELECT extensions.ok(
    (SELECT count(*) >= 60 FROM public.alternatives WHERE is_active),
    'the active alternatives catalog contains at least 60 entries'
);

SELECT extensions.is(
    (SELECT count(DISTINCT category) FROM public.alternatives WHERE is_active),
    6::bigint,
    'the active alternatives catalog covers all six product categories'
);

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', true);

SELECT extensions.is(
    (WITH changed AS (
        UPDATE public.audit_log
        SET action = 'tampered'
        WHERE user_id = '22222222-2222-4222-8222-222222222222'
        RETURNING 1
    )
    SELECT count(*) FROM changed),
    0::bigint,
    'audit log rows cannot be updated by a user'
);

SELECT * FROM extensions.finish();
ROLLBACK;
