//@ts-check
import {
  createProjectEvaluationRun,
  getProjectEvaluationRuns,
} from '$lib/server/repo/evaluationQueueRepo.js';
import { adminSupabase } from '$lib/server/supabaseAdmin.js';

const ACTIVE_STATUSES = new Set(['pending', 'running']);
const FINISHED_STATUSES = new Set(['completed', 'failed', 'cancelled']);

/**
 * @param {string | null | undefined} value
 */
function timestamp(value) {
  return value ? new Date(value).getTime() : 0;
}

/**
 * @param {any} run
 */
function requestedAt(run) {
  return timestamp(run?.created_at);
}

/**
 * @param {any} run
 */
function finishedAt(run) {
  return timestamp(run?.completed_at) || timestamp(run?.updated_at) || timestamp(run?.created_at);
}

/**
 * @param {any[]} runs
 * @param {(run: any) => boolean} predicate
 * @param {(run: any) => number} getTime
 */
function latestRun(runs, predicate, getTime) {
  return runs.filter(predicate).sort((a, b) => getTime(b) - getTime(a))[0] || null;
}

/**
 * @param {any[]} runs
 */
function buildEvaluationSummary(runs) {
  const activeRun = latestRun(runs, (run) => ACTIVE_STATUSES.has(run.status), requestedAt);
  const latestCompletedRun = latestRun(runs, (run) => run.status === 'completed', finishedAt);
  const latestFailedRun = latestRun(runs, (run) => run.status === 'failed', finishedAt);
  const latestFinishedRun = latestRun(runs, (run) => FINISHED_STATUSES.has(run.status), finishedAt);

  const activeRunIsCurrent =
    !!activeRun && (!latestFinishedRun || requestedAt(activeRun) >= finishedAt(latestFinishedRun));

  const currentRun = activeRunIsCurrent ? activeRun : latestFinishedRun;
  const latestResult =
    currentRun?.result || latestCompletedRun?.result || latestFailedRun?.result || null;
  const currentStatus = currentRun?.status || 'not_requested';

  return {
    currentStatus,
    currentRun,
    activeRun: activeRunIsCurrent ? activeRun : null,
    latestCompletedRun,
    latestFailedRun,
    latestResult,
    history: runs,
    totalRuns: runs.length,
    hasActiveRun: activeRunIsCurrent,
    canRequestNewEvaluation: !activeRunIsCurrent,
  };
}

function emptyEvaluationSummary() {
  return buildEvaluationSummary([]);
}

/**
 * @param {string} projectId
 */
export async function getProjectEvaluationSummary(projectId) {
  try {
    const runs = await getProjectEvaluationRuns(projectId, adminSupabase);
    return buildEvaluationSummary(runs);
  } catch (error) {
    console.error('Failed to load evaluation queue summary:', error);
    return emptyEvaluationSummary();
  }
}

/**
 * @param {string} projectId
 */
export async function getProjectEvaluationHistory(projectId) {
  return await getProjectEvaluationRuns(projectId, adminSupabase);
}

/**
 * @param {{ id: string, github?: string | null }} project
 */
export async function requestProjectEvaluation(project) {
  const summary = await getProjectEvaluationSummary(project.id);

  if (summary.hasActiveRun) {
    const error = new Error(
      'An evaluation request is already pending or running for this project.',
    );
    // @ts-ignore
    error.status = 409;
    throw error;
  }

  if (!project.github) {
    const error = new Error('This project needs a GitHub repository before it can be evaluated.');
    // @ts-ignore
    error.status = 400;
    throw error;
  }

  const run = await createProjectEvaluationRun(
    {
      project_id: project.id,
      github_url: project.github,
      status: 'pending',
      retry_count: 0,
    },
    adminSupabase,
  );

  return {
    run,
    summary: await getProjectEvaluationSummary(project.id),
  };
}
