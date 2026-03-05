-- Grant permissions for site_builder tables

-- Grant necessary permissions for authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_config TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_pages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_page_versions TO authenticated;
GRANT SELECT ON public.site_templates TO authenticated;

-- Ensure RLS is enabled but policies allow access
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_page_versions ENABLE ROW LEVEL SECURITY;

-- Create simple permissive policies for site_builder (override existing ones)
DROP POLICY IF EXISTS "site_config_permissive" ON public.site_config;
CREATE POLICY "site_config_permissive" ON public.site_config
    FOR ALL USING (true);

DROP POLICY IF EXISTS "site_pages_permissive" ON public.site_pages;
CREATE POLICY "site_pages_permissive" ON public.site_pages
    FOR ALL USING (true);

DROP POLICY IF EXISTS "site_page_versions_permissive" ON public.site_page_versions;
CREATE POLICY "site_page_versions_permissive" ON public.site_page_versions
    FOR ALL USING (true);
