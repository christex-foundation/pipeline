-- db/migrations/003_project_comment.sql
-- Run this in the Supabase SQL Editor.
--
-- Adds the project_comment table: flat, per-project comments.
-- v1 has no edit/delete UI, but deleted_at is present so admins / future
-- moderation can hide rows without schema churn.
--
-- Safe to re-run (all statements are idempotent).

-- ============================================================================
-- 1. Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.project_comment (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    user_id uuid NOT NULL,
    body text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone NULL,
    CONSTRAINT project_comment_pkey PRIMARY KEY (id),
    CONSTRAINT project_comment_project_id_fkey
      FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
    CONSTRAINT project_comment_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- ============================================================================
-- 2. Indexes
-- ============================================================================

-- Main list query: comments for a project, newest first, excluding soft-deleted.
CREATE INDEX IF NOT EXISTS project_comment_project_created
  ON public.project_comment (project_id, created_at DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- 3. RLS policies
-- ============================================================================

ALTER TABLE public.project_comment ENABLE ROW LEVEL SECURITY;

-- Public read. Soft-deleted rows are filtered at the API layer (and by the
-- partial index above); RLS stays simple so service_role tooling still sees them.
DROP POLICY IF EXISTS "project_comment_select" ON public.project_comment;
CREATE POLICY "project_comment_select"
  ON public.project_comment FOR SELECT
  USING (true);

-- Only authenticated users can insert, and only as themselves.
-- WITH CHECK binds the row's user_id to the caller's JWT so a client cannot
-- post on someone else's behalf via the anon key.
DROP POLICY IF EXISTS "project_comment_insert" ON public.project_comment;
CREATE POLICY "project_comment_insert"
  ON public.project_comment FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- No UPDATE / DELETE policies: v1 has no edit or delete path.
-- Admin moderation will go through service_role, which bypasses RLS.
