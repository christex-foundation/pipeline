//@ts-check
import { json } from '@sveltejs/kit';
import { getProject } from '$lib/server/repo/projectRepo.js';
import { getRecentActivity } from '$lib/server/service/githubActivityService.js';
import { parseGithubRepo } from '$lib/utils/github.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
  const { id } = params;
  const project = await getProject(id, locals.supabase);

  if (!project?.id) {
    return json({ error: 'Project not found' }, { status: 404 });
  }

  const githubUrl = project.github ?? project.github_repo;
  const parsed = parseGithubRepo(githubUrl);
  if (!parsed) {
    return json(
      {
        commits: [],
        pullRequests: [],
        fromCache: false,
        error: 'No GitHub URL on project',
      },
      { status: 404 },
    );
  }

  const result = await getRecentActivity(parsed.owner, parsed.repo);
  return json(result);
}
