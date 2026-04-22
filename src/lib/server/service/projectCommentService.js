//@ts-check
import {
  insertComment,
  listCommentsByProjectId,
} from '$lib/server/repo/projectCommentRepo.js';
import { getMultipleProfiles } from '$lib/server/repo/userProfileRepo.js';

export async function getProjectComments(projectId, supabase) {
  const comments = await listCommentsByProjectId(projectId, supabase);
  if (!comments.length) return [];

  const userIds = [...new Set(comments.map((c) => c.user_id).filter(Boolean))];
  const profiles = userIds.length ? await getMultipleProfiles(userIds, supabase) : [];

  // Only expose the fields needed to render an author chip. Never leak email
  // or other auth.users fields to the client.
  const profilesByUserId = profiles.reduce((acc, p) => {
    acc[p.user_id] = { name: p.name, image: p.image };
    return acc;
  }, {});

  return comments.map((c) => ({
    ...c,
    author: profilesByUserId[c.user_id] || null,
  }));
}

export async function createProjectComment({ projectId, userId, body }, supabase) {
  return insertComment(
    { project_id: projectId, user_id: userId, body },
    supabase,
  );
}
