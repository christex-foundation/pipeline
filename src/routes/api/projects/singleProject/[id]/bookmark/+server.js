import { bookmarkProject } from '$lib/server/service/bookmarkService.js';
import { json } from '@sveltejs/kit';

export async function POST({ params, request, locals }) {
  const { id: projectId } = params;
  let user = locals.authUser;
  let supabase = locals.supabase;

  try {
    const response = await bookmarkProject(projectId, user.id, supabase);

    return json(response, { status: 200 });
  } catch (error) {
    return json({ erorr: error }, { status: 500 });
  }
}
