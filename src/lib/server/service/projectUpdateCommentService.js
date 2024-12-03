import { storeComment, getComments } from '../repo/projectUpdateCommentRepo.js';
import { getMultipleProfiles } from '../repo/userProfileRepo.js';

export async function getUpdateComment(id, projectId, supabase) {
  const comments = await getComments(id, projectId, supabase);

  const userIds = comments.map((comment) => comment.user_id);

  const profiles = await getMultipleProfiles(userIds, supabase);

  const profilesByUserId = profiles.reduce((acc, profile) => {
    acc[profile.user_id] = profile;
    return acc;
  }, {});

  const commentsWithProfiles = comments.map((comment) => ({
    ...comment,
    userProfile: profilesByUserId[comment.user_id] || null,
  }));

  return commentsWithProfiles;
}

export async function storeProjectUpdateComment(commentData, supabase) {
  const comment = await storeComment(commentData, supabase);
  return comment;
}
