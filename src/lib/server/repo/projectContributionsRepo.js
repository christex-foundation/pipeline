//@ts-check

export async function getResources(projectId, supabase) {
  const { data, error } = await supabase
    .from('project_resource')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function storeResource(resourceData, supabase) {
  const { data, error } = await supabase.from('project_resource').insert(resourceData).select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function getProjectResourcesCount(projectId, supabase) {
  const { count, error } = await supabase
    .from('project_resource')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  if (error) throw new Error(error.message);
  return count;
}
