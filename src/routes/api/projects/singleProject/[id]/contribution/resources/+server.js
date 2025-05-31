import {
  getProjectResource,
  getProjectResources,
} from '$lib/server/service/projectContributionsService.js';
import { json } from '@sveltejs/kit';

export async function GET({ params, locals, setHeaders }) {
  const { id } = params;
  let supabase = locals.supabase;

  try {
    const totalResources = await getProjectResources(id, supabase);

    setHeaders({
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=300',
      Vary: 'Accept-Encoding',
    });

    return json({ totalResources }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
