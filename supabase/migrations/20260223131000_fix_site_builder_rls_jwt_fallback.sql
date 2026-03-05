-- Fix Site Builder RLS to work with Clerk/JWT role claim fallback

-- Helper condition: user is admin/super_admin/marketing_admin either via users table or JWT claim
-- NOTE: auth.jwt() requires JWT to include a role claim.

-- site_config
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage site config" ON public.site_config;
CREATE POLICY "Admins can manage site config" ON public.site_config
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  );

-- Ensure public read remains
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'site_config'
      AND policyname = 'Public can read site config'
  ) THEN
    CREATE POLICY "Public can read site config" ON public.site_config
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- site_pages
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage site pages" ON public.site_pages;
CREATE POLICY "Admins can manage site pages" ON public.site_pages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  );

-- Ensure public read published policy exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'site_pages'
      AND policyname = 'Public can read published site pages'
  ) THEN
    CREATE POLICY "Public can read published site pages" ON public.site_pages
      FOR SELECT
      USING (status = 'PUBLISHED');
  END IF;
END $$;

-- site_page_versions
ALTER TABLE public.site_page_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read site page versions" ON public.site_page_versions;
CREATE POLICY "Admins can read site page versions" ON public.site_page_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  );

DROP POLICY IF EXISTS "Admins can create site page versions" ON public.site_page_versions;
CREATE POLICY "Admins can create site page versions" ON public.site_page_versions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  );
