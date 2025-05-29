export async function getAllDpgStatuses(supabase) {
  const { data, error } = await supabase.from('dpg_status').select('*');
  if (error) throw new Error(error.message);
  return data || [];
}
export async function getDpgStatuses(projectIds, supabase) {
  const { data, error } = await supabase
    .from('project_dpg_status')
    .select('*')
    .in('project_id', projectIds);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getProjectDpgStatuses(projectId, supabase) {
  const { data, error } = await supabase
    .from('project_dpg_status')
    .select('*')
    .eq('project_id', projectId);

  if (error) throw new Error(error.message);
  return data;
}

export async function createProjectDpgStatus(projectDpgStatusData, supabase) {
  const { project_id, status_id } = projectDpgStatusData;

  const { data: existingRecord, error: fetchError } = await supabase
    .from('project_dpg_status')
    .select('*')
    .eq('project_id', project_id)
    .eq('status_id', status_id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(fetchError.message); // Handle errors other than "no rows found"
  }

  let result;

  if (existingRecord) {
    // Update existing record
    const { data, error } = await supabase
      .from('project_dpg_status')
      .update({
        score: projectDpgStatusData.score,
        explanation: projectDpgStatusData.explanation,
      })
      .eq('project_id', project_id)
      .eq('status_id', status_id)
      .select();

    if (error) throw new Error(error.message);
    result = data;
  } else {
    // Insert new record
    const { data, error } = await supabase
      .from('project_dpg_status')
      .insert(projectDpgStatusData)
      .select();
    if (error) throw new Error(error.message);
    result = data;
  }
  return result;
}
