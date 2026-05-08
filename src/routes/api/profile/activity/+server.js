import { json } from '@sveltejs/kit';
import { getUserRecentActivity } from '$lib/server/service/activityService.js';

export async function GET({ url, locals }) {
  const user = locals.authUser;
  const supabase = locals.supabase;

  const limitParam = parseInt(url.searchParams.get('limit') || '20', 10);
  const limit = Math.min(Math.max(limitParam, 1), 50);

  try {
    const activities = await getUserRecentActivity(user.id, limit, supabase);
    return json({ activities });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
