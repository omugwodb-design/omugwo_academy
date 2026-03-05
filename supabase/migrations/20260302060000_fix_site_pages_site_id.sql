-- Fix site_pages site_id column to prevent auto-setting to user ID
-- This migration removes any triggers or default values that might be setting site_id to the current user ID

-- First, check if there are any triggers on site_pages table
DROP TRIGGER IF EXISTS set_site_id_to_user ON public.site_pages;

-- Remove any default value from site_id column
ALTER TABLE public.site_pages ALTER COLUMN site_id DROP DEFAULT;

-- Ensure site_id column allows NULL temporarily for debugging
ALTER TABLE public.site_pages ALTER COLUMN site_id DROP NOT NULL;

-- Add a comment to clarify the purpose of site_id
COMMENT ON COLUMN public.site_pages.site_id IS 'References the site_config.id this page belongs to';

-- Recreate the permissive policy to ensure it works correctly
DROP POLICY IF EXISTS "site_pages_permissive" ON public.site_pages;
CREATE POLICY "site_pages_permissive" ON public.site_pages
    FOR ALL USING (true);

-- Grant permissions again to ensure they're correct
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_pages TO authenticated;
