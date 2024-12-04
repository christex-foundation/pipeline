export async function getAllDpgStatuses(supabase) {
  const { data, error } = await supabase.from('dpg_status').select('*');
  if (error) throw new Error(error.message);
  return data || [];
}
export async function getDpgStatuses(projectIds, supabase) {
  const { data, error } = await supabase
    .from('project_dpg_status')
    .select('project_id')
    .in('project_id', projectIds);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getProjectDpgStatuses(projectId, supabase) {
  const { data, error } = await supabase
    .from('project_dpg_status')
    .select('status_id')
    .eq('project_id', projectId);

  if (error) throw new Error(error.message);
  return data;
}
