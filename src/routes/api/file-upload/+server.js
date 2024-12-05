//@ts-check
import { supabase } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';

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

  const { data, error } = await supabase.storage
    .from('pipeline-images')
    .upload(`uploads/${newFileName}`, file);

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  const { data: imgData } = await supabase.storage
    .from('pipeline-images')
    .getPublicUrl(`uploads/${newFileName}`);

  return json({ url: imgData.publicUrl });
}
