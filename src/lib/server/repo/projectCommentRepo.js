//@ts-check

export async function listCommentsByProjectId(projectId, supabase) {
  const { data, error } = await supabase
    .from('project_comment')
    .select('id, project_id, user_id, body, created_at')
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function insertComment(commentData, supabase) {
  const { data, error } = await supabase
    .from('project_comment')
    .insert(commentData)
    .select('id, project_id, user_id, body, created_at')
    .single();

  if (error) throw new Error(error.message);
  return data;
}
