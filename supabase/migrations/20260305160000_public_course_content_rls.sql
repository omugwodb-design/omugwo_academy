-- Ensure public read access to published course content (catalog + LMS sidebar)

-- Courses are already publicly viewable in the base schema, but keep it explicit
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Courses
DROP POLICY IF EXISTS "Courses are publicly viewable" ON public.courses;
CREATE POLICY "Courses are publicly viewable" ON public.courses
  FOR SELECT
  USING (is_published = true);

-- Modules (only for published courses)
DROP POLICY IF EXISTS "Modules are publicly viewable" ON public.modules;
CREATE POLICY "Modules are publicly viewable" ON public.modules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.courses c
      WHERE c.id = modules.course_id
        AND c.is_published = true
    )
  );

-- Lessons (only for published lessons inside published courses)
DROP POLICY IF EXISTS "Lessons are publicly viewable" ON public.lessons;
CREATE POLICY "Lessons are publicly viewable" ON public.lessons
  FOR SELECT
  USING (
    lessons.is_published = true
    AND EXISTS (
      SELECT 1
      FROM public.modules m
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id
        AND c.is_published = true
    )
  );
