import { redirect } from '@sveltejs/kit';
import { linkIdentity, unlinkIdentityByProvider } from '$lib/server/providers/authProvider.js';

export async function GET({ url, locals }) {
  if (!locals.authUser) {
    throw redirect(303, '/sign-in');
  }

  try {
    await unlinkIdentityByProvider(locals.supabase, 'github');

    const { url: authUrl } = await linkIdentity(locals.supabase, {
      provider: 'github',
      redirectTo: `${url.origin}/auth/github/callback?retried=1`,
      scopes: 'read:user public_repo',
    });

    if (authUrl) {
      throw redirect(303, authUrl);
    }
    throw redirect(303, '/profile/settings?error=github_link_failed');
  } catch (err) {
    if (err.status === 303) throw err;
    throw redirect(303, '/profile/settings?error=github_link_failed');
  }
}
