//@ts-check

import { getTopProjectsByReadiness } from '$lib/server/service/projectService.js';
import { json } from '@sveltejs/kit';

const DEFAULT_LIMIT = 3;
const MAX_LIMIT = 20;

export async function GET({ url, locals }) {
  const parsed = parseInt(url.searchParams.get('limit') || String(DEFAULT_LIMIT), 10);
  const limit = Math.min(
    Math.max(Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const supabase = locals.supabase;

  try {
    const projects = await getTopProjectsByReadiness(limit, supabase);
    return json({ projects }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
