export async function load({ fetch }) {
  try {
    const response = await fetch('/api/projects/user/bookmarks');

    if (!response.ok) {
      return { following: [] };
    }

    const data = await response.json();

    return { following: data.projects };
  } catch (e) {
    return error(500, { message: e.message });
  }
}
