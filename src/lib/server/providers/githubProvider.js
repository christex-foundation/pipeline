//@ts-check
import { Octokit } from 'octokit';

/**
 * Creates an authenticated Octokit client for GitHub API calls.
 *
 * @param {string} accessToken - GitHub OAuth access token
 * @returns {Octokit}
 */
export function createGitHubClient(accessToken) {
  return new Octokit({ auth: accessToken });
}

/**
 * Fetches the authenticated GitHub user's profile info.
 *
 * @param {string} accessToken - GitHub OAuth access token
 * @returns {Promise<{ id: number, username: string, avatarUrl: string }>}
 */
export async function getGitHubUser(accessToken) {
  const octokit = createGitHubClient(accessToken);
  const { data } = await octokit.rest.users.getAuthenticated();
  return { id: data.id, username: data.login, avatarUrl: data.avatar_url };
}
