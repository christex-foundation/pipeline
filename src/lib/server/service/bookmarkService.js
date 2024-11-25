import { getExistingBookmarks, addBookmark, deleteBookmark } from '../repo/bookmarkRepo.js';

export async function bookmarkProject(projectId, userId) {
  const existingBookmarks = await getExistingBookmarks(projectId, userId);

  if (existingBookmarks === null) {
    return await addBookmark(projectId, userId);
  } else {
    return await deleteBookmark(projectId, userId);
  }
}
