-- Allow instructors/admins to view course content in preview (including unpublished courses)

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Courses: instructors can read their own courses (even if unpublished); admins can read all
DROP POLICY IF EXISTS "Instructors can view own courses (preview)" ON public.courses;
CREATE POLICY "Instructors can view own courses (preview)" ON public.courses
  FOR SELECT
  TO authenticated
  USING (
    courses.instructor_id::text = auth.uid()::text
    OR courses.instructor_id::text IN (
      SELECT u.id
      FROM public.users u
      WHERE u.auth_id::uuid = auth.uid()
    )
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()::text
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  );

-- Modules: instructors can read modules for courses they own; admins can read all
DROP POLICY IF EXISTS "Instructors can view own course modules" ON public.modules;
CREATE POLICY "Instructors can view own course modules" ON public.modules
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.courses c
      WHERE c.id = modules.course_id
        AND (
          c.instructor_id::text = auth.uid()::text
          OR c.instructor_id::text IN (
            SELECT u.id
            FROM public.users u
            WHERE u.auth_id::uuid = auth.uid()
          )
        )
    )
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()::text
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  );

-- Lessons: instructors can read lessons for courses they own (via module->course); admins can read all
DROP POLICY IF EXISTS "Instructors can view own course lessons" ON public.lessons;
CREATE POLICY "Instructors can view own course lessons" ON public.lessons
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.modules m
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id
        AND (
          c.instructor_id::text = auth.uid()::text
          OR c.instructor_id::text IN (
            SELECT u.id
            FROM public.users u
            WHERE u.auth_id::uuid = auth.uid()
          )
        )
    )
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()::text
        AND u.role IN ('admin', 'super_admin', 'marketing_admin')
    )
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin', 'marketing_admin')
  );
