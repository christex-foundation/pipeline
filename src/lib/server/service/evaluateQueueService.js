import {
  getEvaluationQueue,
  createEvaluationQueue,
  updateEvaluationQueue,
} from '$lib/server/repo/evaluateQueueRepo.js';

export async function getEvaluateQueue(limit, supabase) {
  const queue = await getEvaluationQueue(limit, supabase);
  return queue;
}

export async function createEvaluateQueue(queueData, supabase) {
  const queue = await createEvaluationQueue(queueData, supabase);
  return queue;
}

export async function updateEvaluateQueue(id, queueData, supabase) {
  const queue = await updateEvaluationQueue(id, queueData, supabase);
  return queue;
}
