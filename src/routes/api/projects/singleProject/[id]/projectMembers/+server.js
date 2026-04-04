//@ts-check
import { getTeamMembers } from '$lib/server/service/projectService.js';
import { json } from '@sveltejs/kit';

export async function GET({ params, locals }) {
  const { id } = params;
  const supabase = locals.supabase;

  try {
    const members = await getTeamMembers(id, supabase);
    return json({ members }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
