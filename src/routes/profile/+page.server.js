//@ts-check
import { redirect } from '@sveltejs/kit';
import { signOut } from '$lib/server/service/authUserService.js';
import { supabase } from '$lib/server/supabase.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals }) {
  const { data } = await supabase
    .from('project_resource')
    .select('project_id')
    // .select('*')
    .eq('user_id', locals?.authUser?.id);
  const { data: contributed } = await supabase
    .from('projects')
    .select('*')
    .in(
      'id',
      data.flatMap((d) => d.project_id),
    );

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

    //console.log((projectsData.projects || []).concat(contributed));

    return {
      allProjects: projectsData.projects || [],
      bookmarks: bookmarksData.projects || [],
      contributed: [...projectsData.projects, ...contributed],
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
