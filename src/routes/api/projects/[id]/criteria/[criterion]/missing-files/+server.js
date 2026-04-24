import { json } from '@sveltejs/kit';
import { listMissingFiles } from '$lib/server/service/criterionCheckService.js';

export async function GET({ params, locals }) {
  const user = locals.authUser;
  if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const result = await listMissingFiles(user.id, params.id, params.criterion, locals.supabase);
    return json(result);
  } catch (err) {
    const status = err.status || 500;
    return json({ error: err.message }, { status });
  }
}
