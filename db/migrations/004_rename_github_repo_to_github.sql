-- 004_rename_github_repo_to_github.sql
-- Aligns projects.github_repo with the column name used by the application
-- (validator, repo, service, and API routes all reference projects.github).
-- Safe to run multiple times (idempotent).

DO $$
DECLARE
  has_github boolean;
  has_github_repo boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'github'
  ) INTO has_github;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'github_repo'
  ) INTO has_github_repo;

  IF NOT has_github AND has_github_repo THEN
    -- Rename the legacy column in place, preserving any existing data.
    ALTER TABLE public.projects RENAME COLUMN github_repo TO github;
  ELSIF NOT has_github AND NOT has_github_repo THEN
    -- Fresh database that never had either column.
    ALTER TABLE public.projects ADD COLUMN github text NULL;
  ELSIF has_github AND has_github_repo THEN
    -- Both exist (mid-migration state). Backfill nulls from the legacy
    -- column, then drop it so future inserts only target `github`.
    UPDATE public.projects
       SET github = github_repo
     WHERE github IS NULL AND github_repo IS NOT NULL;
    ALTER TABLE public.projects DROP COLUMN github_repo;
  END IF;
  -- If only `github` exists, there is nothing to do.
END $$;
