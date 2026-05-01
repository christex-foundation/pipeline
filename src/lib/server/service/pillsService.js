//@ts-check

import { HOT_PILL_THRESHOLD } from './momentumService.js';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const FUNDING_NEEDED_RATIO = 0.25;
const TRENDING_MIN_ACTIVITY = 2;

/**
 * Pure derivation of UI signal pills from raw project data.
 * Does no I/O. Safe to call per-project in a tight loop.
 *
 * @param {object} args
 * @param {{ funding_goal?: number|null, current_funding?: number|null }} args.project
 * @param {string|Date|null|undefined} args.lastEvaluationCompletedAt
 * @param {number} [args.recentUpdateCount] - project_updates rows in last 7 days
 * @param {number} [args.recentCommentCount] - project_update_comment rows in last 7 days
 * @param {number} [args.heatScore] - momentum signal (see momentumService)
 * @param {Date} [args.now] - injectable clock for tests
 * @returns {{ newEvaluation: boolean, fundingNeeded: boolean, trending: boolean, hot: boolean }}
 */
export function derivePills({
  project,
  lastEvaluationCompletedAt,
  recentUpdateCount = 0,
  recentCommentCount = 0,
  heatScore = 0,
  now = new Date(),
}) {
  const newEvaluation = isRecentEvaluation(lastEvaluationCompletedAt, now);
  return {
    newEvaluation,
    fundingNeeded: isFundingNeeded(project),
    trending: isTrending({ newEvaluation, recentUpdateCount, recentCommentCount }),
    hot: isHot(heatScore),
  };
}

function isHot(heatScore) {
  const n = Number(heatScore);
  if (!Number.isFinite(n)) return false;
  return n >= HOT_PILL_THRESHOLD;
}

function isRecentEvaluation(completedAt, now) {
  if (!completedAt) return false;
  const completed = completedAt instanceof Date ? completedAt : new Date(completedAt);
  if (Number.isNaN(completed.getTime())) return false;
  return now.getTime() - completed.getTime() <= SEVEN_DAYS_MS;
}

function isFundingNeeded(project) {
  const goal = Number(project?.funding_goal);
  const current = Number(project?.current_funding);
  if (!Number.isFinite(goal) || goal <= 0) return false;
  if (!Number.isFinite(current)) return true;
  return current < goal * FUNDING_NEEDED_RATIO;
}

/**
 * Trending = at least 2 distinct activity events in the last 7 days, where
 * an activity is one of: a project update, a comment, or a completed evaluation.
 *
 * Heuristic, not historical momentum — requires no extra signal capture and
 * ships today.
 */
function isTrending({ newEvaluation, recentUpdateCount, recentCommentCount }) {
  const updates = Math.max(0, Number(recentUpdateCount) || 0);
  const comments = Math.max(0, Number(recentCommentCount) || 0);
  const evalActivity = newEvaluation ? 1 : 0;
  return updates + comments + evalActivity >= TRENDING_MIN_ACTIVITY;
}
