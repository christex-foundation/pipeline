import { supabase } from '$lib/server/supabase.js';
import { getProjectsByCategory } from '$lib/server/service/projectService.js';
import { json } from '@sveltejs/kit';

export async function GET({ url, params, locals }) {
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '6', 10);
  const categoryId = params.id;
  let supabase = locals.supabase;

  try {
    const projects = await getProjectsByCategory(categoryId, page, limit, supabase);

    return json({ projects: projects }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
