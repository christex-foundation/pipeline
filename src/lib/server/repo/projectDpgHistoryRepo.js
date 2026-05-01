//@ts-check

/**
 * `project_dpg_history` is created by `db/schema/migrations/0001_project_dpg_history.sql`.
 * Until that migration is applied, every read returns an empty Map and every
 * write logs once and silently no-ops, so downstream code (Heat Score / Hot
 * pill) just degrades to "no momentum data" rather than crashing.
 *
 * This is a deliberate `try/catch` rather than a feature flag — Supabase
 * doesn't give us a cheap "does this table exist" probe, and the migration
 * is operator-controlled.
 */

let warnedOnce = false;
function warnMissingTable(scope, error) {
  if (warnedOnce) return;
  warnedOnce = true;
  console.warn(
    `[projectDpgHistoryRepo:${scope}] table query failed (likely missing migration ` +
      `0001_project_dpg_history). Heat Score will return zero until applied. ` +
      `Original error: ${error?.message ?? error}`,
  );
}

/**
 * Record one DPG-score snapshot for a project.
 * Best-effort: failures are logged once and swallowed.
 *
 * @param {string} projectId
 * @param {number} dpgScore - integer 0..9
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<void>}
 */
export async function recordDpgScore(projectId, dpgScore, supabase) {
  if (!projectId || !Number.isFinite(dpgScore)) return;
  const clamped = Math.max(0, Math.min(9, Math.floor(dpgScore)));

  try {
    const { error } = await supabase
      .from('project_dpg_history')
      .insert({ project_id: projectId, dpg_score: clamped });
    if (error) warnMissingTable('recordDpgScore', error);
  } catch (err) {
    warnMissingTable('recordDpgScore', err);
  }
}

/**
 * For each project, return the DPG-score delta over the window starting at
 * `sinceDate`: `current_score - oldest_score_in_window`. A positive delta
 * means the project gained criteria; negative means it lost some.
 *
 * Implemented as one round-trip: select all rows in window for all projects,
 * then group + reduce client-side. The (project_id, recorded_at DESC) index
 * keeps this fast.
 *
 * @param {string[]} projectIds
 * @param {Date} sinceDate
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<Map<string, number>>}
 */
export async function getDpgScoreDeltasByProjectIds(projectIds, sinceDate, supabase) {
  const result = new Map();
  if (!Array.isArray(projectIds) || projectIds.length === 0) return result;

  let rows;
  try {
    const { data, error } = await supabase
      .from('project_dpg_history')
      .select('project_id, dpg_score, recorded_at')
      .in('project_id', projectIds)
      .gte('recorded_at', sinceDate.toISOString())
      .order('recorded_at', { ascending: true });
    if (error) {
      warnMissingTable('getDpgScoreDeltasByProjectIds', error);
      return result;
    }
    rows = data ?? [];
  } catch (err) {
    warnMissingTable('getDpgScoreDeltasByProjectIds', err);
    return result;
  }

  // Group by project_id; first row is oldest in window, last row is newest.
  /** @type {Map<string, { oldest: number, newest: number }>} */
  const grouped = new Map();
  for (const row of rows) {
    if (!row?.project_id) continue;
    const score = Number(row.dpg_score) || 0;
    const existing = grouped.get(row.project_id);
    if (!existing) {
      grouped.set(row.project_id, { oldest: score, newest: score });
    } else {
      existing.newest = score;
    }
  }

  for (const [id, { oldest, newest }] of grouped) {
    result.set(id, newest - oldest);
  }
  return result;
}
