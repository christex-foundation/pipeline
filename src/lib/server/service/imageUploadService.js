//@ts-check
import { uploadImage, deleteImage } from '../repo/imageUploadRepo.js';

export async function uploadImageAndReturnUrl(file) {
  const url = await uploadImage(file);
  return url;
}

export async function removeImage(url) {
  if (!url) {
    console.error('No URL provided for removeImage');
    return;
  }

  try {
    const fileName = new URL(url).pathname.split('/uploads/')[1];

    if (!fileName) {
      console.error('Failed to extract file name from URL:', url);
      return;
    }

    await deleteImage(fileName);
  } catch (error) {
    console.error('Error in removeImage:', error);
  }
}
