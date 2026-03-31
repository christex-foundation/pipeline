//@ts-check
import { json } from '@sveltejs/kit';
import { uploadFile, getPublicUrl } from '$lib/server/providers/storageProvider.js';

const BUCKET = 'pipeline-images';

export async function POST({ request }) {
  const formData = await request.formData();

  const file = formData.get('file');

  if (!file) {
    return json({ error: 'No file provided' }, { status: 400 });
  }

  //append current timestamp to the file name
  const timestamp = Date.now();
  const originalFileName = file.name;
  const fileExtension = originalFileName.split('.').pop();
  const fileNameWithoutExtension =
    originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
  const newFileName = `${fileNameWithoutExtension}-${timestamp}.${fileExtension}`;
  const path = `uploads/${newFileName}`;

  try {
    await uploadFile(BUCKET, path, file);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }

  const publicUrl = getPublicUrl(BUCKET, path);

  return json({ url: publicUrl });
}
