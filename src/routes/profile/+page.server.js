//@ts-check
import { redirect } from '@sveltejs/kit';
import { signOut } from '$lib/server/service/authUserService.js';

/** @type {import('./$types').Actions} */
export const actions = {
  logout: async ({ cookies, locals }) => {
    await signOut(locals.supabase);

    for (const token of ['access_token', 'refresh_token']) {
      cookies.set(token, '', {
        path: '/',
        expires: new Date(0),
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
    }

    redirect(307, '/sign-in');
  },
};
