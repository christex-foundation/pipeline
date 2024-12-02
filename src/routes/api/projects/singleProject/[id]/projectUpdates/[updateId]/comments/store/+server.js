import { supabase } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';
import { storeProjectUpdateComment } from '$lib/server/service/projectUpdateCommentService.js';

export async function POST({ params, request, locals }) {
  const { id, updateId } = params;
  const { body } = await request.json();

  let user = locals.authUser.user;

  try {
    await storeProjectUpdateComment({
      project_id: id,
      update_id: updateId,
      body,
      user_id: user.id,
    });

    return json({ success: true }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
