-- Ensure community_spaces schema matches admin UI payload

ALTER TABLE public.community_spaces
  ADD COLUMN IF NOT EXISTS slug TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'community_spaces_slug_key'
  ) THEN
    BEGIN
      ALTER TABLE public.community_spaces ADD CONSTRAINT community_spaces_slug_key UNIQUE (slug);
    EXCEPTION WHEN undefined_column THEN NULL;
    END;
  END IF;
END $$;

ALTER TABLE public.community_spaces
  ADD COLUMN IF NOT EXISTS created_by TEXT;

ALTER TABLE public.community_spaces
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.community_spaces
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.community_spaces
  ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';

ALTER TABLE public.community_spaces
  ADD COLUMN IF NOT EXISTS moderation_level TEXT DEFAULT 'semi';

NOTIFY pgrst, 'reload schema';
