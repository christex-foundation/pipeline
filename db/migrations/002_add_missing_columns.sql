-- 002_add_missing_columns.sql
-- Adds columns that exist in the live database but were missing from schema.sql.
-- Safe to run multiple times (idempotent).

-- ============================================================================
-- 1. profile: add banner and social link columns
-- ============================================================================

ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS banner text;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS discord text;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS twitter text;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS web text;

-- ============================================================================
-- 2. projects: add published_at and dpgStatus columns
-- ============================================================================

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS published_at timestamp with time zone;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS "dpgStatus" jsonb;

-- ============================================================================
-- 3. project_dpg_status: add score and explanation columns
-- ============================================================================

ALTER TABLE public.project_dpg_status ADD COLUMN IF NOT EXISTS score numeric;
ALTER TABLE public.project_dpg_status ADD COLUMN IF NOT EXISTS explanation text;
