-- Storage RLS policies for the pipeline-images bucket.
-- Without these, authenticated users cannot upload, update, or delete
-- objects — even though the bucket is "public" (which only affects reads).
--
-- Safe to run multiple times. Drops existing policies first to keep the
-- policy definitions authoritative.

-- ============================================================================
-- 1. Anyone can read objects in pipeline-images (public bucket)
-- ============================================================================
DROP POLICY IF EXISTS "pipeline_images_public_read" ON storage.objects;
CREATE POLICY "pipeline_images_public_read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pipeline-images');

-- ============================================================================
-- 2. Authenticated users can upload to pipeline-images
-- ============================================================================
DROP POLICY IF EXISTS "pipeline_images_authenticated_insert" ON storage.objects;
CREATE POLICY "pipeline_images_authenticated_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pipeline-images');

-- ============================================================================
-- 3. Users can update only objects they own in pipeline-images
-- (storage.objects.owner is populated with auth.uid() on insert)
-- ============================================================================
DROP POLICY IF EXISTS "pipeline_images_owner_update" ON storage.objects;
CREATE POLICY "pipeline_images_owner_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'pipeline-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'pipeline-images' AND owner = auth.uid());

-- ============================================================================
-- 4. Users can delete only objects they own in pipeline-images
-- ============================================================================
DROP POLICY IF EXISTS "pipeline_images_owner_delete" ON storage.objects;
CREATE POLICY "pipeline_images_owner_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'pipeline-images' AND owner = auth.uid());
