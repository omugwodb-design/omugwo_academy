-- Leads RLS Policies
-- Allows public newsletter subscriptions while keeping admin management secure

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anon) to create a lead via newsletter forms.
-- Restrict what can be inserted for safety.
DROP POLICY IF EXISTS "Public can create leads" ON public.leads;
CREATE POLICY "Public can create leads" ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND status = 'new'
    AND converted_user_id IS NULL
  );

-- Allow admins / marketing to view all leads
DROP POLICY IF EXISTS "Admins can read leads" ON public.leads;
CREATE POLICY "Admins can read leads" ON public.leads
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()::text
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
  );

-- Allow admins / marketing to update leads (status, etc.)
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
CREATE POLICY "Admins can update leads" ON public.leads
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()::text
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
  )
  WITH CHECK (
    (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()::text
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
  );
