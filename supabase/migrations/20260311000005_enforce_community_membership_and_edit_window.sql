-- Enforce community membership access, remove anonymous posting, and limit edit window

-- Helper: treat admins as global moderators
CREATE OR REPLACE FUNCTION public.is_community_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.is_admin();
$$;

-- Helper: determine if current user is a member of a space
CREATE OR REPLACE FUNCTION public.is_space_member(space_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (
    public.is_community_admin()
    OR EXISTS (
      SELECT 1
      FROM public.community_space_members m
      WHERE m.space_id = space_uuid
        AND m.user_id::text = auth.uid()::text
    )
  );
$$;

-- Helper: determine if a space is readable for the current user
CREATE OR REPLACE FUNCTION public.can_read_space(space_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (
    public.is_community_admin()
    OR EXISTS (
      SELECT 1
      FROM public.community_spaces s
      WHERE s.id = space_uuid
        AND (s.visibility = 'public' OR s.visibility IS NULL)
    )
    OR public.is_space_member(space_uuid)
  );
$$;

-- Helper: edit window (5 minutes)
CREATE OR REPLACE FUNCTION public.within_community_edit_window(created_at timestamptz)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (now() <= created_at + interval '5 minutes');
$$;

-- =====================================================================
-- DATA NORMALIZATION
-- =====================================================================

-- Remove anonymous posts (backfill existing)
UPDATE public.community_posts
SET is_anonymous = false
WHERE is_anonymous IS TRUE;

-- Enforce anonymous disabled going forward
ALTER TABLE public.community_posts
  DROP CONSTRAINT IF EXISTS community_posts_no_anonymous;
ALTER TABLE public.community_posts
  ADD CONSTRAINT community_posts_no_anonymous CHECK (is_anonymous = false);

-- =====================================================================
-- RLS: enable + policies
-- =====================================================================

ALTER TABLE public.community_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_space_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_event_rsvps ENABLE ROW LEVEL SECURITY;

-- Remove older policies that could conflict / bypass membership gating
DROP POLICY IF EXISTS "Public can read community spaces" ON public.community_spaces;
DROP POLICY IF EXISTS "Admins can manage community spaces" ON public.community_spaces;
DROP POLICY IF EXISTS "Community posts are viewable" ON public.community_posts;

-- COMMUNITY SPACES
DROP POLICY IF EXISTS "Read community spaces" ON public.community_spaces;
CREATE POLICY "Read community spaces" ON public.community_spaces
  FOR SELECT
  TO authenticated
  USING (public.can_read_space(id));

DROP POLICY IF EXISTS "Admins manage community spaces" ON public.community_spaces;
CREATE POLICY "Admins manage community spaces" ON public.community_spaces
  FOR ALL
  TO authenticated
  USING (public.is_community_admin())
  WITH CHECK (public.is_community_admin());

-- SPACE MEMBERSHIP
DROP POLICY IF EXISTS "Read space members" ON public.community_space_members;
CREATE POLICY "Read space members" ON public.community_space_members
  FOR SELECT
  TO authenticated
  USING (public.can_read_space(space_id));

DROP POLICY IF EXISTS "Join public spaces" ON public.community_space_members;
CREATE POLICY "Join public spaces" ON public.community_space_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id::text = auth.uid()::text
    AND EXISTS (
      SELECT 1
      FROM public.community_spaces s
      WHERE s.id = space_id
        AND (s.visibility = 'public' OR s.visibility IS NULL)
    )
  );

DROP POLICY IF EXISTS "Leave spaces" ON public.community_space_members;
CREATE POLICY "Leave spaces" ON public.community_space_members
  FOR DELETE
  TO authenticated
  USING (
    user_id::text = auth.uid()::text
    OR public.is_community_admin()
  );

DROP POLICY IF EXISTS "Admins manage space members" ON public.community_space_members;
CREATE POLICY "Admins manage space members" ON public.community_space_members
  FOR ALL
  TO authenticated
  USING (public.is_community_admin())
  WITH CHECK (public.is_community_admin());

-- POSTS
DROP POLICY IF EXISTS "Read community posts" ON public.community_posts;
CREATE POLICY "Read community posts" ON public.community_posts
  FOR SELECT
  TO authenticated
  USING (
    public.can_read_space(space_id)
    AND (is_hidden IS NOT TRUE)
  );

DROP POLICY IF EXISTS "Create community posts" ON public.community_posts;
CREATE POLICY "Create community posts" ON public.community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id::text = auth.uid()::text
    AND public.is_space_member(space_id)
  );

DROP POLICY IF EXISTS "Update own post (5 min) or admin" ON public.community_posts;
CREATE POLICY "Update own post (5 min) or admin" ON public.community_posts
  FOR UPDATE
  TO authenticated
  USING (
    public.is_community_admin()
    OR (
      user_id::text = auth.uid()::text
      AND public.within_community_edit_window(created_at)
    )
  )
  WITH CHECK (
    public.is_community_admin()
    OR (
      user_id::text = auth.uid()::text
      AND public.within_community_edit_window(created_at)
    )
  );

DROP POLICY IF EXISTS "Delete own post (5 min) or admin" ON public.community_posts;
CREATE POLICY "Delete own post (5 min) or admin" ON public.community_posts
  FOR DELETE
  TO authenticated
  USING (
    public.is_community_admin()
    OR (
      user_id::text = auth.uid()::text
      AND public.within_community_edit_window(created_at)
    )
  );

-- COMMENTS
DROP POLICY IF EXISTS "Read comments" ON public.community_comments;
CREATE POLICY "Read comments" ON public.community_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.community_posts p
      WHERE p.id = post_id
        AND public.can_read_space(p.space_id)
        AND (p.is_hidden IS NOT TRUE)
    )
  );

DROP POLICY IF EXISTS "Create comments" ON public.community_comments;
CREATE POLICY "Create comments" ON public.community_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id::text = auth.uid()::text
    AND EXISTS (
      SELECT 1
      FROM public.community_posts p
      WHERE p.id = post_id
        AND public.is_space_member(p.space_id)
        AND (p.is_hidden IS NOT TRUE)
    )
  );

DROP POLICY IF EXISTS "Update own comment (5 min) or admin" ON public.community_comments;
CREATE POLICY "Update own comment (5 min) or admin" ON public.community_comments
  FOR UPDATE
  TO authenticated
  USING (
    public.is_community_admin()
    OR (
      user_id::text = auth.uid()::text
      AND public.within_community_edit_window(created_at)
    )
  )
  WITH CHECK (
    public.is_community_admin()
    OR (
      user_id::text = auth.uid()::text
      AND public.within_community_edit_window(created_at)
    )
  );

DROP POLICY IF EXISTS "Delete own comment (5 min) or admin" ON public.community_comments;
CREATE POLICY "Delete own comment (5 min) or admin" ON public.community_comments
  FOR DELETE
  TO authenticated
  USING (
    public.is_community_admin()
    OR (
      user_id::text = auth.uid()::text
      AND public.within_community_edit_window(created_at)
    )
  );

-- LIKES
DROP POLICY IF EXISTS "Read likes" ON public.community_likes;
CREATE POLICY "Read likes" ON public.community_likes
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Write likes" ON public.community_likes;
CREATE POLICY "Write likes" ON public.community_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Delete own likes" ON public.community_likes;
CREATE POLICY "Delete own likes" ON public.community_likes
  FOR DELETE
  TO authenticated
  USING (user_id::text = auth.uid()::text);

-- REPORTS (members can report, admins can resolve)
DROP POLICY IF EXISTS "Create reports" ON public.community_reports;
CREATE POLICY "Create reports" ON public.community_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Read reports (admin)" ON public.community_reports;
CREATE POLICY "Read reports (admin)" ON public.community_reports
  FOR SELECT
  TO authenticated
  USING (public.is_community_admin());

DROP POLICY IF EXISTS "Resolve reports (admin)" ON public.community_reports;
CREATE POLICY "Resolve reports (admin)" ON public.community_reports
  FOR UPDATE
  TO authenticated
  USING (public.is_community_admin())
  WITH CHECK (public.is_community_admin());

-- EVENTS
DROP POLICY IF EXISTS "Read events" ON public.community_events;
CREATE POLICY "Read events" ON public.community_events
  FOR SELECT
  TO authenticated
  USING (public.can_read_space(space_id));

DROP POLICY IF EXISTS "Manage events (admin)" ON public.community_events;
CREATE POLICY "Manage events (admin)" ON public.community_events
  FOR ALL
  TO authenticated
  USING (public.is_community_admin())
  WITH CHECK (public.is_community_admin());

-- RSVP
DROP POLICY IF EXISTS "Read rsvps" ON public.community_event_rsvps;
CREATE POLICY "Read rsvps" ON public.community_event_rsvps
  FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text OR public.is_community_admin());

DROP POLICY IF EXISTS "Write rsvps" ON public.community_event_rsvps;
CREATE POLICY "Write rsvps" ON public.community_event_rsvps
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id::text = auth.uid()::text
    AND EXISTS (
      SELECT 1
      FROM public.community_events e
      WHERE e.id = event_id
        AND public.is_space_member(e.space_id)
    )
  );

DROP POLICY IF EXISTS "Delete own rsvps" ON public.community_event_rsvps;
CREATE POLICY "Delete own rsvps" ON public.community_event_rsvps
  FOR DELETE
  TO authenticated
  USING (user_id::text = auth.uid()::text);

NOTIFY pgrst, 'reload schema';
