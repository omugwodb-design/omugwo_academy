-- Admin RLS policies for community spaces and webinars

-- COMMUNITY SPACES
ALTER TABLE public.community_spaces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read community spaces" ON public.community_spaces;
CREATE POLICY "Public can read community spaces" ON public.community_spaces
  FOR SELECT
  USING (visibility = 'public' OR visibility IS NULL);

DROP POLICY IF EXISTS "Admins can manage community spaces" ON public.community_spaces;
CREATE POLICY "Admins can manage community spaces" ON public.community_spaces
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'community_manager')
    OR public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id::text = auth.uid()::text
        AND u.role IN ('admin', 'super_admin', 'community_manager')
    )
  )
  WITH CHECK (
    (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'community_manager')
    OR public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id::text = auth.uid()::text
        AND u.role IN ('admin', 'super_admin', 'community_manager')
    )
  );

-- WEBINARS
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read webinars" ON public.webinars;
CREATE POLICY "Public can read webinars" ON public.webinars
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage webinars" ON public.webinars;
CREATE POLICY "Admins can manage webinars" ON public.webinars
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
    OR public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id::text = auth.uid()::text
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
  )
  WITH CHECK (
    (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
    OR public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id::text = auth.uid()::text
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
  );

NOTIFY pgrst, 'reload schema';
