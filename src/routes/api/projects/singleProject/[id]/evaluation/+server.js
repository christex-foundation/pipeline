//@ts-check
import {
  getProjectEvaluationSummary,
  requestProjectEvaluation,
} from '$lib/server/service/evaluationQueueService.js';
import { getProjectByIdForEvaluation } from '$lib/server/service/projectService.js';
import { adminSupabase } from '$lib/server/supabaseAdmin.js';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
  try {
    const summary = await getProjectEvaluationSummary(params.id);
    return json({ evaluation: summary }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ params, locals }) {
  try {
    const user = locals.authUser;

    if (!user) {
      return json({ error: 'Authentication is required.' }, { status: 401 });
    }

    const project = await getProjectByIdForEvaluation(params.id, adminSupabase);

    if (!project) {
      return json({ error: 'Project not found.' }, { status: 404 });
    }

    if (project.user_id !== user.id) {
      return json(
        { error: 'Only the project creator can request an evaluation.' },
        { status: 403 },
      );
    }

    const evaluation = await requestProjectEvaluation(project);

    return json(
      {
        success: true,
        evaluation,
      },
      { status: 201 },
    );
  } catch (error) {
    // @ts-ignore
    const status = error.status || 500;
    return json({ error: error.message }, { status });
  }
}
