import { json } from '@sveltejs/kit';
import { updateIssueState } from '$lib/server/service/githubApiService.js';

export async function PATCH({ request, params, locals }) {
  const user = locals.authUser;
  if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const issue_number = parseInt(params.issue_number);

  try {
    const issue = await updateIssueState(user.id, { ...body, issue_number }, locals.supabase);
    return json({ issue });
  } catch (err) {
    const status = err.status || 500;
    return json({ error: err.message }, { status });
  }
}
