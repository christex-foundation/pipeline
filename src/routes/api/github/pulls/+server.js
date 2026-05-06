import { json } from '@sveltejs/kit';
import { createPullRequest, listPullRequests } from '$lib/server/service/githubApiService.js';

export async function POST({ request, locals }) {
  const user = locals.authUser;
  if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  try {
    const pull = await createPullRequest(user.id, body, locals.supabase);
    return json({ pull }, { status: 201 });
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
    const pulls = await listPullRequests(
      user.id,
      { owner, repo, state, page, per_page },
      locals.supabase,
    );
    return json({ pulls });
  } catch (err) {
    const status = err.status || 500;
    return json({ error: err.message }, { status });
  }
}
