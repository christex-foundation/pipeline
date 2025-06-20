import { redirect } from '@sveltejs/kit';

export async function load({ params, fetch, parent }) {
  const { isAuthenticated } = await parent();

  if (!isAuthenticated) {
    redirect(307, '/explore');
  }

  try {
    const response = await fetch(`/api/projects/singleProject/${params.id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }

    const { project } = await response.json();
    return { project };
  } catch (error) {
    return {
      status: 500,
      error: new Error('Failed to load project: ' + error.message),
    };
  }
}
