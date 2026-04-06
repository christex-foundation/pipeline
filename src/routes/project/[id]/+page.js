export async function load({ params, fetch }) {
  const { id } = params;

  try {
    const [projectRes, resourcesRes, evaluationsRes] = await Promise.all([
      fetch(`/api/projects/singleProject/${id}`),
      fetch(`/api/projects/singleProject/${id}/contribution/resources`),
      fetch(`/api/projects/${id}/evaluations`),
    ]);

    if (!projectRes.ok || !resourcesRes.ok) {
      throw new Error('Failed to fetch project');
    }

    const [projectData, resourcesData] = await Promise.all([
      projectRes.json(),
      resourcesRes.json(),
    ]);

    const evaluationsData = await evaluationsRes.json();

    return {
      project: projectData.project || [],
      totalResources: resourcesData.totalResources,
      evaluations: evaluationsData,
    };
  } catch (e) {
    return {
      status: 500,
      error: new Error('Failed to load data: ' + e.message),
    };
  }
}
