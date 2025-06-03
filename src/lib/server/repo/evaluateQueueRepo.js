export async function getEvaluationQueue(limit, supabase) {
  const { data, error } = await supabase
    .from('evaluation_queue')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data;
}

export async function createEvaluationQueue(data, supabase) {
  const { data: queueData, error } = await supabase.from('evaluation_queue').insert(data).select();
  if (error) throw new Error(error.message);
  return queueData;
}

export async function updateEvaluationQueue(id, data, supabase) {
  const { data: queueData, error } = await supabase
    .from('evaluation_queue')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  return queueData[0];
}
