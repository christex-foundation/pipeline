//@ts-check
import { createGitHubClient } from '$lib/server/providers/githubProvider.js';
import { getAccessToken } from '$lib/server/service/githubConnectionService.js';
import {
  createIssueSchema,
  updateIssueSchema,
  listIssuesSchema,
  createPullRequestSchema,
  updatePullRequestSchema,
  mergePullRequestSchema,
  listPullRequestsSchema,
} from '$lib/server/validator/githubSchema.js';

/**
 * Returns an authenticated Octokit client for the given user.
 * Throws if the user has not linked their GitHub account.
 *
 * @param {string} userId
 * @param {any} supabase
 */
async function getClientForUser(userId, supabase) {
  const token = await getAccessToken(userId, supabase);
  if (!token) {
    const err = new Error('GitHub account not linked. Please connect your GitHub account first.');
    // @ts-ignore
    err.status = 403;
    throw err;
  }
  return createGitHubClient(token);
}

// ─── Issues ──────────────────────────────────────────────────────────────────

/**
 * Creates a new issue on a GitHub repository.
 *
 * @param {string} userId
 * @param {unknown} params
 * @param {any} supabase
 */
export async function createIssue(userId, params, supabase) {
  const { owner, repo, title, body, labels, assignees } = createIssueSchema.parse(params);
  const octokit = await getClientForUser(userId, supabase);

  const { data } = await octokit.rest.issues.create({
    owner,
    repo,
    title,
    body,
    labels,
    assignees,
  });

  return data;
}

/**
 * Updates the state of an issue (open/close).
 *
 * @param {string} userId
 * @param {unknown} params
 * @param {any} supabase
 */
export async function updateIssueState(userId, params, supabase) {
  const { owner, repo, issue_number, state } = updateIssueSchema.parse(params);
  const octokit = await getClientForUser(userId, supabase);

  const { data } = await octokit.rest.issues.update({
    owner,
    repo,
    issue_number,
    state,
  });

  return data;
}

/**
 * Lists issues for a GitHub repository.
 *
 * @param {string} userId
 * @param {unknown} params
 * @param {any} supabase
 */
export async function listIssues(userId, params, supabase) {
  const { owner, repo, state, page, per_page } = listIssuesSchema.parse(params);
  const octokit = await getClientForUser(userId, supabase);

  const { data } = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    state,
    page,
    per_page,
  });

  // Filter out pull requests (GitHub API returns PRs as issues too)
  return data.filter((issue) => !issue.pull_request);
}

// ─── Pull Requests ───────────────────────────────────────────────────────────

/**
 * Creates a new pull request.
 *
 * @param {string} userId
 * @param {unknown} params
 * @param {any} supabase
 */
export async function createPullRequest(userId, params, supabase) {
  const { owner, repo, title, body, head, base, draft } = createPullRequestSchema.parse(params);
  const octokit = await getClientForUser(userId, supabase);

  const { data } = await octokit.rest.pulls.create({
    owner,
    repo,
    title,
    body,
    head,
    base,
    draft,
  });

  return data;
}

/**
 * Updates the state of a pull request (open/close).
 *
 * @param {string} userId
 * @param {unknown} params
 * @param {any} supabase
 */
export async function updatePullRequestState(userId, params, supabase) {
  const { owner, repo, pull_number, state } = updatePullRequestSchema.parse(params);
  const octokit = await getClientForUser(userId, supabase);

  const { data } = await octokit.rest.pulls.update({
    owner,
    repo,
    pull_number,
    state,
  });

  return data;
}

/**
 * Merges a pull request.
 *
 * @param {string} userId
 * @param {unknown} params
 * @param {any} supabase
 */
export async function mergePullRequest(userId, params, supabase) {
  const { owner, repo, pull_number, merge_method, commit_title, commit_message } =
    mergePullRequestSchema.parse(params);
  const octokit = await getClientForUser(userId, supabase);

  const { data } = await octokit.rest.pulls.merge({
    owner,
    repo,
    pull_number,
    merge_method,
    commit_title,
    commit_message,
  });

  return data;
}

/**
 * Lists pull requests for a GitHub repository.
 *
 * @param {string} userId
 * @param {unknown} params
 * @param {any} supabase
 */
export async function listPullRequests(userId, params, supabase) {
  const { owner, repo, state, page, per_page } = listPullRequestsSchema.parse(params);
  const octokit = await getClientForUser(userId, supabase);

  const { data } = await octokit.rest.pulls.list({
    owner,
    repo,
    state,
    page,
    per_page,
  });

  return data;
}
