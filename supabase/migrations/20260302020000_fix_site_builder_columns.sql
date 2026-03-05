-- Fix site_builder issues by adding missing columns and ensuring proper structure

-- Add sort_order column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_pages' 
        AND column_name = 'sort_order'
    ) THEN
        ALTER TABLE public.site_pages ADD COLUMN sort_order INT DEFAULT 0;
    END IF;
END $$;

-- Add course_id column if it doesn't exist (for course-specific pages)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_pages' 
        AND column_name = 'course_id'
    ) THEN
        ALTER TABLE public.site_pages ADD COLUMN course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Ensure all required columns exist for site_builder
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_pages' 
        AND column_name = 'page_type'
    ) THEN
        ALTER TABLE public.site_pages ADD COLUMN page_type TEXT NOT NULL DEFAULT 'custom';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_pages' 
        AND column_name = 'draft_blocks'
    ) THEN
        ALTER TABLE public.site_pages ADD COLUMN draft_blocks JSONB NOT NULL DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_pages' 
        AND column_name = 'published_blocks'
    ) THEN
        ALTER TABLE public.site_pages ADD COLUMN published_blocks JSONB NOT NULL DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_pages' 
        AND column_name = 'is_home_page'
    ) THEN
        ALTER TABLE public.site_pages ADD COLUMN is_home_page BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_pages' 
        AND column_name = 'seo_title'
    ) THEN
        ALTER TABLE public.site_pages ADD COLUMN seo_title TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_pages' 
        AND column_name = 'seo_description'
    ) THEN
        ALTER TABLE public.site_pages ADD COLUMN seo_description TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_pages' 
        AND column_name = 'seo_image'
    ) THEN
        ALTER TABLE public.site_pages ADD COLUMN seo_image TEXT;
    END IF;
END $$;

-- Create index on sort_order for better performance
CREATE INDEX IF NOT EXISTS idx_site_pages_sort_order ON public.site_pages(sort_order);
CREATE INDEX IF NOT EXISTS idx_site_pages_course_id ON public.site_pages(course_id);

-- Ensure site_config exists and has proper structure
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_config') THEN
        CREATE TABLE public.site_config (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL DEFAULT 'Omugwo Academy',
            global_styles JSONB NOT NULL DEFAULT '{}',
            published_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Insert default site config
        INSERT INTO public.site_config (id, name, global_styles)
        VALUES ('837b7181-9841-4f2d-adf9-2fac5cfb0c07', 'Omugwo Academy', '{}')
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Update any existing pages to have proper default values
UPDATE public.site_pages 
SET 
    sort_order = COALESCE(sort_order, 0),
    page_type = COALESCE(page_type, 'custom'),
    draft_blocks = COALESCE(draft_blocks, '[]'),
    published_blocks = COALESCE(published_blocks, '[]'),
    is_home_page = COALESCE(is_home_page, FALSE)
WHERE sort_order IS NULL OR page_type IS NULL OR draft_blocks IS NULL OR published_blocks IS NULL OR is_home_page IS NULL;
