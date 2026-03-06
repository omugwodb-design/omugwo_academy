-- Expand admin checks and ensure coupons RLS works even if public.users is not yet synced

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
  );
$$;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Read policy remains for checkout
DROP POLICY IF EXISTS "Authenticated can read active coupons" ON public.coupons;
CREATE POLICY "Authenticated can read active coupons" ON public.coupons
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Admin manage coupons
DROP POLICY IF EXISTS "Admins can insert coupons" ON public.coupons;
CREATE POLICY "Admins can insert coupons" ON public.coupons
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update coupons" ON public.coupons;
CREATE POLICY "Admins can update coupons" ON public.coupons
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete coupons" ON public.coupons;
CREATE POLICY "Admins can delete coupons" ON public.coupons
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

NOTIFY pgrst, 'reload schema';
