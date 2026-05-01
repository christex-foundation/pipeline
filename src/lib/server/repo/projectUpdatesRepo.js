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

/**
 * Count project updates created since `sinceDate`, batched across many project IDs.
 * Used by the explore-feed pills to derive "Trending" without an N+1.
 *
 * @param {string[]} projectIds
 * @param {Date} sinceDate
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<Map<string, number>>}
 */
export async function getRecentUpdateCountsByProjectIds(projectIds, sinceDate, supabase) {
  const result = new Map();
  if (!Array.isArray(projectIds) || projectIds.length === 0) return result;

  const { data, error } = await supabase
    .from('project_updates')
    .select('project_id')
    .in('project_id', projectIds)
    .gte('created_at', sinceDate.toISOString());

  if (error) throw new Error(error.message);

  for (const row of data ?? []) {
    if (!row?.project_id) continue;
    result.set(row.project_id, (result.get(row.project_id) ?? 0) + 1);
  }
  return result;
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
