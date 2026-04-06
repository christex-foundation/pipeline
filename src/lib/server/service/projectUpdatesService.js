//@ts-check
import {
  getAllUpdates,
  getUpdates,
  storeProjectUpdate,
} from '$lib/server/repo/projectUpdatesRepo.js';
import { getMultipleProfiles } from '$lib/server/repo/userProfileRepo.js';

export async function getAllProjectUpdates(supabase) {
  return getAllUpdates(supabase);
}

export async function getProjectUpdates(projectId, supabase) {
  const updates = await getUpdates(projectId, supabase);

  if (!updates) {
    return [];
  }

  //seperated the updates where the user_id is not null
  const updatesWithUserId = updates.filter((update) => update.user_id !== null);
  const updatesWithInlineUser = updates.filter((update) => update.user !== null);

  const userIds = updatesWithUserId.map((update) => update.user_id);

  // Fetch profiles for valid user_ids
  const profiles = userIds.length > 0 ? await getMultipleProfiles(userIds, supabase) : [];
  const profilesByUserId = profiles.reduce((acc, profile) => {
    acc[profile.user_id] = profile;
    return acc;
  }, {});

  const projectUpdatesWithProfiles = updates.map((update) => {
    if (update.user) {
      // Use inline user object directly
      return {
        ...update,
        userProfile: update.user,
      };
    } else if (update.user_id && profilesByUserId[update.user_id]) {
      // Use fetched profile for updates with user_id
      return {
        ...update,
        userProfile: profilesByUserId[update.user_id],
      };
    } else {
      // No user information available
      return {
        ...update,
        userProfile: null,
      };
    }
  });

  return projectUpdatesWithProfiles;
}

export async function createProjectUpdate(projectUpdateData, supabase) {
  await storeProjectUpdate(projectUpdateData, supabase);
  return { success: true };
}
