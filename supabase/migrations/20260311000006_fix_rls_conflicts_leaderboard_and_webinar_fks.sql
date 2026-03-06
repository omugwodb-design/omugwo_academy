-- Fix conflicting RLS policies (older permissive policies overriding membership gating),
-- make admin checks resilient, allow leaderboard reads, and stop brittle webinar FKs.

-- 1) Make admin checks resilient even when public.users isn't synced
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (
    (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin', 'community_manager')
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'marketing_admin', 'community_manager')
    OR (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin', 'marketing_admin', 'community_manager')
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id::text = auth.uid()::text
        AND u.role IN ('admin', 'super_admin', 'marketing_admin', 'community_manager')
    )
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id::text = auth.uid()::text
        AND p.role IN ('admin', 'super_admin', 'marketing_admin', 'community_manager')
    )
  );
$$;

-- Keep community admin helper aligned
CREATE OR REPLACE FUNCTION public.is_community_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.is_admin();
$$;

-- 2) Drop older permissive / conflicting community policies
DROP POLICY IF EXISTS "Public can read community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Authenticated can manage own posts" ON public.community_posts;
DROP POLICY IF EXISTS "Community posts are viewable" ON public.community_posts;
DROP POLICY IF EXISTS "Users can manage own posts" ON public.community_posts;

DROP POLICY IF EXISTS "Public can read community comments" ON public.community_comments;
DROP POLICY IF EXISTS "Authenticated can manage own comments" ON public.community_comments;

DROP POLICY IF EXISTS "Public can read community events" ON public.community_events;

-- 3) Leaderboard: allow authenticated users to read points (top-N)
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own points" ON public.user_points;
DROP POLICY IF EXISTS "Authenticated can read leaderboard points" ON public.user_points;
CREATE POLICY "Authenticated can read leaderboard points" ON public.user_points
  FOR SELECT
  TO authenticated
  USING (true);

-- 4) Webinars: remove brittle FKs to public.users that fail when users table isn't populated
ALTER TABLE public.webinars DROP CONSTRAINT IF EXISTS webinars_host_fkey;
ALTER TABLE public.webinars DROP CONSTRAINT IF EXISTS webinars_created_by_fkey;

NOTIFY pgrst, 'reload schema';
