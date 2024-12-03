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
