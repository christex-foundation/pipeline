//@ts-check
import { supabase } from '$lib/server/supabase.js';

/**
 * Uploads a file to the storage bucket.
 *
 * Provider contract:
 * - Input: bucket name, file path within bucket, file data
 * - Output: the raw upload result (provider-specific)
 * - Throws on error
 *
 * To swap to an alternative (e.g. MinIO/S3, local filesystem), reimplement
 * this function to store the file and return a compatible result.
 *
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path within the bucket
 * @param {File|Blob|Buffer} file - File data to upload
 * @returns {Promise<any>} Upload result
 */
export async function uploadFile(bucket, path, file) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Gets the public URL for a file in the storage bucket.
 *
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path within the bucket
 * @returns {string} Public URL
 */
export function getPublicUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Deletes files from the storage bucket.
 *
 * @param {string} bucket - Storage bucket name
 * @param {string[]} paths - Array of file paths to delete
 * @returns {Promise<any>} Deletion result
 */
export async function deleteFiles(bucket, paths) {
  const { data, error } = await supabase.storage.from(bucket).remove(paths);
  if (error) throw new Error(error.message);
  return data;
}
