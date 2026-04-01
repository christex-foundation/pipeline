import { json } from '@sveltejs/kit';
import { uploadFile, getPublicUrl, deleteFiles } from '$lib/server/providers/storageProvider.js';

const BUCKET = 'pipeline-images';

export async function uploadImage(file, supabase) {
  const timestamp = Date.now();
  const originalFileName = file.name;
  const fileExtension = originalFileName.split('.').pop();
  const fileNameWithoutExtension =
    originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
  const newFileName = `${fileNameWithoutExtension}-${timestamp}.${fileExtension}`;
  const path = `uploads/${newFileName}`;

  try {
    await uploadFile(BUCKET, path, file, supabase);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return getPublicUrl(BUCKET, path, supabase);
}

export async function deleteImage(fileName, supabase) {
  return deleteFiles(BUCKET, [`uploads/${fileName}`], supabase);
}
