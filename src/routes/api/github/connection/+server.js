import { json } from '@sveltejs/kit';
import { getConnectionStatus, unlinkGitHub } from '$lib/server/service/githubConnectionService.js';

export async function GET({ locals }) {
  const user = locals.authUser;
  if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

  const status = await getConnectionStatus(user.id);
  return json(status);
}

export async function DELETE({ locals }) {
  const user = locals.authUser;
  if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await unlinkGitHub(user.id, locals.supabase);
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
