-- Fix site builder RLS policies to use users.auth_id (UUID) instead of users.id::uuid casts
-- This prevents errors when users.id contains non-UUID values like 'test-instructor-001'

-- Site Config
DROP POLICY IF EXISTS "Anyone can view site config" ON public.site_config;
DROP POLICY IF EXISTS "Users can view site config" ON public.site_config;
DROP POLICY IF EXISTS "Admins can manage site config" ON public.site_config;

CREATE POLICY "Anyone can view site config" ON public.site_config
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site config" ON public.site_config
  FOR ALL USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.auth_id = auth.uid()
        AND u.role IN ('super_admin', 'admin')
    )
  );

-- Site Pages
DROP POLICY IF EXISTS "Anyone can view published pages" ON public.site_pages;
DROP POLICY IF EXISTS "Admins can manage all pages" ON public.site_pages;
DROP POLICY IF EXISTS "Instructors can manage their course pages" ON public.site_pages;
DROP POLICY IF EXISTS "site_pages_permissive" ON public.site_pages;

CREATE POLICY "Anyone can view published pages" ON public.site_pages
  FOR SELECT USING (
    status = 'PUBLISHED' OR
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.auth_id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'instructor')
    )
  );

CREATE POLICY "Admins can manage all pages" ON public.site_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.auth_id = auth.uid()
        AND u.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Instructors can manage their course pages" ON public.site_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.auth_id = auth.uid()
        AND u.role = 'instructor'
        AND (
          course_id IS NULL OR
          course_id IN (
            SELECT c.id
            FROM public.courses c
            WHERE c.instructor_id::text = auth.uid()::text
          )
        )
    )
  );

-- Site Page Versions
DROP POLICY IF EXISTS "Anyone can view published page versions" ON public.site_page_versions;
DROP POLICY IF EXISTS "Admins can view all versions" ON public.site_page_versions;
DROP POLICY IF EXISTS "Admins can create versions" ON public.site_page_versions;
DROP POLICY IF EXISTS "Admins can update versions" ON public.site_page_versions;
DROP POLICY IF EXISTS "Admins can delete versions" ON public.site_page_versions;
DROP POLICY IF EXISTS "site_page_versions_permissive" ON public.site_page_versions;

CREATE POLICY "Anyone can view published page versions" ON public.site_page_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.site_pages sp
      WHERE sp.id = public.site_page_versions.page_id
        AND sp.status = 'PUBLISHED'
    ) OR
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.auth_id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'instructor')
    )
  );

CREATE POLICY "Admins can view all versions" ON public.site_page_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.auth_id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'instructor')
    )
  );

CREATE POLICY "Admins can create versions" ON public.site_page_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.auth_id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'instructor')
    )
  );

CREATE POLICY "Admins can update versions" ON public.site_page_versions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.auth_id = auth.uid()
        AND u.role IN ('super_admin', 'admin', 'instructor')
    )
  );

CREATE POLICY "Admins can delete versions" ON public.site_page_versions
  FOR DELETE USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.auth_id = auth.uid()
        AND u.role IN ('super_admin', 'admin')
    )
  );
