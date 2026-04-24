//@ts-check
import { getProject } from '$lib/server/repo/projectRepo.js';
import { createIssue, fileExists } from '$lib/server/service/githubApiService.js';

/**
 * Hardcoded map of file-oriented DPG criteria to the file slots that satisfy
 * them. A slot is satisfied if *any* of its `accepts` paths exists in the repo.
 * The `canonical` name is what we surface to the user as the suggested filename
 * when the slot is missing.
 *
 * Criteria not in this map are considered non-file-based; the UI hides the
 * "Check missing files" button for them.
 *
 * @type {Record<string, Array<{ canonical: string, accepts: string[] }>>}
 */
export const CRITERION_REQUIRED_FILES = {
  'Use of Approved Open Licenses': [
    { canonical: 'LICENSE', accepts: ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'COPYING'] },
  ],
  Documentation: [
    { canonical: 'README.md', accepts: ['README.md', 'README', 'README.rst', 'README.txt'] },
    { canonical: 'CONTRIBUTING.md', accepts: ['CONTRIBUTING.md', 'CONTRIBUTING'] },
  ],
};

/**
 * Extracts `{ owner, repo }` from a GitHub URL like `https://github.com/a/b`.
 * Trailing `.git`, query strings, and fragments are stripped.
 *
 * @param {string | null | undefined} url
 * @returns {{ owner: string, repo: string } | null}
 */
function parseGithubUrl(url) {
  if (!url) return null;
  const match = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

/**
 * Loads a project, asserts the caller owns it.
 *
 * @param {string} userId
 * @param {string} projectId
 * @param {any} supabase
 */
async function getOwnedProject(userId, projectId, supabase) {
  const project = await getProject(projectId, supabase);
  if (!project?.id) {
    const err = new Error('Project not found');
    // @ts-ignore
    err.status = 404;
    throw err;
  }
  if (project.user_id !== userId) {
    const err = new Error('Only the project owner can perform this action');
    // @ts-ignore
    err.status = 403;
    throw err;
  }
  return project;
}

/**
 * For a failed file-oriented criterion, returns the list of canonical
 * filenames that are missing from the project's GitHub repo.
 *
 * @param {string} userId
 * @param {string} projectId
 * @param {string} criterion
 * @param {any} supabase
 * @returns {Promise<{ missing: string[], owner: string, repo: string }>}
 */
export async function listMissingFiles(userId, projectId, criterion, supabase) {
  const slots = CRITERION_REQUIRED_FILES[criterion];
  if (!slots) {
    const err = new Error('Criterion is not file-based');
    // @ts-ignore
    err.status = 400;
    throw err;
  }

  const project = await getOwnedProject(userId, projectId, supabase);
  const parsed = parseGithubUrl(project.github_repo);
  if (!parsed) {
    const err = new Error('Project has no valid GitHub repo URL');
    // @ts-ignore
    err.status = 400;
    throw err;
  }

  const statusEntry = project.dpgStatus?.status?.find((s) => s.name === criterion);
  if (!statusEntry || statusEntry.overallScore === 1) {
    const err = new Error('Criterion is not in a failed state');
    // @ts-ignore
    err.status = 400;
    throw err;
  }

  const missing = [];
  for (const slot of slots) {
    const checks = await Promise.all(
      slot.accepts.map((path) =>
        fileExists(userId, { owner: parsed.owner, repo: parsed.repo, path }, supabase),
      ),
    );
    if (!checks.some(Boolean)) {
      missing.push(slot.canonical);
    }
  }

  return { missing, owner: parsed.owner, repo: parsed.repo };
}

/**
 * Creates a GitHub issue in the project's repo for a specific missing file.
 * The filename must be one of the canonical names for the given criterion.
 *
 * @param {string} userId
 * @param {string} projectId
 * @param {string} criterion
 * @param {string} filename
 * @param {any} supabase
 * @returns {Promise<{ url: string, number: number }>}
 */
export async function createIssueForMissingFile(
  userId,
  projectId,
  criterion,
  filename,
  supabase,
) {
  const slots = CRITERION_REQUIRED_FILES[criterion];
  if (!slots) {
    const err = new Error('Criterion is not file-based');
    // @ts-ignore
    err.status = 400;
    throw err;
  }

  const canonicalNames = slots.map((s) => s.canonical);
  if (!canonicalNames.includes(filename)) {
    const err = new Error('Filename is not associated with this criterion');
    // @ts-ignore
    err.status = 400;
    throw err;
  }

  const project = await getOwnedProject(userId, projectId, supabase);
  const parsed = parseGithubUrl(project.github_repo);
  if (!parsed) {
    const err = new Error('Project has no valid GitHub repo URL');
    // @ts-ignore
    err.status = 400;
    throw err;
  }

  const title = `Add ${filename} for DPG registry compliance`;
  const body = [
    `This repository is missing \`${filename}\`, which is required for Digital Public Goods (DPG) registry compliance under the **${criterion}** standard.`,
    '',
    `Please add a \`${filename}\` file to the repository root.`,
    '',
    `_Opened automatically from the DPG Pipeline platform._`,
  ].join('\n');

  const issue = await createIssue(
    userId,
    { owner: parsed.owner, repo: parsed.repo, title, body },
    supabase,
  );

  return { url: issue.html_url, number: issue.number };
}
