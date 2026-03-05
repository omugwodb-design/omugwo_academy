-- Fix LMS authoring RLS for admin portal (Clerk/JWT role claim fallback)

-- Helper condition: user is admin/super_admin/marketing_admin either via users table or JWT claim
-- NOTE: auth.jwt() requires JWT to include a role claim.

-- courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  );

-- modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;
CREATE POLICY "Admins can manage modules" ON public.modules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  );

-- lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;
CREATE POLICY "Admins can manage lessons" ON public.lessons
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  );

-- quizzes
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;
CREATE POLICY "Admins can manage quizzes" ON public.quizzes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  );

-- quiz_questions
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage quiz questions" ON public.quiz_questions;
CREATE POLICY "Admins can manage quiz questions" ON public.quiz_questions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  );
