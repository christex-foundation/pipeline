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
