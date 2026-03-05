-- Fix site_config.id to be UUID (idempotent and non-destructive)
-- NOTE: We do NOT drop/recreate the table because other tables (e.g. site_pages)
-- may have foreign keys referencing site_config.

-- Ensure gen_random_uuid() is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  id_type text;
BEGIN
  SELECT c.data_type
  INTO id_type
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = 'site_config'
    AND c.column_name = 'id';

  -- If table doesn't exist, nothing to do here (other migration should create it)
  IF id_type IS NULL THEN
    RAISE NOTICE 'site_config table not found; skipping id type check.';
    RETURN;
  END IF;

  -- If it's already UUID, we are done
  IF id_type = 'uuid' THEN
    RAISE NOTICE 'site_config.id already uuid; skipping.';
    RETURN;
  END IF;

  -- If it's not uuid, attempt a safe conversion by creating a new uuid column
  -- and swapping (only if there are no dependent FKs on id).
  -- If foreign keys exist referencing site_config(id), you must handle those separately.
  RAISE NOTICE 'site_config.id is %, attempting conversion to uuid.', id_type;

  -- Add a new UUID column if needed
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns c2
    WHERE c2.table_schema = 'public'
      AND c2.table_name = 'site_config'
      AND c2.column_name = 'id_uuid'
  ) THEN
    ALTER TABLE public.site_config ADD COLUMN id_uuid uuid;
  END IF;

  -- Populate UUIDs (try casting when possible; otherwise generate new)
  UPDATE public.site_config
  SET id_uuid = CASE
    WHEN id_uuid IS NOT NULL THEN id_uuid
    WHEN id::text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN id::uuid
    ELSE gen_random_uuid()
  END;

  -- If there are no foreign keys referencing site_config(id), swap columns.
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE con.contype = 'f'
      AND con.confrelid = 'public.site_config'::regclass
  ) THEN
    ALTER TABLE public.site_config DROP CONSTRAINT IF EXISTS site_config_pkey;
    ALTER TABLE public.site_config DROP COLUMN id;
    ALTER TABLE public.site_config RENAME COLUMN id_uuid TO id;
    ALTER TABLE public.site_config ALTER COLUMN id SET DEFAULT gen_random_uuid();
    ALTER TABLE public.site_config ADD PRIMARY KEY (id);
  ELSE
    RAISE NOTICE 'Foreign keys reference site_config(id); leaving id_uuid in place for manual migration.';
  END IF;
END $$;
