import { supabase } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';
import { getUserBookmarkedProjects } from '$lib/server/service/projectService.js';

/**
 * @deprecated
 * Depricating in favour off /api/projects
 * TODO: use builder pattern
 */
export async function GET({ request, url, locals, setHeaders }) {
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '6', 10);
  let user = locals.authUser;
  let supabase = locals.supabase;

  try {
    const projects = await getUserBookmarkedProjects(user.id, page, limit, supabase);

    return json({ projects: projects }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
