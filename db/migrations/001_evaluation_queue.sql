-- db/migrations/001_evaluation_queue.sql
-- Run this in the Supabase SQL Editor.
--
-- The evaluation_queue table already exists (dpg-evaluator created it).
-- Existing columns: id, project_id, github_url, status, created_at, updated_at,
--   started_at, completed_at, retry_count, error, result
--
-- This migration adds missing columns, constraints, indexes, and RLS policies.

-- ============================================================================
-- 1. Add missing columns (idempotent — safe to re-run)
-- ============================================================================

-- Who/what triggered the evaluation: 'manual', 'webhook', or 'auto'
ALTER TABLE public.evaluation_queue
  ADD COLUMN IF NOT EXISTS trigger TEXT NOT NULL DEFAULT 'manual';

-- User who requested the evaluation (null for webhook-triggered)
ALTER TABLE public.evaluation_queue
  ADD COLUMN IF NOT EXISTS requested_by UUID REFERENCES auth.users(id);

-- URL to the evaluation report (set by dpg-evaluator on completion)
ALTER TABLE public.evaluation_queue
  ADD COLUMN IF NOT EXISTS report_url TEXT;

-- Full evaluation report markdown (set by dpg-evaluator on completion)
ALTER TABLE public.evaluation_queue
  ADD COLUMN IF NOT EXISTS report_markdown TEXT;

-- ============================================================================
-- 2. Add CHECK constraints
-- ============================================================================

-- Status must be one of the defined values
-- (using DO block for idempotency — skips if constraint already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'evaluation_queue_status_check'
      AND conrelid = 'public.evaluation_queue'::regclass
  ) THEN
    ALTER TABLE public.evaluation_queue
      ADD CONSTRAINT evaluation_queue_status_check
      CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled'));
  END IF;
END $$;

-- Trigger must be one of the defined values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'evaluation_queue_trigger_check'
      AND conrelid = 'public.evaluation_queue'::regclass
  ) THEN
    ALTER TABLE public.evaluation_queue
      ADD CONSTRAINT evaluation_queue_trigger_check
      CHECK (trigger IN ('manual', 'webhook', 'auto'));
  END IF;
END $$;

-- ============================================================================
-- 3. Add indexes (IF NOT EXISTS — safe to re-run)
-- ============================================================================

-- Safety net: only one active evaluation per project at a time
CREATE UNIQUE INDEX IF NOT EXISTS evaluation_queue_one_active_per_project
  ON public.evaluation_queue (project_id)
  WHERE status IN ('pending', 'running');

-- Index for polling pending jobs (used by dpg-evaluator)
CREATE INDEX IF NOT EXISTS evaluation_queue_status_created
  ON public.evaluation_queue (status, created_at)
  WHERE status = 'pending';

-- Index for project history lookups
CREATE INDEX IF NOT EXISTS evaluation_queue_project_id
  ON public.evaluation_queue (project_id, created_at DESC);

-- ============================================================================
-- 4. RLS policies
-- ============================================================================

ALTER TABLE public.evaluation_queue ENABLE ROW LEVEL SECURITY;

-- Anyone can read evaluation queue entries (public project pages need this)
-- Drop first for idempotency, then create
DROP POLICY IF EXISTS "evaluation_queue_select" ON public.evaluation_queue;
CREATE POLICY "evaluation_queue_select"
  ON public.evaluation_queue FOR SELECT
  USING (true);

-- Only authenticated users can insert evaluation requests.
-- Ownership is enforced at the API layer; this prevents anonymous abuse via PostgREST.
-- dpg-evaluator uses service_role, so it bypasses RLS and doesn't need a policy.
DROP POLICY IF EXISTS "evaluation_queue_insert" ON public.evaluation_queue;
CREATE POLICY "evaluation_queue_insert"
  ON public.evaluation_queue FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only service_role can update (dpg-evaluator uses service key).
-- No UPDATE policy for anon/authenticated = only service_role can update.
