//@ts-check
import { getGitHubUser } from '$lib/server/providers/githubProvider.js';
import { unlinkIdentityByProvider, supabaseAdmin } from '$lib/server/providers/authProvider.js';
import {
  getConnection,
  upsertConnection,
  deleteConnection,
} from '$lib/server/repo/githubConnectionRepo.js';
import { update as updateProfile } from '$lib/server/service/profileService.js';

/**
 * Links a GitHub account to a user by storing the OAuth token and GitHub profile info.
 * Also updates the user's profile.github field with the verified username.
 *
 * @param {string} userId
 * @param {string} providerToken - GitHub OAuth access token from Supabase linkIdentity
 * @param {string} scopes - Granted OAuth scopes
 * @param {any} supabase
 * @returns {Promise<any>}
 */
export async function linkGitHub(userId, providerToken, scopes, supabase) {
  const githubUser = await getGitHubUser(providerToken);

  const connection = await upsertConnection(
    {
      user_id: userId,
      github_user_id: githubUser.id,
      github_username: githubUser.username,
      access_token: providerToken,
      scopes,
    },
    supabaseAdmin,
  );

  await updateProfile({ id: userId }, { github: githubUser.username }, supabase);

  return connection;
}

/**
 * Unlinks a user's GitHub account and clears the profile github field.
 *
 * @param {string} userId
 * @param {any} supabase
 * @returns {Promise<void>}
 */
export async function unlinkGitHub(userId, supabase) {
  await unlinkIdentityByProvider(supabase, 'github');
  await deleteConnection(userId, supabaseAdmin);
  await updateProfile({ id: userId }, { github: null }, supabase);
}

/**
 * Returns the connection status for a user.
 *
 * @param {string} userId
 * @returns {Promise<{ connected: boolean, username: string|null, connectedAt: string|null }>}
 */
export async function getConnectionStatus(userId) {
  const connection = await getConnection(userId, supabaseAdmin);
  if (!connection) {
    return { connected: false, username: null, connectedAt: null };
  }
  return {
    connected: true,
    username: connection.github_username,
    connectedAt: connection.connected_at,
  };
}
