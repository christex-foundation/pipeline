import { supabase } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';
import { getUpdateComment } from '$lib/server/service/projectUpdateCommentService.js';

export async function GET({ params, locals }) {
  const { id, updateId } = params;
  let supabase = locals.supabase;

  try {
    const commentsWithProfiles = await getUpdateComment(id, updateId, supabase);

    return json({ comments: commentsWithProfiles }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
