
export function mapProjectsWithTagsAndStatus(projects, projectCategories, categories, dpgStatuses) {
  const categoriesById = categories.reduce((acc, category) => {
    acc[category.id] = category;
    return acc;
  }, {});

  const dpgStatusScoreByProject = dpgStatuses.reduce((acc, status) => {
    // Ensure the score is treated as a number and sum the scores for the same project
    acc[status.project_id] = (acc[status.project_id] || 0) + (Number(status.score) || 0); 
    return acc;
  }, {});

  return projects.map((project) => {
    const tagsForProject = projectCategories
      .filter((pc) => pc.project_id === project.id)
      .map((pc) => categoriesById[pc.category_id]);

    return {
      ...project,
      tags: tagsForProject.filter(Boolean), // Exclude null tags
      dpgStatusCount: dpgStatusScoreByProject[project.id] || 0, 
    };
  });
}
