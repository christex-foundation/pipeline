import { getUpdates, storeProjectUpdate } from "../repo/projectUpdatesRepo";
import { getMultipleProfiles } from "../repo/userProfileRepo";
export async function getProjectUpdates(projectId, supabase) {
  const updates = await getUpdates(projectId, supabase);

  if (!updates) {
    return [];
  }

  const userIds = updates.map((update) => update.user_id);

  const profiles = await getMultipleProfiles(userIds, supabase);

  const profilesByUserId = profiles.reduce((acc, profile) => {
    acc[profile.user_id] = profile;
    return acc;
  }, {});

  // Attach the corresponding profile to each project update
  const projectUpdatesWithProfiles = updates.map((update) => ({
    ...update,
    userProfile: profilesByUserId[update.user_id] || null,
  }));

  return projectUpdatesWithProfiles;
}

export async function createProjectUpdate(projectUpdateData, supabase) {
  
    await storeProjectUpdate(projectUpdateData, supabase);
    return { success: true };
}