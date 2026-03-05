-- 1. Add auth_id column to store the Clerk "user_..." string
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_id TEXT UNIQUE;

-- 2. Relax the ID requirement so we can use internal UUIDs
-- We keep the 'id' column as UUID to avoid breaking foreign keys in other tables.
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- 3. Create an index for fast lookups by Clerk ID
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_id);
