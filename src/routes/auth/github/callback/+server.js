import { redirect } from '@sveltejs/kit';
import { exchangeCodeForSession } from '$lib/server/providers/authProvider.js';
import { linkGitHub } from '$lib/server/service/githubConnectionService.js';

export async function GET({ url, locals }) {
  const code = url.searchParams.get('code');

  if (!code) {
    throw redirect(303, '/profile/settings?error=github_link_failed');
  }

  try {
    const { session } = await exchangeCodeForSession(locals.supabase, code);

    if (!session?.provider_token) {
      throw redirect(303, '/profile/settings?error=github_link_failed');
    }

    await linkGitHub(session.user.id, session.provider_token, 'read:user', locals.supabase);
  } catch (err) {
    if (err.status === 303) throw err;
    throw redirect(303, '/profile/settings?error=github_link_failed');
  }

  throw redirect(303, '/profile/settings?github=linked');
}
