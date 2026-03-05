-- Add version column to site_page_versions table
ALTER TABLE public.site_page_versions
ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- Add version column to site_pages table if it doesn't exist
ALTER TABLE public.site_pages
ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
