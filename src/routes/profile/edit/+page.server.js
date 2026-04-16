import { redirect, fail } from '@sveltejs/kit';
import { uploadImageAndReturnUrl, removeImage } from '$lib/server/service/imageUploadService.js';
import { profileSchema } from '$lib/server/validator/profileScheme.js';
import { deleteAccount } from '$lib/server/service/authUserService.js';
import { getConnectionStatus, unlinkGitHub } from '$lib/server/service/githubConnectionService.js';
import { linkIdentity } from '$lib/server/providers/authProvider.js';

export async function load({ locals }) {
  const user = locals.authUser;
  if (!user) return { githubConnection: null };

  const githubConnection = await getConnectionStatus(user.id, locals.supabase);
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

      return fail(500, { error: 'Failed to get GitHub authorization URL.' });
    } catch (err) {
      if (err.status === 303) throw err;
      return fail(500, { error: 'Failed to initiate GitHub connection.' });
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

    throw redirect(303, '/profile/edit');
  },

  updateProfile: async ({ request, locals, fetch }) => {
    let supabase = locals.supabase;

    const { old_image, old_banner, banner, image, ...form } = Object.fromEntries(
      await request.formData(),
    );

    const { data, error: validationError, success } = profileSchema.safeParse(form);

    if (!success) {
      const errors = validationError.flatten().fieldErrors;
      const firstError = Object.values(errors).flat().at(0);
      return fail(400, { error: firstError });
    }

    if (banner?.size > 0) {
      if (old_banner) {
        await removeImage(old_banner, supabase);
      }
      data.banner = await uploadImageAndReturnUrl(banner, supabase);
    } else {
      data.banner = old_banner;
    }

    if (image?.size > 0) {
      if (old_image) {
        await removeImage(old_image, supabase);
      }
      data.image = await uploadImageAndReturnUrl(image, supabase);
    } else {
      data.image = old_image;
    }

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        return fail(400, { error: 'Failed to save project' });
      }
    } catch (_) {
      return fail(500, { error: 'Failed to save project. Please try again later.' });
    }

    redirect(307, '/profile');
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
