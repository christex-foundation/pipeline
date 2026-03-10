//@ts-check

export async function teamMembers(projectId, supabase) {
  const { data, error } = await supabase
    .from('project_members')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function createTeamMember(userId, projectId, supabase) {
  const { data, error } = await supabase
    .from('project_members')
    .insert([
      {
        user_id: userId,
        project_id: projectId,
        creator_id: userId,
      },
    ])
    .select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function deleteMembersByUserId(userId, supabase) {
  const { error } = await supabase.from('project_members').delete().eq('user_id', userId);
  if (error) throw new Error(error.message);
}

export async function deleteMembersByProjectIds(projectIds, supabase) {
  if (!projectIds.length) return;
  const { error } = await supabase.from('project_members').delete().in('project_id', projectIds);
  if (error) throw new Error(error.message);
}
