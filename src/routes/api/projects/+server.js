//@ts-check

import { getProjectsWithDetails } from '$lib/server/service/projectService.js';

import { json } from '@sveltejs/kit';

export async function GET({ url, locals, setHeaders }) {
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '6', 10);
  const term = url.searchParams.get('term') || '';
  const excludeIds =
    url.searchParams
      .get('excludeIds')
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) || [];
  const sortParam = url.searchParams.get('sort');
  const sort = sortParam === 'heat' ? 'heat' : 'created_at';
  let supabase = locals.supabase;

  try {
    const projects = await getProjectsWithDetails(term, page, limit, supabase, excludeIds, sort);

    return json({ projects: projects }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
