export function mapProjectsWithTagsAndStatus(projects, projectCategories, categories) {
  const categoriesById = categories.reduce((acc, category) => {
    acc[category.id] = category;
    return acc;
  }, {});

  return projects.map((project) => {
    const tagsForProject = projectCategories
      .filter((pc) => pc.project_id === project.id)
      .map((pc) => categoriesById[pc.category_id]);

    const dpgTotalScore = project.dpgStatus
      ? project.dpgStatus.status.reduce(
          (sum, status) => sum + (Number(status.overallScore) || 0),
          0,
        )
      : 0;

    return {
      ...project,
      tags: tagsForProject.filter(Boolean),
      dpgStatusCount: dpgTotalScore,
    };
  });
}
