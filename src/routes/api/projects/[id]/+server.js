import { json } from '@sveltejs/kit';
import { updateProject } from '$lib/server/service/projectService.js';

export async function PUT({ request, params, locals }) {
  const projectId = params.id;
  let user = locals.authUser;
  let supabase = locals.supabase;

  try {
    const projectData = await request.json();
  
    await updateProject(user.id, projectId, projectData, supabase);

    return json({ success: true }, { status: 200 });
  } catch (error) {
    return json({ error }, { status: 500 });
  }
}
