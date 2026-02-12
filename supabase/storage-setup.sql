-- Run this in Supabase SQL Editor AFTER creating the bucket in Dashboard
-- Step 1: Supabase Dashboard → Storage → New bucket → Name: wedding-images, Public: ON
-- Step 2: Run this SQL to add policies

-- Allow public to view images
DROP POLICY IF EXISTS "Public read wedding-images" ON storage.objects;
CREATE POLICY "Public read wedding-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'wedding-images');

-- Allow authenticated users to upload (Master page uses authenticated session)
DROP POLICY IF EXISTS "Authenticated upload wedding-images" ON storage.objects;
CREATE POLICY "Authenticated upload wedding-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'wedding-images');
