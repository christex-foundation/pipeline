//@ts-check
import { json } from '@sveltejs/kit';
import { getEvaluationStatus } from '$lib/server/service/evaluationQueueService.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
  const { id } = params;

  const result = await getEvaluationStatus(id, locals.supabase);

  return json(result);
}
