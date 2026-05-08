//@ts-check
import { getUserActivity } from '$lib/server/repo/activityRepo.js';

export async function getUserRecentActivity(userId, limit = 20, supabase) {
  return getUserActivity(userId, limit, supabase);
}
