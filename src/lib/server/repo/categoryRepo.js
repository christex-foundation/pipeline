//@ts-check

export async function getAllCategories(supabase) {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw new Error(error.message);
  return data || [];
}
export async function getProjectCategories(projectIds, supabase) {
  const { data, error } = await supabase
    .from('category_project')
    .select('project_id, category_id')
    .in('project_id', projectIds);

  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Get projects by categories with pagination support
 *
 * @param {Array<string>} categoryIds - Array of category UUIDs to filter by
 * @param {number} start - Start index for pagination (0-based)
 * @param {number} end - End index for pagination (inclusive)
 * @param {Object} supabase - Supabase client instance
 * @returns {Promise<Array>} Array of unique project objects
 *
 * @example
 * // Get first 10 projects from specified categories
 * const projects = await getProjectsByCategoriesWithPagination(categoryIds, 0, 9, supabase);
 */
export async function getProjectsByCategoriesWithPagination(categoryIds, start, end, supabase) {
  if (!categoryIds || categoryIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('category_project')
    .select(
      `
      project_id,
      projects (id,
      title,
      banner_image,
      funding_goal,
      current_funding,
      user_id,
      category_project!inner (
        categories!inner (
          image
        )
      )
      )
    `,
    )
    .in('category_id', categoryIds)
    .range(start, end);

  if (error) throw new Error(error.message);

  // Extract unique projects from the results
  const uniqueProjects = [];
  const seenProjectIds = new Set();

  data?.forEach((item) => {
    if (item.projects && !seenProjectIds.has(item.projects.id)) {
      uniqueProjects.push(item.projects);
      seenProjectIds.add(item.projects.id);
    }
  });

  return uniqueProjects;
}

export async function getProjectsByCategoryId(categoryId, start, end, supabase) {
  const { data, error } = await supabase
    .from('category_project')
    .select('project_id')
    .eq('category_id', categoryId)
    .range(start, end);

  if (error) throw new Error(error.message);
  return data;
}

export async function getProjectExistingCategories(projectId, supabase) {
  const { data, error } = await supabase
    .from('category_project')
    .select('category_id')
    .eq('project_id', projectId);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCategories(categoryIds, supabase) {
  const { data, error } = await supabase.from('categories').select('*').in('id', categoryIds);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function addTags(projectId, tagsToAdd, supabase) {
  const insertData = tagsToAdd.map((tagId) => ({
    project_id: projectId,
    category_id: tagId,
  }));

  const { error } = await supabase.from('category_project').insert(insertData);
  if (error) throw new Error(error.message);
}

export async function removeTags(projectId, tagsToRemove, supabase) {
  const { error } = await supabase
    .from('category_project')
    .delete()
    .in('category_id', tagsToRemove)
    .eq('project_id', projectId);

  if (error) throw new Error(error.message);
}

export async function assignCategory(categoryData, supabase) {
  const { data, error } = await supabase.from('category_project').insert(categoryData).select();
  if (error) throw new Error(error.message);
  return data[0];
}
