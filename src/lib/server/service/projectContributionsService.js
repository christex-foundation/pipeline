//@ts-check
import { getResources, storeResource } from '$lib/server/repo/projectContributionsRepo.js';
import { getMultipleProfiles } from '$lib/server/repo/userProfileRepo.js';

export async function getProjectResource(projectId, supabase) {
  const resources = await getResources(projectId, supabase);

  const userIds = resources.map((resource) => resource.user_id);

  const profiles = await getMultipleProfiles(userIds, supabase);

  const profilesByUserId = profiles.reduce((acc, profile) => {
    acc[profile.user_id] = profile;
    return acc;
  }, {});

  const resourcesWithProfiles = resources.map((resource) => ({
    ...resource,
    user_profile: profilesByUserId[resource.user_id] || null, // Add profile or null if not found
  }));

  return resourcesWithProfiles;
}

export async function storeProjectResource(resourceData, supabase) {
  const res = await storeResource(resourceData, supabase);

  return res;
}
