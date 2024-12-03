import { json } from '@sveltejs/kit';
import { storeProject } from '$lib/server/service/projectService.js';

export async function POST({ request, locals }) {
  let user = locals.authUser;
  let supabase = locals.supabase;

  try {
    const projectData = await request.json();

    await storeProject(user, projectData, supabase);

    return json({ success: true }, { status: 200 });
  } catch (error) {
    return json({ erorr: 'Something went wrong' }, { status: 500 });
  }
}
