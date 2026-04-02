import { json } from '@sveltejs/kit';
import { teamMembers } from '$lib/server/repo/memberRepo.js';

export async function GET({ params, locals }) {
  const { id } = params;
  const supabase = locals.supabase;

  try {
    const members = await teamMembers(id, supabase);

    return json({ members }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
