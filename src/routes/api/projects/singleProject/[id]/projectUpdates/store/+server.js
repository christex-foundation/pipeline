import { supabase } from '$lib/server/supabase.js';
import { createProjectUpdate } from '$lib/server/service/projectUpdatesService.js';
import { json } from '@sveltejs/kit';

export async function POST({ params, request, locals }) {
  const { id } = params;
  const { title, body } = await request.json();

  let user = locals.authUser;

  try {
    await createProjectUpdate({ project_id: id, title, body, user_id: user.id }, supabase);

    return json({ success: true }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
