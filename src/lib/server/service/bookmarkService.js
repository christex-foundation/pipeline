//@ts-check
import { getExistingBookmarks, addBookmark, deleteBookmark } from '$lib/server/repo/bookmarkRepo.js';

export async function bookmarkProject(projectId, userId, supabase) {
  const existingBookmarks = await getExistingBookmarks(projectId, userId, supabase);

  if (existingBookmarks === null) {
    return await addBookmark(projectId, userId, supabase);
  } else {
    return await deleteBookmark(projectId, userId, supabase);
  }
}
