import { redirect } from '@sveltejs/kit';
import { exchangeCodeForSession } from '$lib/server/providers/authProvider.js';
import { linkGitHub } from '$lib/server/service/githubConnectionService.js';

export async function GET({ url, locals }) {
  const errorCode = url.searchParams.get('error_code');
  const alreadyRetried = url.searchParams.get('retried') === '1';

  // If Supabase already has this github identity linked (e.g. leftover from a
  // prior attempt that crashed before writing our row), unlink and relink to
  // get a fresh provider_token.
  if (errorCode === 'identity_already_exists' && !alreadyRetried) {
    throw redirect(303, '/auth/github/relink');
  }

  const code = url.searchParams.get('code');
  if (!code) {
    throw redirect(303, '/profile/settings?error=github_link_failed');
  }

  try {
    const { session } = await exchangeCodeForSession(locals.supabase, code);

    if (!session?.provider_token) {
      throw redirect(303, '/profile/settings?error=github_link_failed');
    }

    await linkGitHub(
      session.user.id,
      session.provider_token,
      'read:user public_repo',
      locals.supabase,
    );
  } catch (err) {
    if (err.status === 303) throw err;
    throw redirect(303, '/profile/settings?error=github_link_failed');
  }

  throw redirect(303, '/profile/settings?github=linked');
}
