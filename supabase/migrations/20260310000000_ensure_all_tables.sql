-- Ensure All Required Tables Exist
-- This migration creates any missing tables that may cause 400/404 errors

-- =============================================
-- COUPONS (if not exists)
-- =============================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_purchase NUMERIC(10,2) DEFAULT 0,
  max_uses INT,
  uses_count INT DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  course_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

 -- If coupons table already existed (from older migrations), normalize created_by to TEXT to match public.users.id
 ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS created_by TEXT;
 DO $$
 BEGIN
   -- If created_by exists but isn't TEXT (e.g. UUID), convert to TEXT
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'coupons'
       AND column_name = 'created_by'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.coupons ALTER COLUMN created_by TYPE TEXT USING created_by::text';
   END IF;
 END $$;

 -- Recreate FK safely (users.id is TEXT in your current DB)
 ALTER TABLE public.coupons DROP CONSTRAINT IF EXISTS coupons_created_by_fkey;
 ALTER TABLE public.coupons
   ADD CONSTRAINT coupons_created_by_fkey
   FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(is_active);

-- =============================================
-- COMMUNITY SPACES (if not exists)
-- =============================================
CREATE TABLE IF NOT EXISTS public.community_spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#e85d75',
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public','private','invite_only')),
    moderation_level TEXT DEFAULT 'semi' CHECK (moderation_level IN ('open','semi','strict')),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

 -- If community_spaces already existed without these columns, add them so policies don't fail
 ALTER TABLE public.community_spaces ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';
 ALTER TABLE public.community_spaces ADD COLUMN IF NOT EXISTS moderation_level TEXT DEFAULT 'semi';

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'community_spaces'
       AND column_name = 'created_by'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.community_spaces ALTER COLUMN created_by TYPE TEXT USING created_by::text';
   END IF;
 END $$;

CREATE TABLE IF NOT EXISTS public.community_space_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES public.community_spaces(id) ON DELETE CASCADE,
    user_id TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('member','moderator','admin')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(space_id, user_id)
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'community_space_members'
       AND column_name = 'user_id'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.community_space_members ALTER COLUMN user_id TYPE TEXT USING user_id::text';
   END IF;
 END $$;

CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES public.community_spaces(id) ON DELETE CASCADE,
    user_id TEXT,
    content TEXT NOT NULL,
    images TEXT[],
    tags TEXT[],
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'community_posts'
       AND column_name = 'user_id'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.community_posts ALTER COLUMN user_id TYPE TEXT USING user_id::text';
   END IF;
 END $$;

 -- If community_posts already existed without is_hidden column, add it so policies don't fail
 ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    user_id TEXT,
    content TEXT NOT NULL,
    is_best_answer BOOLEAN DEFAULT FALSE,
    like_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'community_comments'
       AND column_name = 'user_id'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.community_comments ALTER COLUMN user_id TYPE TEXT USING user_id::text';
   END IF;
 END $$;

CREATE TABLE IF NOT EXISTS public.community_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'community_likes'
       AND column_name = 'user_id'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.community_likes ALTER COLUMN user_id TYPE TEXT USING user_id::text';
   END IF;
 END $$;

CREATE TABLE IF NOT EXISTS public.community_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reported_by TEXT,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewed','dismissed','actioned','approved','rejected','hidden')),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'community_reports'
       AND column_name = 'reported_by'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.community_reports ALTER COLUMN reported_by TYPE TEXT USING reported_by::text';
   END IF;
 END $$;

CREATE TABLE IF NOT EXISTS public.community_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES public.community_spaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMPTZ NOT NULL,
    time TEXT,
    duration_minutes INT DEFAULT 60,
    location TEXT,
    meeting_url TEXT,
    max_attendees INT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'community_events'
       AND column_name = 'created_by'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.community_events ALTER COLUMN created_by TYPE TEXT USING created_by::text';
   END IF;
 END $$;

CREATE TABLE IF NOT EXISTS public.community_event_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.community_events(id) ON DELETE CASCADE,
    user_id TEXT,
    rsvped_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'community_event_rsvps'
       AND column_name = 'user_id'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.community_event_rsvps ALTER COLUMN user_id TYPE TEXT USING user_id::text';
   END IF;
 END $$;

-- =============================================
-- GAMIFICATION (if not exists)
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    total_points INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'user_points'
       AND column_name = 'user_id'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.user_points ALTER COLUMN user_id TYPE TEXT USING user_id::text';
   END IF;
 END $$;

CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    name TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    earned_at TIMESTAMPTZ DEFAULT NOW()
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'user_badges'
       AND column_name = 'user_id'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.user_badges ALTER COLUMN user_id TYPE TEXT USING user_id::text';
   END IF;
 END $$;

-- =============================================
-- WEBINARS (if not exists)
-- =============================================
CREATE TABLE IF NOT EXISTS public.webinars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'free' CHECK (type IN ('free','paid','members_only','cohort')),
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','live','replay','ended','draft')),
    date TIMESTAMPTZ,
    time TEXT,
    scheduled_at TIMESTAMPTZ,
    duration_minutes INT DEFAULT 60,
    capacity INT DEFAULT 500,
    max_attendees INT DEFAULT 500,
    price DECIMAL(10,2) DEFAULT 0,
    is_free BOOLEAN DEFAULT TRUE,
    currency TEXT DEFAULT 'NGN',
    banner_url TEXT,
    thumbnail_url TEXT,
    meeting_url TEXT,
    replay_url TEXT,
    replay_expires_at TIMESTAMPTZ,
    course_upsell_id UUID,
    upsell_discount_pct INT DEFAULT 0,
    host_id TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'webinars'
       AND column_name = 'host_id'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.webinars ALTER COLUMN host_id TYPE TEXT USING host_id::text';
   END IF;

   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'webinars'
       AND column_name = 'created_by'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.webinars ALTER COLUMN created_by TYPE TEXT USING created_by::text';
   END IF;
 END $$;

CREATE TABLE IF NOT EXISTS public.webinar_speakers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT,
    avatar_url TEXT,
    bio TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.webinar_agenda (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE,
    time TEXT NOT NULL,
    time_offset TEXT,
    title TEXT NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.webinar_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE,
    user_id TEXT,
    name TEXT,
    email TEXT,
    phone TEXT,
    attended BOOLEAN DEFAULT FALSE,
    attended_duration_minutes INT DEFAULT 0,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(webinar_id, user_id)
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'webinar_registrations'
       AND column_name = 'user_id'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.webinar_registrations ALTER COLUMN user_id TYPE TEXT USING user_id::text';
   END IF;
 END $$;

CREATE TABLE IF NOT EXISTS public.webinar_polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]',
    trigger_at_minutes INT,
    is_active BOOLEAN DEFAULT FALSE,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'webinar_polls'
       AND column_name = 'created_by'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.webinar_polls ALTER COLUMN created_by TYPE TEXT USING created_by::text';
   END IF;
 END $$;

CREATE TABLE IF NOT EXISTS public.webinar_poll_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID REFERENCES public.webinar_polls(id) ON DELETE CASCADE,
    user_id TEXT,
    option_index INT NOT NULL,
    voted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(poll_id, user_id)
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'webinar_poll_votes'
       AND column_name = 'user_id'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.webinar_poll_votes ALTER COLUMN user_id TYPE TEXT USING user_id::text';
   END IF;
 END $$;

CREATE TABLE IF NOT EXISTS public.webinar_chat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE,
    user_id TEXT,
    message TEXT NOT NULL,
    is_host BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

 DO $$
 BEGIN
   IF EXISTS (
     SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'webinar_chat'
       AND column_name = 'user_id'
       AND data_type <> 'text'
   ) THEN
     EXECUTE 'ALTER TABLE public.webinar_chat ALTER COLUMN user_id TYPE TEXT USING user_id::text';
   END IF;
 END $$;

CREATE TABLE IF NOT EXISTS public.webinar_email_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE,
    type TEXT,
    send_at TIMESTAMPTZ,
    send_before_minutes INT,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT DEFAULT 'scheduled',
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ
);

-- =============================================
-- SITE BUILDER (if not exists)
-- =============================================
CREATE TABLE IF NOT EXISTS public.site_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'Omugwo Academy',
    global_styles JSONB NOT NULL DEFAULT '{}',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES public.site_config(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    page_type TEXT NOT NULL DEFAULT 'custom',
    sort_order INT DEFAULT 0,
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','PUBLISHED')),
    draft_blocks JSONB NOT NULL DEFAULT '[]',
    published_blocks JSONB NOT NULL DEFAULT '[]',
    is_home_page BOOLEAN DEFAULT FALSE,
    seo_title TEXT,
    seo_description TEXT,
    seo_image TEXT,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_page_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES public.site_pages(id) ON DELETE CASCADE,
    blocks JSONB NOT NULL DEFAULT '[]',
    label TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROFILES (ensure it exists for joins)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_community_posts_space ON public.community_posts(space_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_post ON public.community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_post ON public.community_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_user ON public.community_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_webinar ON public.webinar_registrations(webinar_id);
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_user ON public.webinar_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_webinar_chat_webinar ON public.webinar_chat(webinar_id);
CREATE INDEX IF NOT EXISTS idx_user_points_user ON public.user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_site_pages_slug ON public.site_pages(slug);
CREATE INDEX IF NOT EXISTS idx_site_pages_home ON public.site_pages(is_home_page);

-- =============================================
-- RLS POLICIES (basic read access)
-- =============================================
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Public read policies
DROP POLICY IF EXISTS "Public can read community spaces" ON public.community_spaces;
CREATE POLICY "Public can read community spaces" ON public.community_spaces FOR SELECT USING (visibility = 'public' OR visibility IS NULL);

 -- Allow admins / community managers to manage spaces
 DROP POLICY IF EXISTS "Admins can manage community spaces" ON public.community_spaces;
 CREATE POLICY "Admins can manage community spaces" ON public.community_spaces
   FOR ALL
   TO authenticated
   USING (
     (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'community_manager')
     OR EXISTS (
       SELECT 1
       FROM public.users u
       WHERE u.id = auth.uid()::text
         AND u.role IN ('admin', 'super_admin', 'community_manager')
     )
   )
   WITH CHECK (
     (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'community_manager')
     OR EXISTS (
       SELECT 1
       FROM public.users u
       WHERE u.id = auth.uid()::text
         AND u.role IN ('admin', 'super_admin', 'community_manager')
     )
   );

DROP POLICY IF EXISTS "Public can read community posts" ON public.community_posts;
CREATE POLICY "Public can read community posts" ON public.community_posts FOR SELECT USING (is_hidden = false OR is_hidden IS NULL);

DROP POLICY IF EXISTS "Public can read community comments" ON public.community_comments;
CREATE POLICY "Public can read community comments" ON public.community_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read community events" ON public.community_events;
CREATE POLICY "Public can read community events" ON public.community_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read webinars" ON public.webinars;
CREATE POLICY "Public can read webinars" ON public.webinars FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read site config" ON public.site_config;
CREATE POLICY "Public can read site config" ON public.site_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read published site pages" ON public.site_pages;
CREATE POLICY "Public can read published site pages" ON public.site_pages FOR SELECT USING (status = 'PUBLISHED');

-- Authenticated user policies
DROP POLICY IF EXISTS "Authenticated can read all site pages" ON public.site_pages;
CREATE POLICY "Authenticated can read all site pages" ON public.site_pages FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated can manage own posts" ON public.community_posts;
CREATE POLICY "Authenticated can manage own posts" ON public.community_posts FOR ALL TO authenticated USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Authenticated can manage own comments" ON public.community_comments;
CREATE POLICY "Authenticated can manage own comments" ON public.community_comments FOR ALL TO authenticated USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Authenticated can manage own likes" ON public.community_likes;
CREATE POLICY "Authenticated can manage own likes" ON public.community_likes FOR ALL TO authenticated USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Authenticated can register for webinars" ON public.webinar_registrations;
CREATE POLICY "Authenticated can register for webinars" ON public.webinar_registrations FOR ALL TO authenticated USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Authenticated can chat in webinars" ON public.webinar_chat;
CREATE POLICY "Authenticated can chat in webinars" ON public.webinar_chat FOR ALL TO authenticated USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Users can read own points" ON public.user_points;
CREATE POLICY "Users can read own points" ON public.user_points FOR SELECT TO authenticated USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Users can read own badges" ON public.user_badges;
CREATE POLICY "Users can read own badges" ON public.user_badges FOR SELECT TO authenticated USING (user_id = auth.uid()::text);

-- Insert default site config if not exists
INSERT INTO public.site_config (name, global_styles)
SELECT 'Omugwo Academy', '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.site_config LIMIT 1);
