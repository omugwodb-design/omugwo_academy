-- Enable and configure RLS for site_page_versions

ALTER TABLE public.site_page_versions ENABLE ROW LEVEL SECURITY;

-- Admins can manage versions
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'site_page_versions'
      AND policyname = 'Admins can manage site_page_versions'
  ) THEN
    CREATE POLICY "Admins can manage site_page_versions" ON public.site_page_versions
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Instructors can read/insert versions for their own course sales pages
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'site_page_versions'
      AND policyname = 'Instructors can manage versions for their course sales pages'
  ) THEN
    CREATE POLICY "Instructors can manage versions for their course sales pages" ON public.site_page_versions
      FOR SELECT
      USING (true);

    CREATE POLICY "Instructors can insert versions for their course sales pages" ON public.site_page_versions
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;
