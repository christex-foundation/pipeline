import { supabase } from '$lib/server/supabase.js';

export async function fetchProjectCategories(projectIds) {
  const { data: projectCategories, error } = await supabase
    .from('category_project')
    .select('project_id, category_id')
    .in('project_id', projectIds);

  if (error) throw new Error(error.message);
  return projectCategories;
}

export async function fetchCategories(categoryIds) {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .in('id', categoryIds);

  if (error) throw new Error(error.message);
  return categories;
}

export async function fetchDpgStatuses(projectIds) {
  const { data: projectDpgStatuses, error } = await supabase
    .from('project_dpg_status')
    .select('project_id')
    .in('project_id', projectIds);

  if (error) throw new Error(error.message);
  return projectDpgStatuses;
}

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
      tags: tagsForProject.filter(Boolean),
      dpgStatusCount: dpgStatusCountByProject[project.id] || '',
    };
  });
}

// mapProjectsWithTagsAndStatusAndDpgStatuses
