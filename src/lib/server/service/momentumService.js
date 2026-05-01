//@ts-check

/**
 * Heat Score — a "Product Hunt"-style momentum signal for the explore feed.
 *
 * Adapted from PRD v2's formula:
 *   (dpg_score_improvement * 2.0) + (comment_count * 1.5) - days_since_last_commit
 *
 * Substitutions for signals we don't yet capture:
 *   - "comment_count" → comments on a project's update timeline in the last 7 days
 *   - "days_since_last_commit" → days since last in-product activity (most recent
 *     project update OR most recent completed evaluation), with a small `* 0.5`
 *     coefficient so the decay term doesn't crush projects that aren't in
 *     constant motion
 *
 * We add a third positive term — recent project updates — to give weight to
 * maintainers who post status without waiting on someone else to comment.
 *
 * Formula:
 *   heat = 2.0 * dpgScoreDelta30d
 *        + 1.5 * recentCommentCount
 *        + 1.0 * recentUpdateCount
 *        - 0.5 * daysSinceLastActivity
 *
 * Returns a finite number. Inputs are coerced — non-numeric / null become 0.
 *
 * @param {object} args
 * @param {number} [args.dpgScoreDelta30d] - current_score - oldest_score in 30d window
 * @param {number} [args.recentCommentCount] - comments in last 7 days
 * @param {number} [args.recentUpdateCount] - project_updates in last 7 days
 * @param {number} [args.daysSinceLastActivity] - days since last update or eval
 * @returns {number}
 */
export function computeHeatScore({
  dpgScoreDelta30d = 0,
  recentCommentCount = 0,
  recentUpdateCount = 0,
  daysSinceLastActivity = Infinity,
} = {}) {
  const delta = num(dpgScoreDelta30d);
  const comments = nonNeg(recentCommentCount);
  const updates = nonNeg(recentUpdateCount);
  const decay = nonNeg(Number.isFinite(daysSinceLastActivity) ? daysSinceLastActivity : 365);

  return 2.0 * delta + 1.5 * comments + 1.0 * updates - 0.5 * decay;
}

/**
 * Threshold above which a project is "hot" enough to surface a Hot pill on
 * its card. Tuned so that mild positive activity (e.g. 2 recent updates +
 * fresh activity) doesn't crowd the feed, but real motion does.
 */
export const HOT_PILL_THRESHOLD = 3;

/**
 * Compute days between `now` and the most recent activity timestamp for a
 * project. Returns Infinity when neither source has a value, so the decay
 * term in `computeHeatScore` will cap at 365.
 *
 * @param {Date|string|null|undefined} lastUpdateAt
 * @param {Date|string|null|undefined} lastEvaluationAt
 * @param {Date} [now]
 * @returns {number}
 */
export function daysSinceLastActivity(lastUpdateAt, lastEvaluationAt, now = new Date()) {
  const latest = mostRecent(lastUpdateAt, lastEvaluationAt);
  if (!latest) return Infinity;
  const diffMs = now.getTime() - latest.getTime();
  return Math.max(0, diffMs / (24 * 60 * 60 * 1000));
}

function mostRecent(a, b) {
  const da = toDate(a);
  const db = toDate(b);
  if (da && db) return da.getTime() > db.getTime() ? da : db;
  return da || db || null;
}

function toDate(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function nonNeg(v) {
  return Math.max(0, num(v));
}
