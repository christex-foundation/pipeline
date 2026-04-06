//@ts-check

export async function getAllUpdates(supabase) {
  const { data, error } = await supabase
    .from('project_updates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getUpdates(projectId, supabase) {
  const { data, error } = await supabase
    .from('project_updates')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function storeProjectUpdate(projectUpdateData, supabase) {
  const { data, error } = await supabase.from('project_updates').insert(projectUpdateData).select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function deleteUpdatesByUserId(userId, supabase) {
  const { error } = await supabase.from('project_updates').delete().eq('user_id', userId);
  if (error) throw new Error(error.message);
}

export async function deleteUpdatesByProjectIds(projectIds, supabase) {
  if (!projectIds.length) return;
  const { error } = await supabase.from('project_updates').delete().in('project_id', projectIds);
  if (error) throw new Error(error.message);
}
