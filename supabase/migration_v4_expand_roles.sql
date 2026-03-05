-- Expand user_role enum to include all roles defined in the RBAC system
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'user_role' AND e.enumlabel = 'moderator') THEN
        ALTER TYPE user_role ADD VALUE 'moderator';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'user_role' AND e.enumlabel = 'community_manager') THEN
        ALTER TYPE user_role ADD VALUE 'community_manager';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'user_role' AND e.enumlabel = 'marketing_admin') THEN
        ALTER TYPE user_role ADD VALUE 'marketing_admin';
    END IF;
END $$;
