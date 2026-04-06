-- db/migrations/001_evaluation_queue.sql
-- Run this in the Supabase SQL Editor.
-- The evaluation_queue table may already exist (dpg-evaluator writes to it).
-- This migration formalizes the schema and adds constraints.

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.evaluation_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  github_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  trigger TEXT NOT NULL DEFAULT 'manual'
    CHECK (trigger IN ('manual', 'webhook', 'auto')),
  requested_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  result JSONB,
  error TEXT,
  report_url TEXT,
  report_markdown TEXT
);

-- Safety net: only one active evaluation per project
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

-- RLS policies
ALTER TABLE public.evaluation_queue ENABLE ROW LEVEL SECURITY;

-- Anyone can read evaluation queue entries (public data, needed for project pages)
CREATE POLICY "evaluation_queue_select"
  ON public.evaluation_queue FOR SELECT
  USING (true);

-- Anyone can insert evaluation requests (webhook has no user session;
-- ownership is enforced at the API layer, not RLS)
CREATE POLICY "evaluation_queue_insert"
  ON public.evaluation_queue FOR INSERT
  WITH CHECK (true);

-- Only service role can update (dpg-evaluator uses service key)
-- No UPDATE policy for anon/authenticated means only service_role can update.
