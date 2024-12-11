export async function load({ params, fetch }) {
  const { id } = params;

  try {
    const [projectRes, updatesRes, resourcesRes] = await Promise.all([
      fetch(`/api/projects/singleProject/${id}`),
      fetch(`/api/projects/singleProject/${id}/projectUpdates`),
      fetch(`/api/projects/singleProject/${id}/contribution/resources`),
    ]);

    if (!projectRes.ok || !updatesRes.ok || !resourcesRes.ok) {
      throw new Error('Failed to fetch project');
    }

    const [projectData, updatesData, resourcesData] = await Promise.all([
      projectRes.json(),
      updatesRes.json(),
      resourcesRes.json(),
    ]);

    return {
      project: projectData.project || [],
      updates: updatesData.projectUpdates || [],
      resources: resourcesData.resources || [],
    };
  } catch (e) {
    return {
      status: 500,
      error: new Error('Failed to load data: ' + e.message),
    };
  }
}

export const actions = {
  addUpdate: async ({ request, params, fetch }) => {
    const form = Object.fromEntries(await request.formData());

    const { id } = params;

    const response = await fetch(`/api/projects/singleProject/${id}/projectUpdates/store`, {
      method: 'POST',
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    

    return response.status;
  },

  bookmark: async ({ request, params, fetch }) => {
    const { id } = params;

    const response = await fetch(`/api/projects/singleProject/${id}/bookmark`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  },
};
