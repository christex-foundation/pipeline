//@ts-check
import {
  insertEvaluationRequest,
  getActiveEvaluation,
  getEvaluationHistory,
  getLatestCompletedEvaluation,
} from '$lib/server/repo/evaluationQueueRepo.js';

/**
 * Request a new evaluation for a project.
 * Checks for an active evaluation first (app-level uniqueness).
 * The DB partial unique index is the safety net for races.
 *
 * @param {string} projectId
 * @param {string} githubUrl
 * @param {'manual'|'webhook'|'auto'} trigger
 * @param {string|null} requestedBy
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<{success: boolean, evaluation: object|null, message: string}>}
 */
export async function requestEvaluation(projectId, githubUrl, trigger, requestedBy, supabase) {
  const active = await getActiveEvaluation(projectId, supabase);

  if (active) {
    return {
      success: false,
      evaluation: active,
      message: `Evaluation already ${active.status} for this project`,
    };
  }

  try {
    const evaluation = await insertEvaluationRequest(projectId, githubUrl, trigger, requestedBy, supabase);
    return { success: true, evaluation, message: 'Evaluation requested' };
  } catch (error) {
    // Unique constraint violation — another request raced us
    if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
      const active = await getActiveEvaluation(projectId, supabase);
      return {
        success: false,
        evaluation: active,
        message: 'Evaluation already requested for this project',
      };
    }
    throw error;
  }
}

/**
 * Get full evaluation status for a project (for UI rendering).
 *
 * @param {string} projectId
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<{active: object|null, latest: object|null, history: object[]}>}
 */
export async function getEvaluationStatus(projectId, supabase) {
  const [active, latest, history] = await Promise.all([
    getActiveEvaluation(projectId, supabase),
    getLatestCompletedEvaluation(projectId, supabase),
    getEvaluationHistory(projectId, supabase),
  ]);

  return { active, latest, history };
}
