import { error } from '@sveltejs/kit';

/** @type {import("./$types").LayoutServerLoad} */
export async function load({ fetch }) {
  try {
    const response = await fetch('/api/me');
    const { user, error } = await response.json();

    if (!response.ok) {
      return error(404, { message: error });
    }

    return { user };
  } catch (_e) {
    return error(500, { message: _e.message });
  }
}
