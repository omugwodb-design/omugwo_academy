-- ================================================================
-- Omugwo Academy: Fix Clerk/Supabase Auth & Role Conflicts
-- This script resolves the 42501 "permission denied to set role" error.
-- ================================================================

-- 1. Remove manual Postgres roles that conflict with app-level roles
-- These were causing PostgREST to attempt "SET ROLE" which fails in Supabase cloud.
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'super_admin') THEN
    DROP ROLE super_admin;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
    DROP ROLE admin;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'marketing_admin') THEN
    DROP ROLE marketing_admin;
  END IF;
END $$;

-- 2. Update RLS policies to use a safer role check
-- We will rely on the public.users table (synced by ClerkSupabaseSync) 
-- instead of the JWT 'role' claim which is reserved for Postgres system roles.

-- Site Config
DROP POLICY IF EXISTS "Admins can manage site config" ON public.site_config;
CREATE POLICY "Admins can manage site config" ON public.site_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'marketing_admin')
    )
  );

-- Site Pages
DROP POLICY IF EXISTS "Admins can manage site pages" ON public.site_pages;
CREATE POLICY "Admins can manage site pages" ON public.site_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'marketing_admin')
    )
  );

-- Site Page Versions
DROP POLICY IF EXISTS "Admins can read site page versions" ON public.site_page_versions;
CREATE POLICY "Admins can read site page versions" ON public.site_page_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'marketing_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can create site page versions" ON public.site_page_versions;
CREATE POLICY "Admins can create site page versions" ON public.site_page_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'marketing_admin')
    )
  );

-- Courses
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'marketing_admin')
    )
  );

-- Modules
DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;
CREATE POLICY "Admins can manage modules" ON public.modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'marketing_admin')
    )
  );

-- Lessons
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;
CREATE POLICY "Admins can manage lessons" ON public.lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'marketing_admin')
    )
  );

-- Quizzes
DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;
CREATE POLICY "Admins can manage quizzes" ON public.quizzes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'marketing_admin')
    )
  );

-- Add support for a custom app_role claim if you decide to add it to Clerk
-- This is faster than the EXISTS check above.
-- Example of how to add it to a policy (optional):
-- OR (auth.jwt() ->> 'app_role') IN ('admin', 'super_admin', 'marketing_admin')
