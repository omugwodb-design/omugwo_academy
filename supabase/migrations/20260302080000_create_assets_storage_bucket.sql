-- Create the assets storage bucket used by MediaUpload and allow basic access

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- RLS policies for storage.objects
-- Public read for assets
DROP POLICY IF EXISTS "Public can read assets" ON storage.objects;
CREATE POLICY "Public can read assets" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'assets');

-- Authenticated users can upload assets
DROP POLICY IF EXISTS "Authenticated can upload assets" ON storage.objects;
CREATE POLICY "Authenticated can upload assets" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Authenticated users can update/delete their uploads
-- (owner is set by Supabase to auth.uid())
DROP POLICY IF EXISTS "Authenticated can update own assets" ON storage.objects;
CREATE POLICY "Authenticated can update own assets" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'assets' AND auth.uid() = owner)
  WITH CHECK (bucket_id = 'assets' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Authenticated can delete own assets" ON storage.objects;
CREATE POLICY "Authenticated can delete own assets" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'assets' AND auth.uid() = owner);
