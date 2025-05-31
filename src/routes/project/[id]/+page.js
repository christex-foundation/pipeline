export async function load({ params, fetch }) {
  const { id } = params;

  try {
    const [projectRes, resourcesRes] = await Promise.all([
      fetch(`/api/projects/singleProject/${id}`),
      fetch(`/api/projects/singleProject/${id}/contribution/resources`),
    ]);

    if (!projectRes.ok || !resourcesRes.ok) {
      throw new Error('Failed to fetch project');
    }

    const [projectData, resourcesData] = await Promise.all([
      projectRes.json(),
      resourcesRes.json(),
    ]);

    return {
      project: projectData.project || [],
      totalResources: resourcesData.totalResources,
    };
  } catch (e) {
    return {
      status: 500,
      error: new Error('Failed to load data: ' + e.message),
    };
  }
}
