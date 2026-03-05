-- Run this in Supabase SQL Editor to fix the "super_admin does not exist" error
-- This creates a dummy database role so Postgres doesn't complain if a query tries to reference it.
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'super_admin') THEN
    CREATE ROLE super_admin;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
    CREATE ROLE admin;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'marketing_admin') THEN
    CREATE ROLE marketing_admin;
  END IF;
END $$;
