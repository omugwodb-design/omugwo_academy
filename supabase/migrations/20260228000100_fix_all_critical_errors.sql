-- Comprehensive fix for all critical errors
-- 1. Create site_config and site_pages tables
-- 2. Fix webinar foreign key relationship
-- 3. Ensure lessons table has correct schema

-- ============================================
-- PART 1: FIX EXISTING SITE BUILDER TABLES
-- ============================================

-- Add created_by column if it doesn't exist, then fix its type
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS created_by TEXT;

-- Drop foreign key constraint if it exists, then change type
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_pages_created_by_fkey') THEN
        ALTER TABLE public.site_pages DROP CONSTRAINT site_pages_created_by_fkey;
    END IF;
END $$;

ALTER TABLE public.site_pages ADD CONSTRAINT site_pages_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- Same for site_page_versions
ALTER TABLE public.site_page_versions ADD COLUMN IF NOT EXISTS created_by TEXT;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_page_versions_created_by_fkey') THEN
        ALTER TABLE public.site_page_versions DROP CONSTRAINT site_page_versions_created_by_fkey;
    END IF;
END $$;

ALTER TABLE public.site_page_versions ADD CONSTRAINT site_page_versions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- Add missing columns if they don't exist
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS draft_blocks JSONB DEFAULT '[]';
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS published_blocks JSONB DEFAULT '[]';
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS page_type TEXT DEFAULT 'homepage';
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS is_home_page BOOLEAN DEFAULT FALSE;
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE;
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS community_id UUID;
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Add navbar and footer configuration columns to site_config
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS navbar_config JSONB DEFAULT '{}';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS footer_config JSONB DEFAULT '{}';

-- Add site_id column if it doesn't exist (without unique constraint first)
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS site_id TEXT DEFAULT 'default';

-- Remove duplicates - keep only the most recent record
DELETE FROM public.site_config 
WHERE id NOT IN (
    SELECT DISTINCT ON (site_id) id 
    FROM public.site_config 
    ORDER BY site_id, updated_at DESC
);

-- Now add unique constraint
ALTER TABLE public.site_config ADD CONSTRAINT site_config_site_id_key UNIQUE (site_id);

-- Update existing site_config with navbar/footer data
UPDATE public.site_config SET 
    navbar_config = '{"logo": "Omugwo Academy", "links": [{"label": "Courses", "href": "/courses"}, {"label": "Community", "href": "/community"}, {"label": "Webinars", "href": "/webinars"}], "ctaText": "Get Started", "ctaLink": "/courses"}',
    footer_config = '{"copyright": " 2024 Omugwo Academy. All rights reserved.", "links": [{"label": "About", "href": "/about"}, {"label": "Contact", "href": "/contact"}, {"label": "Privacy", "href": "/privacy"}], "socialLinks": {"facebook": "", "twitter": "", "instagram": ""}}',
    updated_at = NOW()
WHERE site_id = 'default' OR id = (SELECT id FROM public.site_config LIMIT 1);

-- Enable RLS for site builder tables (if not already enabled)
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_page_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Anyone can view site config" ON public.site_config;
CREATE POLICY "Anyone can view site config" ON public.site_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage site config" ON public.site_config;
CREATE POLICY "Admins can manage site config" ON public.site_config FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id::uuid = auth.uid() AND users.role IN ('super_admin', 'admin'))
);

DROP POLICY IF EXISTS "Anyone can view published pages" ON public.site_pages;
CREATE POLICY "Anyone can view published pages" ON public.site_pages FOR SELECT USING (
    status = 'PUBLISHED' OR
    EXISTS (SELECT 1 FROM public.users WHERE users.id::uuid = auth.uid() AND users.role IN ('super_admin', 'admin', 'instructor'))
);

DROP POLICY IF EXISTS "Admins can manage all pages" ON public.site_pages;
CREATE POLICY "Admins can manage all pages" ON public.site_pages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id::uuid = auth.uid() AND users.role IN ('super_admin', 'admin'))
);

DROP POLICY IF EXISTS "Instructors can manage their course pages" ON public.site_pages;
CREATE POLICY "Instructors can manage their course pages" ON public.site_pages FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.users WHERE users.id::uuid = auth.uid() AND users.role = 'instructor'
        AND (course_id IS NULL OR course_id IN (SELECT id FROM public.courses WHERE instructor_id::uuid = auth.uid()))
    )
);

DROP POLICY IF EXISTS "Admins can view all versions" ON public.site_page_versions;
CREATE POLICY "Admins can view all versions" ON public.site_page_versions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id::uuid = auth.uid() AND users.role IN ('super_admin', 'admin', 'instructor'))
);

DROP POLICY IF EXISTS "Admins can create versions" ON public.site_page_versions;
CREATE POLICY "Admins can create versions" ON public.site_page_versions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE users.id::uuid = auth.uid() AND users.role IN ('super_admin', 'admin', 'instructor'))
);

-- ============================================
-- PART 2: FIX WEBINAR FOREIGN KEY
-- ============================================

-- Ensure webinars table exists with correct schema
CREATE TABLE IF NOT EXISTS public.webinars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    host_id UUID,
    thumbnail_url TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
    webinar_type TEXT DEFAULT 'free' CHECK (webinar_type IN ('free', 'paid', 'members_only', 'cohort')),
    price DECIMAL(10,2) DEFAULT 0,
    max_attendees INTEGER,
    is_free BOOLEAN DEFAULT TRUE,
    topics JSONB DEFAULT '[]',
    course_upsell_id UUID REFERENCES public.courses(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS host_id UUID;
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS topics JSONB DEFAULT '[]';
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scheduled';
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS webinar_type TEXT DEFAULT 'free';
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS max_attendees INTEGER;
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT TRUE;
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS course_upsell_id UUID REFERENCES public.courses(id);

-- Create unique constraint on slug if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'webinars_slug_key') THEN
        ALTER TABLE public.webinars ADD CONSTRAINT webinars_slug_key UNIQUE (slug);
    END IF;
END $$;

-- Enable RLS for webinars
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;

-- Webinar RLS policies
DROP POLICY IF EXISTS "Anyone can view webinars" ON public.webinars;
CREATE POLICY "Anyone can view webinars" ON public.webinars FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage webinars" ON public.webinars;
CREATE POLICY "Admins can manage webinars" ON public.webinars FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id::uuid = auth.uid() AND users.role IN ('super_admin', 'admin'))
);

-- ============================================
-- PART 3: FIX LESSONS TABLE SCHEMA
-- ============================================

-- Ensure lessons table has all required columns
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'video';
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT FALSE;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- Ensure lessons table exists with correct schema
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'video',
    content TEXT,
    video_url TEXT,
    video_duration_seconds INTEGER,
    duration_minutes INTEGER,
    order_index INTEGER NOT NULL,
    is_free BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    resources JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on module_id
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id);

-- Enable RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Lessons RLS policies
DROP POLICY IF EXISTS "Anyone can view published lessons" ON public.lessons;
CREATE POLICY "Anyone can view published lessons" ON public.lessons FOR SELECT USING (
    is_published = true OR
    EXISTS (SELECT 1 FROM public.users WHERE users.id::uuid = auth.uid() AND users.role IN ('super_admin', 'admin', 'instructor'))
);

DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.lessons;
CREATE POLICY "Admins can manage all lessons" ON public.lessons FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id::uuid = auth.uid() AND users.role IN ('super_admin', 'admin'))
);

DROP POLICY IF EXISTS "Instructors can manage their course lessons" ON public.lessons;
CREATE POLICY "Instructors can manage their course lessons" ON public.lessons FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.users u
        JOIN public.modules m ON m.id = lessons.module_id
        JOIN public.courses c ON c.id = m.course_id
        WHERE u.id::uuid = auth.uid() AND u.role = 'instructor' AND c.instructor_id::uuid = auth.uid()
    )
);

-- ============================================
-- PART 4: CREATE WEBINAR RELATED TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS public.webinar_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID NOT NULL REFERENCES public.webinars(id) ON DELETE CASCADE,
    user_id UUID,
    email TEXT NOT NULL,
    full_name TEXT,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')),
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(webinar_id, user_id)
);

-- Fix webinar_registrations user_id type (should already be TEXT after model_a)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'user_id' AND data_type = 'uuid') THEN
        ALTER TABLE public.webinar_registrations ALTER COLUMN user_id TYPE TEXT USING user_id::text;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_webinar_registrations_webinar ON public.webinar_registrations(webinar_id);
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_user ON public.webinar_registrations(user_id);

ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their registrations" ON public.webinar_registrations;
CREATE POLICY "Users can view their registrations" ON public.webinar_registrations FOR SELECT USING (
    user_id = auth.uid()::text OR
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid()::text AND users.role IN ('super_admin', 'admin'))
);

DROP POLICY IF EXISTS "Users can register for webinars" ON public.webinar_registrations;
CREATE POLICY "Users can register for webinars" ON public.webinar_registrations FOR INSERT WITH CHECK (
    user_id = auth.uid()::text
);
