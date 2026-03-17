//@ts-check

export async function getComments(id, updateId, supabase) {
  const { data, error } = await supabase
    .from('project_update_comment')
    .select('*')
    .eq('project_id', id)
    .eq('update_id', updateId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function storeComment(commentData, supabase) {
  const { data, error } = await supabase
    .from('project_update_comment')
    .insert(commentData)
    .select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function deleteCommentsByUserId(userId, supabase) {
  const { error } = await supabase.from('project_update_comment').delete().eq('user_id', userId);
  if (error) throw new Error(error.message);
}

export async function deleteCommentsByProjectIds(projectIds, supabase) {
  if (!projectIds.length) return;
  const { error } = await supabase
    .from('project_update_comment')
    .delete()
    .in('project_id', projectIds);
  if (error) throw new Error(error.message);
}
