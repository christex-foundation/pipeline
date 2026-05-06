//@ts-check

/**
 * Insert a new evaluation request.
 * @param {string} projectId
 * @param {string} githubUrl
 * @param {'manual'|'webhook'|'auto'} trigger
 * @param {string|null} requestedBy - auth user UUID or null
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<object>}
 */
export async function insertEvaluationRequest(
  projectId,
  githubUrl,
  trigger,
  requestedBy,
  supabase,
) {
  const PUBLIC_COLUMNS = 'id, project_id, status, created_at, completed_at, result';

  // Try with all columns first (requires migration).
  // Fall back to core columns if the new ones don't exist yet.
  let { data, error } = await supabase
    .from('evaluation_queue')
    .insert({
      project_id: projectId,
      github_url: githubUrl,
      trigger,
      requested_by: requestedBy,
    })
    .select(PUBLIC_COLUMNS)
    .single();

  if (error && error.message?.includes('column')) {
    ({ data, error } = await supabase
      .from('evaluation_queue')
      .insert({
        project_id: projectId,
        github_url: githubUrl,
      })
      .select(PUBLIC_COLUMNS)
      .single());
  }

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Get the active (pending or running) evaluation for a project.
 * @param {string} projectId
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<object|null>}
 */
export async function getActiveEvaluation(projectId, supabase) {
  const { data, error } = await supabase
    .from('evaluation_queue')
    .select('id, project_id, status, created_at')
    .eq('project_id', projectId)
    .in('status', ['pending', 'running'])
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Get evaluation history for a project, newest first.
 * @param {string} projectId
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {number} [limit=10]
 * @returns {Promise<object[]>}
 */
export async function getEvaluationHistory(projectId, supabase, limit = 10) {
  const { data, error } = await supabase
    .from('evaluation_queue')
    .select('id, project_id, status, created_at, completed_at, result')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Get the latest completed evaluation for a project.
 * @param {string} projectId
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<object|null>}
 */
export async function getLatestCompletedEvaluation(projectId, supabase) {
  const { data, error } = await supabase
    .from('evaluation_queue')
    .select('id, project_id, status, created_at, completed_at, result')
    .eq('project_id', projectId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
