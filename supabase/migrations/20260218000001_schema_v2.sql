-- Omugwo Academy Schema V2 — Enterprise Extensions
-- Run AFTER schema.sql

-- Ensure search path includes extensions for UUID functions
SET search_path = public, extensions;

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
    page_type TEXT NOT NULL,
    blocks JSONB NOT NULL DEFAULT '[]',
    global_styles JSONB DEFAULT '{}',
    status TEXT DEFAULT 'draft',
    is_home_page BOOLEAN DEFAULT FALSE,
    course_id UUID REFERENCES public.courses(id),
    community_id UUID,
    version INTEGER DEFAULT 1,
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.site_page_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES public.site_pages(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    blocks JSONB NOT NULL,
    global_styles JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    change_description TEXT
);

CREATE TABLE public.site_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    page_type TEXT NOT NULL,
    blocks JSONB NOT NULL DEFAULT '[]',
    global_styles JSONB DEFAULT '{}',
    thumbnail TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- COMMUNITY V2
-- =============================================

CREATE TABLE public.community_space_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID NOT NULL REFERENCES public.community_spaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('member','moderator','admin')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(space_id, user_id)
);

CREATE TABLE public.community_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK ((post_id IS NOT NULL) OR (comment_id IS NOT NULL))
);

CREATE TABLE public.community_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewed','resolved','dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK ((post_id IS NOT NULL) OR (comment_id IS NOT NULL))
);

CREATE TABLE public.community_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID NOT NULL REFERENCES public.community_spaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    location TEXT,
    is_virtual BOOLEAN DEFAULT FALSE,
    max_attendees INTEGER,
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.community_event_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'attending' CHECK (status IN ('attending','maybe','not_attending')),
    rsvped_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- =============================================
-- GAMIFICATION
-- =============================================

CREATE TABLE public.user_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL DEFAULT 0,
    source TEXT NOT NULL,
    source_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EXPERT PROFILES
-- =============================================

CREATE TABLE public.expert_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    expertise TEXT[],
    credentials JSONB,
    social_links JSONB,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =============================================
-- WEBINARS V2
-- =============================================

CREATE TABLE public.webinar_speakers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID NOT NULL REFERENCES public.webinars(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    is_host BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.webinar_agenda (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID NOT NULL REFERENCES public.webinars(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    speaker_id UUID REFERENCES public.users(id),
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.webinar_polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID NOT NULL REFERENCES public.webinars(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.webinar_poll_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID NOT NULL REFERENCES public.webinar_polls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    option_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(poll_id, user_id)
);

CREATE TABLE public.webinar_chat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID NOT NULL REFERENCES public.webinars(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_question BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.webinar_email_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webinar_id UUID NOT NULL REFERENCES public.webinars(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- COHORTS
-- =============================================

CREATE TABLE public.cohorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    max_students INTEGER,
    instructor_id UUID NOT NULL REFERENCES public.users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.cohort_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active','completed','dropped')),
    UNIQUE(cohort_id, user_id)
);

CREATE TABLE public.cohort_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    type TEXT DEFAULT 'live_session' CHECK (type IN ('live_session','assignment','quiz','break')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.cohort_live_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID NOT NULL REFERENCES public.cohort_schedule(id) ON DELETE CASCADE,
    meeting_url TEXT,
    recording_url TEXT,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ASSIGNMENTS
-- =============================================

CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date TIMESTAMPTZ,
    max_points INTEGER DEFAULT 100,
    submission_type TEXT DEFAULT 'text' CHECK (submission_type IN ('text','file','link','video')),
    allow_late_submission BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT,
    file_url TEXT,
    link_url TEXT,
    video_url TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    graded_at TIMESTAMPTZ,
    grade INTEGER,
    feedback TEXT,
    graded_by UUID REFERENCES public.users(id),
    UNIQUE(assignment_id, user_id)
);

-- =============================================
-- USER STREAKS & NOTIFICATIONS
-- =============================================

CREATE TABLE public.user_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR V2
-- =============================================

-- Site Builder
CREATE INDEX idx_site_pages_site_id ON public.site_pages(site_id);
CREATE INDEX idx_site_pages_slug ON public.site_pages(slug);
CREATE INDEX idx_site_pages_type ON public.site_pages(page_type);
CREATE INDEX idx_site_page_versions_page_id ON public.site_page_versions(page_id);

-- Community V2
CREATE INDEX idx_community_space_members_space ON public.community_space_members(space_id);
CREATE INDEX idx_community_space_members_user ON public.community_space_members(user_id);
CREATE INDEX idx_community_events_space ON public.community_events(space_id);
CREATE INDEX idx_community_events_date ON public.community_events(event_date);

-- Gamification
CREATE INDEX idx_user_points_user ON public.user_points(user_id);
CREATE INDEX idx_user_points_source ON public.user_points(source, source_id);

-- Webinars V2
CREATE INDEX idx_webinar_speakers_webinar ON public.webinar_speakers(webinar_id);
CREATE INDEX idx_webinar_agenda_webinar ON public.webinar_agenda(webinar_id);
CREATE INDEX idx_webinar_chat_webinar ON public.webinar_chat(webinar_id);
CREATE INDEX idx_webinar_chat_created ON public.webinar_chat(created_at);

-- Cohorts
CREATE INDEX idx_cohorts_course ON public.cohorts(course_id);
CREATE INDEX idx_cohort_enrollments_cohort ON public.cohort_enrollments(cohort_id);
CREATE INDEX idx_cohort_enrollments_user ON public.cohort_enrollments(user_id);
CREATE INDEX idx_cohort_schedule_cohort ON public.cohort_schedule(cohort_id);

-- Assignments
CREATE INDEX idx_assignments_course ON public.assignments(course_id);
CREATE INDEX idx_assignments_lesson ON public.assignments(lesson_id);
CREATE INDEX idx_assignment_submissions_assignment ON public.assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_user ON public.assignment_submissions(user_id);

-- User Streaks & Notifications
CREATE INDEX idx_user_streaks_user ON public.user_streaks(user_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);

-- =============================================
-- RLS FOR V2 TABLES
-- =============================================

-- Enable RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_space_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_email_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies for V2 (will be enhanced in later migrations)
-- Site Builder
CREATE POLICY "Site config is viewable by all" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Site pages are viewable by all" ON public.site_pages FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage site builder" ON public.site_config FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);
CREATE POLICY "Admins can manage pages" ON public.site_pages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);

-- Community V2
CREATE POLICY "Community members are viewable" ON public.community_space_members FOR SELECT USING (true);
CREATE POLICY "Users can manage own membership" ON public.community_space_members FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Community events are viewable" ON public.community_events FOR SELECT USING (true);
CREATE POLICY "Users can manage own events" ON public.community_events FOR ALL USING (auth.uid() = created_by);

-- Gamification
CREATE POLICY "User points are viewable by owner" ON public.user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Expert profiles are public" ON public.expert_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own profile" ON public.expert_profiles FOR ALL USING (auth.uid() = user_id);

-- Webinars V2
CREATE POLICY "Webinar speakers are viewable" ON public.webinar_speakers FOR SELECT USING (true);
CREATE POLICY "Webinar agenda is viewable" ON public.webinar_agenda FOR SELECT USING (true);
CREATE POLICY "Webinar chat is viewable" ON public.webinar_chat FOR SELECT USING (true);
CREATE POLICY "Users can manage own chat messages" ON public.webinar_chat FOR ALL USING (auth.uid() = user_id);

-- Cohorts
CREATE POLICY "Cohorts are viewable" ON public.cohorts FOR SELECT USING (true);
CREATE POLICY "Users can view own cohort enrollments" ON public.cohort_enrollments FOR SELECT USING (auth.uid() = user_id);

-- Assignments
CREATE POLICY "Assignments are viewable by enrolled students" ON public.assignments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.enrollments WHERE user_id = auth.uid() AND course_id = assignments.course_id)
);
CREATE POLICY "Users can view own submissions" ON public.assignment_submissions FOR SELECT USING (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- TRIGGERS FOR V2
-- =============================================

-- Update updated_at for site_config
CREATE TRIGGER handle_site_config_updated_at BEFORE UPDATE ON public.site_config FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Update updated_at for site_pages
CREATE TRIGGER handle_site_pages_updated_at BEFORE UPDATE ON public.site_pages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Update updated_at for user_streaks
CREATE TRIGGER handle_user_streaks_updated_at BEFORE UPDATE ON public.user_streaks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
