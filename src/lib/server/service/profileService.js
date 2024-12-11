import { updateProfile } from '$lib/server/repo/userProfileRepo.js';

export async function update(user, profileData, supabase) {
  await updateProfile(user.id, profileData, supabase);

  return { success: true };
}
