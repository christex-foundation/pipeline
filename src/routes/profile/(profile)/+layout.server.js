import { error } from '@sveltejs/kit';

/** @type {import("./$types.js").LayoutServerLoad} */
export async function load({ fetch }) {
  try {
    // Fetch all data in parallel for better performance
    const [userResponse, projectsResponse, contributedResponse, followingResponse] =
      await Promise.all([
        fetch('/api/me'),
        fetch('/api/projects/user/projects'),
        fetch('/api/projects/user/contributed'),
        fetch('/api/projects/user/bookmarks'),
      ]);

    // Handle user data (required)
    if (!userResponse.ok) {
      return error(userResponse.status, { message: 'Failed to fetch user data' });
    }

    const { user, error: userError } = await userResponse.json();
    if (userError) {
      return error(400, { message: userError });
    }

    // Handle optional data (graceful degradation)
    const projects = projectsResponse.ok ? (await projectsResponse.json()).projects || [] : [];

    const contributedProjects = contributedResponse.ok
      ? (await contributedResponse.json()).projects || []
      : [];

    const following = followingResponse.ok ? (await followingResponse.json()).projects || [] : [];

    return {
      user,
      projects,
      contributedProjects,
      following,
    };
  } catch (e) {
    return error(500, { message: 'Failed to load profile data' });
  }
}
