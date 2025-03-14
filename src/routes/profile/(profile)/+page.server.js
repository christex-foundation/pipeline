//@ts-check
import { error, redirect } from '@sveltejs/kit';
import { signOut } from '$lib/server/service/authUserService.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  try {
    const response = await fetch('/api/projects/user/projects');

    if (!response.ok) {
      return { projects: [] };
    }

    const { projects } = await response.json();

    return { projects };
  } catch (e) {
    return error(500, { message: e.message });
  }
}

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
