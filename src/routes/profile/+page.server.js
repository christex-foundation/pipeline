import { error, fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      fail(400, { message: response.statusText });
      // console.log(response);
    }

    const data = await response.json();

    return { userProjects: data.projects };
  } catch (e) {
    error(404, { message: e.message });
  }
}
