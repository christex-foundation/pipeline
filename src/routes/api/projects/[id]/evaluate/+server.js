//@ts-check
import { json } from '@sveltejs/kit';
import { getProject } from '$lib/server/repo/projectRepo.js';
import { requestEvaluation } from '$lib/server/service/evaluationQueueService.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, locals }) {
  const { session, user: authUser } = await locals.safeGetSession();

  if (!session) {
    return json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  const project = await getProject(id, locals.supabase);

  if (!project?.id) {
    return json({ success: false, message: 'Project not found' }, { status: 404 });
  }

  if (authUser.id !== project.user_id) {
    return json(
      { success: false, message: 'Only the project creator can request evaluations' },
      { status: 403 },
    );
  }

  if (!project.github) {
    return json({ success: false, message: 'Project has no GitHub repository' }, { status: 400 });
  }

  const result = await requestEvaluation(
    project.id,
    project.github,
    'manual',
    authUser.id,
    locals.supabase,
  );

  const status = result.success ? 201 : 409;
  return json(result, { status });
}
