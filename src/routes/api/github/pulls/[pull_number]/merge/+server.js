import { json } from '@sveltejs/kit';
import { mergePullRequest } from '$lib/server/service/githubApiService.js';

export async function PUT({ request, params, locals }) {
  const user = locals.authUser;
  if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const pull_number = parseInt(params.pull_number);

  try {
    const result = await mergePullRequest(user.id, { ...body, pull_number }, locals.supabase);
    return json({ result });
  } catch (err) {
    const status = err.status || 500;
    return json({ error: err.message }, { status });
  }
}
