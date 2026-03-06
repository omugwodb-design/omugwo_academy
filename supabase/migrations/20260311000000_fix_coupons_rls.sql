-- Fix coupons RLS for admin create/update/delete

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id::text = auth.uid()::text
      AND u.role IN ('admin', 'super_admin', 'marketing_admin', 'community_manager')
  );
$$;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Ensure read policy exists (checkout needs to validate coupon)
DROP POLICY IF EXISTS "Authenticated can read active coupons" ON public.coupons;
CREATE POLICY "Authenticated can read active coupons" ON public.coupons
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Admin manage coupons (INSERT/UPDATE/DELETE)
DROP POLICY IF EXISTS "Admins can insert coupons" ON public.coupons;
CREATE POLICY "Admins can insert coupons" ON public.coupons
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (
      (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS "Admins can update coupons" ON public.coupons;
CREATE POLICY "Admins can update coupons" ON public.coupons
  FOR UPDATE
  TO authenticated
  USING (
    (
      (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
      OR public.is_admin()
    )
  )
  WITH CHECK (
    (
      (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS "Admins can delete coupons" ON public.coupons;
CREATE POLICY "Admins can delete coupons" ON public.coupons
  FOR DELETE
  TO authenticated
  USING (
    (
      (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
      OR public.is_admin()
    )
  );

NOTIFY pgrst, 'reload schema';
