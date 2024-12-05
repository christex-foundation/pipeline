export function mapProjectsWithTagsAndStatus(projects, projectCategories, categories, dpgStatuses) {
  const categoriesById = categories.reduce((acc, category) => {
    acc[category.id] = category;
    return acc;
  }, {});

  const dpgStatusCountByProject = dpgStatuses.reduce((acc, status) => {
    acc[status.project_id] = (acc[status.project_id] || 0) + 1;
    return acc;
  }, {});

  return projects.map((project) => {
    const tagsForProject = projectCategories
      .filter((pc) => pc.project_id === project.id)
      .map((pc) => categoriesById[pc.category_id]);

    return {
      ...project,
      tags: tagsForProject.filter(Boolean), // Exclude null tags
      dpgStatusCount: dpgStatusCountByProject[project.id] || 0,
    };
  });
}
