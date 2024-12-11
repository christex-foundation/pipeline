//@ts-check
import { redirect } from '@sveltejs/kit';
import { signOut } from '$lib/server/service/authUserService.js';

/** @type {import('./$types').Actions} */
export async function load({ fetch }) {
  try {
    const [projectsRes, bookmarksRes] = await Promise.all([
      fetch('/api/projects/user/projects'),
      fetch('/api/projects/user/bookmarks'),
    ]);

    if (!projectsRes.ok || !bookmarksRes.ok) {
      throw new Error('Failed to fetch projects or bookmarks');
    }

    const [projectsData, bookmarksData] = await Promise.all([
      projectsRes.json(),
      bookmarksRes.json(),
    ]);

    return {
      allProjects: projectsData.projects || [],
      bookmarks: bookmarksData.projects || [],
    };
  } catch (e) {
    return {
      status: 500,
      error: new Error('Failed to load data: ' + e.message),
    };
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
