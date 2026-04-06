//@ts-check

/**
 * Fetch recent evaluation runs for a project from the shared queue table.
 *
 * @param {string} projectId
 * @param {any} supabase
 * @param {number} [limit=25]
 */
export async function getProjectEvaluationRuns(projectId, supabase, limit = 25) {
  const { data, error } = await supabase
    .from('evaluation_queue')
    .select(
      'id, project_id, github_url, status, created_at, updated_at, started_at, completed_at, retry_count, error, result',
    )
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Create a new manual evaluation request.
 *
 * @param {{ project_id: string, github_url: string, status?: string, retry_count?: number }} entry
 * @param {any} supabase
 */
export async function createProjectEvaluationRun(entry, supabase) {
  const { data, error } = await supabase
    .from('evaluation_queue')
    .insert({
      project_id: entry.project_id,
      github_url: entry.github_url,
      status: entry.status || 'pending',
      retry_count: entry.retry_count ?? 0,
    })
    .select(
      'id, project_id, github_url, status, created_at, updated_at, started_at, completed_at, retry_count, error, result',
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
