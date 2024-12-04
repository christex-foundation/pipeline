//@ts-check
import { getProjectUpdates } from '$lib/server/service/projectUpdatesService.js';

import { json } from '@sveltejs/kit';

export async function GET({ params, locals }) {
  const { id } = params;
  let supabase = locals.supabase;

  try {
    const projectUpdatesWithProfiles = await getProjectUpdates(id, supabase);

    return json({ projectUpdates: projectUpdatesWithProfiles }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
