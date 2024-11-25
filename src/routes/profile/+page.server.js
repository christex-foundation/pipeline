import { error, fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({}) {
  async function userProjects() {
    try {
      const response = await fetch('/api/projects');
      console.log(await response.json());
      if (!response.ok) {
        error(404, { message: response.statusText });
      }

      const data = await response.json();
      console.log(data);
    } catch (e) {
      error(404, { message: e.message });
    }
  }

  return {
    userProjects: [],
  };
}
