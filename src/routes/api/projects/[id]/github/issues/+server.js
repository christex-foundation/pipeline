//@ts-check
import { json } from '@sveltejs/kit';
import { getProject } from '$lib/server/repo/projectRepo.js';
import { getGoodFirstIssues } from '$lib/server/service/githubIssuesService.js';
import { parseGithubRepo } from '$lib/utils/github.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
  const { id } = params;
  const project = await getProject(id, locals.supabase);

  if (!project?.id) {
    return json({ error: 'Project not found' }, { status: 404 });
  }

  // The deployed schema names this column `github` (validator + repo + UI all
  // use this name). The legacy `github_repo` column in db/schema/schema.sql is
  // stale; fall back to it just in case.
  const githubUrl = project.github ?? project.github_repo;
  const parsed = parseGithubRepo(githubUrl);
  if (!parsed) {
    return json(
      { issues: [], count: 0, fromCache: false, error: 'No GitHub URL on project' },
      { status: 404 },
    );
  }

  const result = await getGoodFirstIssues(parsed.owner, parsed.repo);
  return json(result);
}
