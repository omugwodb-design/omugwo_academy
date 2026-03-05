-- Fix RLS for site_config and site_pages
-- 1. Drop existing restrictive policies if they exist (PostgreSQL requires specific names or just overwrite)
DROP POLICY IF EXISTS "Admins can manage site_config" ON public.site_config;
DROP POLICY IF EXISTS "Admins can manage site_pages" ON public.site_pages;

-- 2. New Site Config Policies
CREATE POLICY "Public can view site_config" 
    ON public.site_config FOR SELECT 
    USING (true);

CREATE POLICY "Staff can manage site_config" 
    ON public.site_config FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin', 'marketing_admin')
    ));

-- 3. New Site Pages Policies
CREATE POLICY "Public can view published site_pages" 
    ON public.site_pages FOR SELECT 
    USING (status = 'PUBLISHED' OR (EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin', 'marketing_admin')
    )));

CREATE POLICY "Staff can manage site_pages" 
    ON public.site_pages FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin', 'marketing_admin')
    ));

-- Ensure site_config has a row
INSERT INTO public.site_config (name) VALUES ('Omugwo Academy') ON CONFLICT DO NOTHING;
