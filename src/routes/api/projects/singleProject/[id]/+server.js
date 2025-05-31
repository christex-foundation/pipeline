//@ts-check
import { getProjectById } from '$lib/server/service/projectService.js';
import { json } from '@sveltejs/kit';

export async function GET({ request, params, locals, setHeaders }) {
  const projectId = params.id;
  let supabase = locals.supabase;

  try {
    const project = await getProjectById(projectId, supabase);

    setHeaders({
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=300',
      Vary: 'Accept-Encoding',
    });

    return json({ project: project }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
