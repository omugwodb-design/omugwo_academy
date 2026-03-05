-- Omugwo Academy Schema V2 — Enterprise Extensions
-- Run AFTER schema.sql

-- =============================================
-- RBAC: Update users role to support all roles
-- =============================================
ALTER TABLE public.users 
  DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users 
  ADD CONSTRAINT users_role_check 
  CHECK (role IN ('student','instructor','admin','super_admin','moderator','community_manager','marketing_admin'));

-- =============================================
-- SITE BUILDER
-- =============================================

CREATE TABLE public.site_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'Omugwo Academy',
    global_styles JSONB NOT NULL DEFAULT '{}',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.site_pages (
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(site_id, slug)
);

CREATE TABLE public.site_page_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES public.site_pages(id) ON DELETE CASCADE,
    blocks JSONB NOT NULL DEFAULT '[]',
    label TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.site_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    thumbnail TEXT,
    category TEXT NOT NULL,
    page_type TEXT NOT NULL DEFAULT 'custom',
    blocks JSONB NOT NULL DEFAULT '[]',
    tags TEXT[],
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- COMMUNITY SYSTEM
-- =============================================

CREATE TABLE public.community_spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#e85d75',
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public','private','invite_only')),
    moderation_level TEXT DEFAULT 'semi' CHECK (moderation_level IN ('open','semi','strict')),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.community_space_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES public.community_spaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('member','moderator','admin')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(space_id, user_id)
);

CREATE TABLE public.community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES public.community_spaces(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    images TEXT[],
    tags TEXT[],
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_best_answer BOOLEAN DEFAULT FALSE,
    like_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.community_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT like_target CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    )
);

CREATE TABLE public.community_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.users(id),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewed','dismissed','actioned')),
    reviewed_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.community_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES public.community_spaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMPTZ NOT NULL,
    duration_minutes INT DEFAULT 60,
    location TEXT,
    meeting_url TEXT,
    max_attendees INT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.community_event_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.community_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Gamification
CREATE TABLE public.user_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    points INT DEFAULT 0,
    action TEXT NOT NULL,
    source_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    badge_icon TEXT,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Expert verification
CREATE TABLE public.expert_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    title TEXT NOT NULL,
    specialty TEXT,
    credentials TEXT[],
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending','verified','rejected')),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- WEBINAR SYSTEM
-- =============================================

CREATE TABLE public.webinars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'free' CHECK (type IN ('free','paid','members_only','cohort')),
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','live','replay','ended')),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT DEFAULT 60,
    capacity INT DEFAULT 500,
    price DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'NGN',
    banner_url TEXT,
    meeting_url TEXT,
    replay_url TEXT,
    replay_expires_at TIMESTAMPTZ,
    course_upsell_id UUID REFERENCES public.courses(id),
    upsell_discount_pct INT DEFAULT 0,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.webinar_speakers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT,
    avatar_url TEXT,
    bio TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE public.webinar_agenda (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE,
    time_offset TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE public.webinar_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    attended BOOLEAN DEFAULT FALSE,
    attended_duration_minutes INT DEFAULT 0,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(webinar_id, user_id)
);

CREATE TABLE public.webinar_polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]',
    trigger_at_minutes INT,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.webinar_poll_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID REFERENCES public.webinar_polls(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    option_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(poll_id, user_id)
);

CREATE TABLE public.webinar_chat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_host BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.webinar_email_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE,
    send_before_minutes INT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ
);

-- =============================================
-- LMS ENHANCEMENTS
-- =============================================

-- Drip content configuration
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS drip_type TEXT DEFAULT 'immediate';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS drip_config JSONB DEFAULT '{}';

-- Module drip scheduling
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS drip_date TIMESTAMPTZ;
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS drip_after_progress INT;

-- Cohorts
CREATE TABLE public.cohorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','active','completed','archived')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_students INT DEFAULT 50,
    instructor_id UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.cohort_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cohort_id UUID REFERENCES public.cohorts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cohort_id, user_id)
);

CREATE TABLE public.cohort_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cohort_id UUID REFERENCES public.cohorts(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.modules(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    assignment_due_date DATE
);

CREATE TABLE public.cohort_live_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cohort_id UUID REFERENCES public.cohorts(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT DEFAULT 60,
    meeting_url TEXT,
    recording_url TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assignments
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date TIMESTAMPTZ,
    max_score INT DEFAULT 100,
    allow_file_upload BOOLEAN DEFAULT TRUE,
    allow_text_submission BOOLEAN DEFAULT TRUE,
    rubric JSONB DEFAULT '[]',
    peer_review BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','submitted','graded','returned')),
    text_content TEXT,
    file_url TEXT,
    score INT,
    feedback TEXT,
    graded_by UUID REFERENCES public.users(id),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    graded_at TIMESTAMPTZ
);

-- Enhanced quiz system
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS time_limit_minutes INT;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS shuffle_questions BOOLEAN DEFAULT FALSE;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS shuffle_options BOOLEAN DEFAULT FALSE;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS max_attempts INT DEFAULT 3;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS show_correct_answers BOOLEAN DEFAULT TRUE;

-- Quiz question types
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS question_type TEXT DEFAULT 'mcq';
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS scenario_context TEXT;
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS explanation TEXT;

-- User streaks
CREATE TABLE public.user_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_site_pages_site ON public.site_pages(site_id);
CREATE INDEX IF NOT EXISTS idx_site_pages_slug ON public.site_pages(slug);
CREATE INDEX IF NOT EXISTS idx_community_posts_space ON public.community_posts(space_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON public.community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_post ON public.community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_post ON public.community_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_user ON public.community_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_webinar ON public.webinar_registrations(webinar_id);
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_user ON public.webinar_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_cohort_enrollments_cohort ON public.cohort_enrollments(cohort_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_user_points_user ON public.user_points(user_id);

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Public read for published site pages
CREATE POLICY "Public can read published site pages" ON public.site_pages
    FOR SELECT USING (status = 'PUBLISHED');

-- Public read for community spaces
CREATE POLICY "Public can read public spaces" ON public.community_spaces
    FOR SELECT USING (visibility = 'public' AND is_active = TRUE);

-- Users can read their own notifications
CREATE POLICY "Users read own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Users can read community posts in public spaces
CREATE POLICY "Users can read community posts" ON public.community_posts
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.community_spaces WHERE id = space_id AND visibility = 'public')
        OR EXISTS (SELECT 1 FROM public.community_space_members WHERE space_id = community_posts.space_id AND user_id = auth.uid())
    );

-- Users can create posts
CREATE POLICY "Users can create posts" ON public.community_posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can like content
CREATE POLICY "Users can like" ON public.community_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public can read upcoming webinars
CREATE POLICY "Public can read webinars" ON public.webinars
    FOR SELECT USING (TRUE);

-- Admin can manage everything
CREATE POLICY "Admins can manage site_config" ON public.site_config
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Admins can manage site_pages" ON public.site_pages
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Admins can manage webinars" ON public.webinars
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Admins can manage community_spaces" ON public.community_spaces
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Ensure site_config has at least one row
INSERT INTO public.site_config (name) VALUES ('Omugwo Academy') ON CONFLICT DO NOTHING;

-- Users can register for webinars
CREATE POLICY "Users can register for webinars" ON public.webinar_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
