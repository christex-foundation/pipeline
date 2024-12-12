import { redirect } from '@sveltejs/kit';

export async function load({params, fetch, locals }) {
  let user = locals.authUser;

  if (!user) {
    redirect(307, '/explore');
  }

  const id = params.id;
  
  const response = await fetch(`/api/projects/singleProject/${params.id}`);
  const { project } = await response.json();
  
  if (!response.ok) {
    throw new Error(project.message || 'Failed to fetch project');
  }

  return { project };

  
}



