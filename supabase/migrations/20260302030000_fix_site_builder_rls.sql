-- Fix RLS policies for site_builder tables

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view site config" ON public.site_config;
DROP POLICY IF EXISTS "Admins can manage site config" ON public.site_config;
DROP POLICY IF EXISTS "Anyone can view site config" ON public.site_config;
DROP POLICY IF EXISTS "Anyone can view site config" ON site_config;
DROP POLICY IF EXISTS "Anyone can view published pages" ON public.site_pages;
DROP POLICY IF EXISTS "Admins can manage all pages" ON public.site_pages;
DROP POLICY IF EXISTS "Instructors can manage their course pages" ON public.site_pages;
DROP POLICY IF EXISTS "Anyone can view published page versions" ON public.site_page_versions;
DROP POLICY IF EXISTS "Admins can view all versions" ON public.site_page_versions;
DROP POLICY IF EXISTS "Admins can create versions" ON public.site_page_versions;
DROP POLICY IF EXISTS "Admins can update versions" ON public.site_page_versions;
DROP POLICY IF EXISTS "Admins can delete versions" ON public.site_page_versions;

-- Ensure RLS is enabled
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_page_versions ENABLE ROW LEVEL SECURITY;

-- Site Config Policies
-- Ensure idempotency if this policy already exists under another schema reference
DROP POLICY IF EXISTS "Anyone can view site config" ON public.site_config;
CREATE POLICY "Anyone can view site config" ON public.site_config
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage site config" ON public.site_config;
CREATE POLICY "Admins can manage site config" ON public.site_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super_admin', 'admin')
        )
    );

-- Site Pages Policies
CREATE POLICY "Anyone can view published pages" ON public.site_pages
    FOR SELECT USING (
        status = 'PUBLISHED' OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super_admin', 'admin', 'instructor')
        )
    );

CREATE POLICY "Admins can manage all pages" ON public.site_pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Instructors can manage their course pages" ON public.site_pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role = 'instructor'
            AND (course_id IS NULL OR course_id IN (
                SELECT id FROM public.courses 
                WHERE instructor_id::text = auth.uid()::text
            ))
        )
    );

-- Site Page Versions Policies
CREATE POLICY "Anyone can view published page versions" ON public.site_page_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.site_pages sp
            WHERE sp.id = public.site_page_versions.page_id
            AND sp.status = 'PUBLISHED'
        ) OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super_admin', 'admin', 'instructor')
        )
    );

CREATE POLICY "Admins can view all versions" ON public.site_page_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super_admin', 'admin', 'instructor')
        )
    );

CREATE POLICY "Admins can create versions" ON public.site_page_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super_admin', 'admin', 'instructor')
        )
    );

CREATE POLICY "Admins can update versions" ON public.site_page_versions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super_admin', 'admin', 'instructor')
        )
    );

CREATE POLICY "Admins can delete versions" ON public.site_page_versions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('super_admin', 'admin')
        )
    );

-- Grant necessary permissions
GRANT ALL ON public.site_config TO authenticated;
GRANT ALL ON public.site_pages TO authenticated;
GRANT ALL ON public.site_page_versions TO authenticated;
GRANT ALL ON public.site_templates TO authenticated;
