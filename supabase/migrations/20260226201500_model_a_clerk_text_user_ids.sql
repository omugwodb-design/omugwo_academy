-- Model A: Clerk user id is the primary key (TEXT)


-- Drop ALL policies on tables whose columns we will alter, to avoid repeated 0A000 errors.
DO $$
DECLARE
  rec record;
BEGIN
  FOR rec IN
    SELECT quote_ident(schemaname) AS sch, quote_ident(tablename) AS tbl, quote_ident(policyname) AS pol
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'users',
        'courses',
        'modules',
        'lessons',
        'quizzes',
        'quiz_questions',
        'site_pages',
        'site_page_versions',
        'webinars',
        'community_spaces',
        'blog_posts',
        'site_config',
        'enrollments',
        'lesson_progress',
        'quiz_responses',
        'user_notes',
        'certificates',
        'user_badges',
        'community_posts',
        'community_comments',
        'post_likes',
        'webinar_registrations',
        'payments',
        'community_space_members',
        'community_reports',
        'community_events',
        'community_event_rsvps',
        'user_points',
        'expert_profiles',
        'webinar_speakers',
        'webinar_agenda',
        'webinar_polls',
        'webinar_poll_votes',
        'webinar_chat',
        'webinar_email_reminders',
        'cohorts',
        'cohort_enrollments',
        'cohort_schedule',
        'cohort_live_sessions',
        'assignments',
        'assignment_submissions',
        'user_streaks',
        'notifications'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %s ON %s.%s', rec.pol, rec.sch, rec.tbl);
  END LOOP;
END $$;

DO $$
DECLARE
  c record;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = '_tmp_user_fks'
  ) THEN
    CREATE TABLE public._tmp_user_fks (
      id bigserial PRIMARY KEY,
      tbl regclass NOT NULL,
      conname text NOT NULL,
      condef text NOT NULL,
      colnames text[] NULL,
      conkey_len int NOT NULL
    );
  ELSE
    -- Backward compatible with earlier drafts of this migration
    ALTER TABLE public._tmp_user_fks ADD COLUMN IF NOT EXISTS colnames text[];
  END IF;

  TRUNCATE public._tmp_user_fks;

  INSERT INTO public._tmp_user_fks (tbl, conname, condef, colnames, conkey_len)
  SELECT
    pc.conrelid::regclass AS tbl,
    pc.conname,
    pg_get_constraintdef(pc.oid) AS condef,
    (
      SELECT array_agg(a2.attname ORDER BY u.ord)
      FROM unnest(pc.conkey) WITH ORDINALITY AS u(attnum, ord)
      JOIN pg_attribute a2
        ON a2.attrelid = pc.conrelid
       AND a2.attnum = u.attnum
    ) AS colnames,
    COALESCE(array_length(pc.conkey, 1), 0) AS conkey_len
  FROM pg_constraint pc
  WHERE pc.contype = 'f'
    AND pc.confrelid = 'public.users'::regclass;

  -- Drop all foreign keys that reference public.users(id)
  FOR c IN
    SELECT tbl, conname
    FROM public._tmp_user_fks
  LOOP
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT IF EXISTS %I', c.tbl, c.conname);
  END LOOP;
END $$;

-- Detach public.users from auth.users (Model A uses Clerk ids and does not use Supabase Auth)
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Convert referencing columns (all FK columns that pointed at public.users)
DO $$
DECLARE
  r record;
  c text;
BEGIN
  FOR r IN
    SELECT tbl, colnames
    FROM public._tmp_user_fks
    WHERE colnames IS NOT NULL
  LOOP
    FOREACH c IN ARRAY r.colnames
    LOOP
      EXECUTE format(
        'ALTER TABLE %s ALTER COLUMN %I TYPE text USING %I::text',
        r.tbl,
        c,
        c
      );
    END LOOP;
  END LOOP;
END $$;

-- Convert users.id to text and detach from auth.users
ALTER TABLE public.users ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;

-- Ensure role is always valid on new inserts
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'student';

-- Ensure status has a reasonable default if the column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'status'
  ) THEN
    EXECUTE 'ALTER TABLE public.users ALTER COLUMN status SET DEFAULT ''ACTIVE''';
  END IF;
END $$;

-- Re-apply role constraint to avoid 23514 surprises
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check
CHECK (role IN ('student','instructor','admin','super_admin','marketing_admin','moderator','community_manager'));

-- Recreate foreign keys
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT tbl, conname, condef
    FROM public._tmp_user_fks
  LOOP
    EXECUTE format('ALTER TABLE %s ADD CONSTRAINT %I %s', r.tbl, r.conname, r.condef);
  END LOOP;
END $$;

-- Recreate essential RLS policies (admin/public) after type changes
-- Admin roles are determined via public.users (id = auth.uid()) role in ('admin','super_admin','marketing_admin')
DO $$
BEGIN
  -- site_pages
  DROP POLICY IF EXISTS "Admins can manage site pages" ON public.site_pages;
  CREATE POLICY "Admins can manage site pages" ON public.site_pages
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    ) WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    );

  DROP POLICY IF EXISTS "Public can view published site_pages" ON public.site_pages;
  CREATE POLICY "Public can view published site_pages" ON public.site_pages
    FOR SELECT USING (status = 'PUBLISHED');

  -- site_page_versions
  DROP POLICY IF EXISTS "Admins can manage site_page_versions" ON public.site_page_versions;
  CREATE POLICY "Admins can manage site_page_versions" ON public.site_page_versions
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    ) WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    );

  -- webinars
  DROP POLICY IF EXISTS "Admins can manage webinars" ON public.webinars;
  CREATE POLICY "Admins can manage webinars" ON public.webinars
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    ) WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    );

  -- community_spaces
  DROP POLICY IF EXISTS "Admins can manage community_spaces" ON public.community_spaces;
  CREATE POLICY "Admins can manage community_spaces" ON public.community_spaces
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    ) WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    );

  -- blog_posts
  DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
  CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    ) WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    );

  -- site_config
  DROP POLICY IF EXISTS "Admins can manage site_config" ON public.site_config;
  CREATE POLICY "Admins can manage site_config" ON public.site_config
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    ) WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    );

  -- courses (authoring/admin)
  DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
  CREATE POLICY "Admins can manage courses" ON public.courses
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    ) WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    );

  -- lessons (authoring/admin)
  DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;
  CREATE POLICY "Admins can manage lessons" ON public.lessons
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    ) WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    );

  -- quizzes (authoring/admin)
  DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;
  CREATE POLICY "Admins can manage quizzes" ON public.quizzes
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    ) WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    );

  -- quiz_questions (authoring/admin)
  DROP POLICY IF EXISTS "Admins can manage quiz questions" ON public.quiz_questions;
  CREATE POLICY "Admins can manage quiz questions" ON public.quiz_questions
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    ) WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid()::text
          AND u.role IN ('admin','super_admin','marketing_admin')
      )
    );
END $$;

-- RLS for users (own row)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own row" ON public.users;
CREATE POLICY "Users can select own row" ON public.users
  FOR SELECT
  USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can insert own row" ON public.users;
CREATE POLICY "Users can insert own row" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can update own row" ON public.users;
CREATE POLICY "Users can update own row" ON public.users
  FOR UPDATE
  USING (auth.uid()::text = id);

NOTIFY pgrst, 'reload schema';
