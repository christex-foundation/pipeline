import { supabase } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';
import { storeProject } from '$lib/server/service/projectService.js';

export async function POST({ request, locals }) {
  let user = locals.authUser.user;

  try {
    const projectData = await request.json();

    await storeProject(user, projectData);

    return json({ success: true }, { status: 200 });
  } catch (error) {
    return json({ erorr: 'Something went wrong' }, { status: 500 });
  }
}
