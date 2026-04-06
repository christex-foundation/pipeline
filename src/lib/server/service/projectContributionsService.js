//@ts-check
import {
  getAllContributions,
  getProjectResourcesCount,
  getResources,
  storeResource,
} from '$lib/server/repo/projectContributionsRepo.js';
import { getMultipleProfiles } from '$lib/server/repo/userProfileRepo.js';

export async function getAllProjectContributions(supabase) {
  return getAllContributions(supabase);
}

export async function getProjectResource(projectId, supabase) {
  const resources = await getResources(projectId, supabase);

  return resources;
}

export async function getProjectResources(projectId, supabase) {
  const count = await getProjectResourcesCount(projectId, supabase);

  return count;
}

export async function storeProjectResource(resourceData, supabase) {
  const res = await storeResource(resourceData, supabase);

  return res;
}
