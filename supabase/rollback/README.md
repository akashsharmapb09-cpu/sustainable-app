# Database rollback

Forward migrations are applied in filename order from `supabase/migrations`.
Do not put teardown scripts in that directory: Supabase treats every SQL file
there as a forward migration.

For a deployed database, prefer a new forward migration that reverses the
specific change. Do not edit or replay an already-applied migration to roll
back production data. Review the affected objects, take and verify a backup,
and test the rollback against a disposable project first.

`drop_schema.sql` is a destructive teardown for disposable environments only.
It removes the GreenSwap tables and dependent objects and does not preserve user
data. It is intentionally kept outside the migration directory.
