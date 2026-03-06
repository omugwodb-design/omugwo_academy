-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_invites table for invitation system
CREATE TABLE IF NOT EXISTS public.user_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin', 'super_admin')),
    invited_by TEXT, -- Temporarily TEXT to avoid type mismatch, will convert later
    message TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_invites_email ON public.user_invites(email);
CREATE INDEX IF NOT EXISTS idx_user_invites_token ON public.user_invites(token);
CREATE INDEX IF NOT EXISTS idx_user_invites_expires_at ON public.user_invites(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_invites_invited_by ON public.user_invites(invited_by);

-- RLS Policies
ALTER TABLE public.user_invites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see invites they sent
CREATE POLICY "Users can view their own invites" ON public.user_invites
    FOR SELECT USING (auth.uid()::text = invited_by);

-- Policy: Users can insert invites (if they have admin role)
DROP POLICY IF EXISTS "Admins can create invites" ON public.user_invites;
CREATE POLICY "Admins can create invites" ON public.user_invites
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'role') IN ('admin', 'super_admin')
        OR EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Policy: Users can update invites they sent
DROP POLICY IF EXISTS "Users can update their own invites" ON public.user_invites;
CREATE POLICY "Users can update their own invites" ON public.user_invites
    FOR UPDATE USING (auth.uid()::text = invited_by);

-- Policy: Super admins can do everything
DROP POLICY IF EXISTS "Super admins full access to invites" ON public.user_invites;
CREATE POLICY "Super admins full access to invites" ON public.user_invites
    FOR ALL USING (
        (auth.jwt() ->> 'role') = 'super_admin'
        OR EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role = 'super_admin'
        )
    );

-- Function to clean up expired invites
CREATE OR REPLACE FUNCTION cleanup_expired_invites()
RETURNS void AS $$
BEGIN
    DELETE FROM public.user_invites 
    WHERE expires_at < NOW() 
    AND accepted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
