-- Fix webinars schema to match app expectations
-- Adds created_by and type columns (if missing) to avoid PostgREST schema cache errors

-- Add created_by
ALTER TABLE public.webinars
  ADD COLUMN IF NOT EXISTS created_by TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'webinars'
      AND column_name = 'created_by'
      AND data_type <> 'text'
  ) THEN
    EXECUTE 'ALTER TABLE public.webinars ALTER COLUMN created_by TYPE TEXT USING created_by::text';
  END IF;
END $$;

ALTER TABLE public.webinars
  DROP CONSTRAINT IF EXISTS webinars_created_by_fkey;

ALTER TABLE public.webinars
  ADD CONSTRAINT webinars_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- Add type (preferred) and map from legacy webinar_type if present
ALTER TABLE public.webinars
  ADD COLUMN IF NOT EXISTS type TEXT;

DO $$
BEGIN
  -- If a legacy webinar_type column exists, backfill type when type is null
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'webinars'
      AND column_name = 'webinar_type'
  ) THEN
    UPDATE public.webinars
    SET type = webinar_type
    WHERE type IS NULL;
  END IF;
END $$;

ALTER TABLE public.webinars
  ALTER COLUMN type SET DEFAULT 'free';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'webinars_type_check'
  ) THEN
    ALTER TABLE public.webinars
      ADD CONSTRAINT webinars_type_check
      CHECK (type IN ('free','paid','members_only','cohort'));
  END IF;
END $$;
