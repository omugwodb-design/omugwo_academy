-- Create site builder tables (site_config and site_pages)
-- These tables are required for the site builder functionality

-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SET search_path = public, extensions;

-- SITE CONFIG (singleton table for global site settings)
CREATE TABLE IF NOT EXISTS public.site_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id TEXT UNIQUE NOT NULL DEFAULT 'default',
    brand_name TEXT DEFAULT 'Omugwo Academy',
    logo_url TEXT,
    favicon_url TEXT,
    primary_color TEXT DEFAULT '#7C3AED',
    secondary_color TEXT DEFAULT '#EC4899',
    font_family TEXT DEFAULT 'Inter',
    global_styles JSONB DEFAULT '{}',
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    social_links JSONB DEFAULT '{}',
    analytics_config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE PAGES (stores all builder-managed pages)
CREATE TABLE IF NOT EXISTS public.site_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id TEXT NOT NULL DEFAULT 'default',
    page_type TEXT NOT NULL, -- 'homepage', 'course_sales', 'community_landing', 'about', 'blog_post', etc.
    slug TEXT,
    title TEXT NOT NULL,
    meta_description TEXT,
    blocks JSONB NOT NULL DEFAULT '[]',
    global_styles JSONB DEFAULT '{}',
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    is_home_page BOOLEAN DEFAULT FALSE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    community_id UUID,
    version INTEGER DEFAULT 1,
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE PAGE VERSIONS (for version control)
CREATE TABLE IF NOT EXISTS public.site_page_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES public.site_pages(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    blocks JSONB NOT NULL,
    global_styles JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    change_description TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_site_pages_site_id ON public.site_pages(site_id);
CREATE INDEX IF NOT EXISTS idx_site_pages_slug ON public.site_pages(slug);
CREATE INDEX IF NOT EXISTS idx_site_pages_course_id ON public.site_pages(course_id);
CREATE INDEX IF NOT EXISTS idx_site_pages_status ON public.site_pages(status);
CREATE INDEX IF NOT EXISTS idx_site_pages_is_home ON public.site_pages(is_home_page);
CREATE INDEX IF NOT EXISTS idx_site_page_versions_page_id ON public.site_page_versions(page_id);

-- Enable RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_page_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_config
DROP POLICY IF EXISTS "Anyone can view site config" ON public.site_config;
CREATE POLICY "Anyone can view site config" ON public.site_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage site config" ON public.site_config;
CREATE POLICY "Admins can manage site config" ON public.site_config FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('super_admin', 'admin')
    )
);

-- RLS Policies for site_pages
DROP POLICY IF EXISTS "Anyone can view published pages" ON public.site_pages;
CREATE POLICY "Anyone can view published pages" ON public.site_pages FOR SELECT USING (
    status = 'PUBLISHED' OR
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('super_admin', 'admin', 'instructor')
    )
);

DROP POLICY IF EXISTS "Admins can manage all pages" ON public.site_pages;
CREATE POLICY "Admins can manage all pages" ON public.site_pages FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('super_admin', 'admin')
    )
);

DROP POLICY IF EXISTS "Instructors can manage their course pages" ON public.site_pages;
CREATE POLICY "Instructors can manage their course pages" ON public.site_pages FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'instructor'
        AND (
            course_id IS NULL OR
            course_id IN (
                SELECT id FROM public.courses WHERE instructor_id = auth.uid()
            )
        )
    )
);

-- RLS Policies for site_page_versions
DROP POLICY IF EXISTS "Admins can view all versions" ON public.site_page_versions;
CREATE POLICY "Admins can view all versions" ON public.site_page_versions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('super_admin', 'admin', 'instructor')
    )
);

DROP POLICY IF EXISTS "Admins can create versions" ON public.site_page_versions;
CREATE POLICY "Admins can create versions" ON public.site_page_versions FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('super_admin', 'admin', 'instructor')
    )
);

-- Insert default site config if not exists
INSERT INTO public.site_config (name, global_styles)
VALUES ('Omugwo Academy', '{}')
ON CONFLICT (id) DO NOTHING;
