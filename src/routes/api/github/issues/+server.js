import { json } from '@sveltejs/kit';
import { createIssue, listIssues } from '$lib/server/service/githubApiService.js';

export async function POST({ request, locals }) {
  const user = locals.authUser;
  if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  try {
    const issue = await createIssue(user.id, body, locals.supabase);
    return json({ issue }, { status: 201 });
  } catch (err) {
    const status = err.status || 500;
    return json({ error: err.message }, { status });
  }
}

export async function GET({ url, locals }) {
  const user = locals.authUser;
  if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

  const owner = url.searchParams.get('owner');
  const repo = url.searchParams.get('repo');
  const state = url.searchParams.get('state') || 'open';
  const page = parseInt(url.searchParams.get('page') || '1');
  const per_page = parseInt(url.searchParams.get('per_page') || '30');

  try {
    const issues = await listIssues(
      user.id,
      { owner, repo, state, page, per_page },
      locals.supabase,
    );
    return json({ issues });
  } catch (err) {
    const status = err.status || 500;
    return json({ error: err.message }, { status });
  }
}
