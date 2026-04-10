//@ts-check

/**
 * Returns the GitHub connection for a user (without the access token).
 *
 * @param {string} userId
 * @param {any} supabase
 * @returns {Promise<any>}
 */
export async function getConnection(userId, supabase) {
  const { data, error } = await supabase
    .from('github_connections')
    .select('id, user_id, github_user_id, github_username, scopes, connected_at, updated_at')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data;
}

/**
 * Returns the GitHub connection for a user including the access token.
 * Only use this server-side when making GitHub API calls.
 *
 * @param {string} userId
 * @param {any} supabase
 * @returns {Promise<any>}
 */
export async function getConnectionWithToken(userId, supabase) {
  const { data, error } = await supabase
    .from('github_connections')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data;
}

/**
 * Upserts a GitHub connection (inserts or updates on user_id conflict).
 *
 * @param {{ user_id: string, github_user_id: number, github_username: string, access_token: string, scopes: string }} connectionData
 * @param {any} supabase
 * @returns {Promise<any>}
 */
export async function upsertConnection(connectionData, supabase) {
  const { data, error } = await supabase
    .from('github_connections')
    .upsert(
      {
        ...connectionData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Deletes a user's GitHub connection.
 *
 * @param {string} userId
 * @param {any} supabase
 * @returns {Promise<void>}
 */
export async function deleteConnection(userId, supabase) {
  const { error } = await supabase.from('github_connections').delete().eq('user_id', userId);
  if (error) throw new Error(error.message);
}
