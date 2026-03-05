-- Add course scoping to site builder pages

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'site_pages'
      AND column_name = 'course_id'
  ) THEN
    ALTER TABLE public.site_pages
      ADD COLUMN course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_site_pages_course_id ON public.site_pages(course_id);

-- RLS: instructors can manage (CRUD) only their own course sales pages
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'site_pages'
      AND policyname = 'Instructors can manage their course sales pages'
  ) THEN
    -- DROPPED for Model A migration (will recreate admin policies elsewhere)
    -- CREATE POLICY "Instructors can manage their course sales pages" ON public.site_pages
    --   FOR ALL
    --   USING (true)
    --   WITH CHECK (true);
  END IF;
END $$;
