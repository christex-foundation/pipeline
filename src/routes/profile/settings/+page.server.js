import { redirect, fail } from '@sveltejs/kit';
import { getConnectionStatus, unlinkGitHub } from '$lib/server/service/githubConnectionService.js';
import { linkIdentity } from '$lib/server/providers/authProvider.js';
import { deleteAccount } from '$lib/server/service/authUserService.js';

export async function load({ locals }) {
  const user = locals.authUser;
  if (!user) return { githubConnection: null };

  const githubConnection = await getConnectionStatus(user.id);
  return { githubConnection };
}

export const actions = {
  connectGitHub: async ({ locals, url }) => {
    try {
      const { url: authUrl } = await linkIdentity(locals.supabase, {
        provider: 'github',
        redirectTo: `${url.origin}/auth/github/callback`,
        scopes: 'read:user',
      });

      if (authUrl) {
        throw redirect(303, authUrl);
      }

      throw redirect(303, '/profile/settings?error=github_link_failed');
    } catch (err) {
      if (err.status === 303) throw err;
      throw redirect(303, '/profile/settings?error=github_link_failed');
    }
  },

  disconnectGitHub: async ({ locals }) => {
    const user = locals.authUser;
    const supabase = locals.supabase;

    if (!user) {
      return fail(401, { error: 'Not authenticated' });
    }

    try {
      await unlinkGitHub(user.id, supabase);
    } catch (_) {
      return fail(500, { error: 'Failed to disconnect GitHub account.' });
    }

    throw redirect(303, '/profile/settings');
  },

  deleteAccount: async ({ cookies, locals }) => {
    const user = locals.authUser;
    const supabase = locals.supabase;

    if (!user) {
      return fail(401, { error: 'Not authenticated' });
    }

    try {
      await deleteAccount(user.id, supabase);

      for (const token of ['access_token', 'refresh_token']) {
        cookies.set(token, '', {
          path: '/',
          expires: new Date(0),
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        });
      }
    } catch (_) {
      return fail(500, { error: 'Failed to delete account. Please try again later.' });
    }

    redirect(307, '/');
  },
};
