-- ================================================================
-- Omugwo System Migration v3 – Role Expansion & Tracker Staff IDs
-- Run this in your Supabase project's SQL Editor
-- ================================================================

-- ──────────────────────────────────────────────────────────────
-- 1. Academy App: Expand the 'user_role' enum to include Academy roles
-- Note: 'ALTER TYPE ... ADD VALUE' cannot be run inside a transaction.
-- Supabase SQL Editor handles this fine usually.
-- ──────────────────────────────────────────────────────────────

-- Standard PG 12+ supports ADD VALUE IF NOT EXISTS.
-- We use DO blocks for maximum safety in Supabase SQL editor.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'user_role' AND e.enumlabel = 'student') THEN
        ALTER TYPE user_role ADD VALUE 'student';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'user_role' AND e.enumlabel = 'instructor') THEN
        ALTER TYPE user_role ADD VALUE 'instructor';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'user_role' AND e.enumlabel = 'admin') THEN
        ALTER TYPE user_role ADD VALUE 'admin';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'user_role' AND e.enumlabel = 'super_admin') THEN
        ALTER TYPE user_role ADD VALUE 'super_admin';
    END IF;
END $$;

-- Drop redundant check constraint if it exists from previous attempts
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- ──────────────────────────────────────────────────────────────
-- 2. Tracker App: Add unique staff_id (OMS-XXXXX) column 
--    to the shared users table
-- ──────────────────────────────────────────────────────────────
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS staff_id TEXT UNIQUE;

-- Function to auto-generate a unique OMS-XXXXX staff ID on INSERT
CREATE OR REPLACE FUNCTION generate_tracker_staff_id()
RETURNS TRIGGER AS $$
DECLARE
  new_id TEXT;
  attempts INT := 0;
BEGIN
  -- Only generate if not already set
  IF NEW.staff_id IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  -- Loop until we get a unique ID (extremely unlikely to collide)
  LOOP
    new_id := 'OMS-' || LPAD(FLOOR(RANDOM() * 89999 + 10000)::TEXT, 5, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM users WHERE staff_id = new_id);
    attempts := attempts + 1;
    IF attempts > 10 THEN
      RAISE EXCEPTION 'Could not generate unique staff_id after 10 attempts';
    END IF;
  END LOOP;
  
  NEW.staff_id := new_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: run before each INSERT on users table
DROP TRIGGER IF EXISTS assign_staff_id ON users;
CREATE TRIGGER assign_staff_id
  BEFORE INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION generate_tracker_staff_id();

-- Backfill staff_ids for existing users that don't have one
UPDATE users
SET staff_id = 'OMS-' || LPAD(FLOOR(RANDOM() * 89999 + 10000)::TEXT, 5, '0')
WHERE staff_id IS NULL;

-- ──────────────────────────────────────────────────────────────
-- 3. (Optional) Academy App: RLS update for super_admin
--    Super admins can do everything admins do, plus manage roles
-- ──────────────────────────────────────────────────────────────

-- Allow admins and super_admins to update user roles
-- Using role::text for safe comparison with enum
DROP POLICY IF EXISTS "admins_can_update_user_roles" ON public.users;
CREATE POLICY "admins_can_update_user_roles" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND (role::text IN ('admin', 'super_admin', 'ADMIN'))
    )
  );

-- How to use these roles:
-- ● student → /dashboard (My Courses, Community, Webinars)
-- ● instructor → /dashboard + course creation tools
-- ● admin → /admin panel (courses, users, payments, site builder)
-- ● super_admin → /admin panel + ability to change user roles

-- ──────────────────────────────────────────────────────────────
-- 4. How to grant backend access to a user (no SQL needed):
--    Update their role in Supabase Table Editor > public.users
--    Change 'student' → 'admin' or 'super_admin'
-- ──────────────────────────────────────────────────────────────
