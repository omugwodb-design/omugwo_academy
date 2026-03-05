-- ================================================================
-- Supabase Native Auth Migration (v4 - Fix Type Casting)
-- ================================================================

-- 1. DROP ALL DEPENDENT POLICIES FIRST
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN (
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename IN (
            'users', 'site_pages', 'site_page_versions', 'webinars',
            'community_spaces', 'blog_posts', 'site_config', 'app_settings',
            'courses', 'lessons', 'modules', 'quizzes', 'quiz_questions'
          )
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 2. RE-ESTABLISH users.id AS UUID LINKED TO auth.users
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_pkey CASCADE;
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check CASCADE;
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey CASCADE;
ALTER TABLE public.users DROP COLUMN IF EXISTS auth_id CASCADE;

-- Convert ID to UUID (with explicit text casting for regex check)
ALTER TABLE public.users ALTER COLUMN id TYPE uuid USING 
  CASE 
    WHEN id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN id::uuid 
    ELSE gen_random_uuid() 
  END;

ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.users ADD PRIMARY KEY (id);

-- Add FK with validation attempt
ALTER TABLE public.users
  ADD CONSTRAINT users_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
  NOT VALID;

-- 3. ENSURE COLUMNS AND CONSTRAINTS
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'student';

-- Ensure role constraint exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_role_check') THEN
        ALTER TABLE public.users ADD CONSTRAINT users_role_check
        CHECK (role::text IN ('student','instructor','admin','super_admin','marketing_admin','moderator','community_manager'));
    END IF;
END $$;

-- 4. FUNCTION TO CHECK ADMIN STATUS WITHOUT RECURSION
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin', 'marketing_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RECREATE THE PROFILE SYNC TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    'student'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. RESTORE POLICIES USING is_admin()
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage themselves" ON public.users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admins can manage all users" ON public.users FOR ALL USING (public.is_admin());
CREATE POLICY "Public can view instructor profiles" ON public.users FOR SELECT USING (role IN ('instructor', 'admin', 'super_admin'));

-- 7. RESTORE ADMIN POLICIES FOR ALL MAJOR TABLES
DO $$
DECLARE
    tbl text;
    tables_to_fix text[] := ARRAY['site_config', 'site_pages', 'site_page_versions', 'blog_posts', 'webinars', 'courses', 'lessons', 'modules', 'quizzes', 'quiz_questions'];
BEGIN
    FOREACH tbl IN ARRAY tables_to_fix
    LOOP
        IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = tbl) THEN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
            EXECUTE format('DROP POLICY IF EXISTS "Admins can manage %s" ON public.%I', tbl, tbl);
            EXECUTE format(
                'CREATE POLICY "Admins can manage %s" ON public.%I FOR ALL
                 USING (public.is_admin())
                 WITH CHECK (public.is_admin())',
                tbl, tbl
            );
            
            IF tbl IN ('courses', 'lessons', 'modules', 'blog_posts', 'webinars') THEN
                EXECUTE format('DROP POLICY IF EXISTS "Public can view %s" ON public.%I', tbl, tbl);
                EXECUTE format('CREATE POLICY "Public can view %s" ON public.%I FOR SELECT USING (true)', tbl, tbl);
            END IF;
        END IF;
    END LOOP;
END $$;

-- 8. FIX FOREIGN KEY RELATIONSHIP BETWEEN COURSES AND USERS
ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_instructor_id_fkey;
ALTER TABLE public.courses 
  ALTER COLUMN instructor_id TYPE uuid USING 
  CASE 
    WHEN instructor_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN instructor_id::uuid 
    ELSE NULL
  END;

ALTER TABLE public.courses
  ADD CONSTRAINT courses_instructor_id_fkey
  FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- 9. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
