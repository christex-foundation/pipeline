-- Migration: project_dpg_history
--
-- Records DPG-score snapshots over time so we can compute deltas (the
-- "momentum" / "Heat Score" ranking signal). Without history, every project
-- looks identical from a momentum standpoint, so the Hot pill never fires
-- and `?sort=heat` returns the same order as `?sort=created_at`.
--
-- One row per snapshot. Each row is keyed by (project_id, recorded_at).
-- The hot path is "give me the oldest score in the last N days for a list of
-- project IDs" — covered by the (project_id, recorded_at) index.
--
-- Apply this once via the Supabase SQL editor. Safe to re-run: the table
-- creation is idempotent and the backfill only inserts rows for projects
-- that don't already have a baseline snapshot.

CREATE TABLE IF NOT EXISTS public.project_dpg_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  dpg_score smallint NOT NULL,
  recorded_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT project_dpg_history_pkey PRIMARY KEY (id),
  CONSTRAINT project_dpg_history_project_id_fkey
    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
  CONSTRAINT project_dpg_history_score_range CHECK (dpg_score >= 0 AND dpg_score <= 9)
);

CREATE INDEX IF NOT EXISTS project_dpg_history_project_recorded_idx
  ON public.project_dpg_history (project_id, recorded_at DESC);

-- Backfill: one baseline snapshot per evaluated project, computed from the
-- current `dpgStatus` jsonb. Skips projects that already have a row so this
-- is safe to re-run.
INSERT INTO public.project_dpg_history (project_id, dpg_score, recorded_at)
SELECT
  p.id,
  COALESCE(
    (
      SELECT COUNT(*)::smallint
      FROM jsonb_array_elements(p."dpgStatus" -> 'status') AS s
      WHERE COALESCE((s ->> 'overallScore')::int, 0) = 1
    ),
    0
  ),
  COALESCE(p.updated_at, p.created_at, now())
FROM public.projects p
WHERE p."dpgStatus" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.project_dpg_history h WHERE h.project_id = p.id
  );

-- RLS: allow anyone to read (scores are public); only authenticated users
-- can insert. This matches the existing `dpg_status` table's posture.
ALTER TABLE public.project_dpg_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS project_dpg_history_select_all ON public.project_dpg_history;
CREATE POLICY project_dpg_history_select_all
  ON public.project_dpg_history FOR SELECT
  USING (true);

DROP POLICY IF EXISTS project_dpg_history_insert_authenticated ON public.project_dpg_history;
CREATE POLICY project_dpg_history_insert_authenticated
  ON public.project_dpg_history FOR INSERT
  TO authenticated
  WITH CHECK (true);
