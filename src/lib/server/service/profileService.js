import { getProfile, updateProfile } from '$lib/server/repo/userProfileRepo.js';

export async function getProfileByUserId(userId, supabase) {
  return getProfile(userId, supabase);
}

export async function update(user, profileData, supabase) {
  await updateProfile(user.id, profileData, supabase);

  return { success: true };
}
