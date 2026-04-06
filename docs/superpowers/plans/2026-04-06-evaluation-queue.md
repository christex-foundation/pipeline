# Evaluation Queue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Pipeline's BullMQ-based evaluation system with a persistent Supabase `evaluation_queue` table, add a manual "Request Evaluation" UI in the DPG Assessment tab, and remove all dead AI/queue infrastructure.

**Architecture:** Pipeline writes evaluation requests to an `evaluation_queue` table in Supabase. dpg-evaluator (separate repo, not modified here) will poll and process these requests. Pipeline shows queue status and history in the project's DPG Assessment tab. The existing BullMQ worker, OpenAI aiService, and related infrastructure are removed entirely.

**Tech Stack:** SvelteKit, Supabase (PostgreSQL), Svelte stores, existing shadcn/ui components.

**Spec:** `docs/superpowers/specs/2026-04-06-evaluation-queue-design.md`

---

## File Structure

### New files

| File | Responsibility |
|---|---|
| `src/lib/server/repo/evaluationQueueRepo.js` | Direct Supabase queries for `evaluation_queue` table |
| `src/lib/server/service/evaluationQueueService.js` | Business logic: request evaluation, get status |
| `src/routes/api/projects/[id]/evaluate/+server.js` | POST endpoint: request evaluation |
| `src/routes/api/projects/[id]/evaluations/+server.js` | GET endpoint: evaluation status/history |
| `db/migrations/001_evaluation_queue.sql` | Migration SQL for Supabase dashboard |

### Modified files

| File | Change |
|---|---|
| `src/lib/server/service/projectService.js` | Replace queue enqueue with evaluation queue insert |
| `src/lib/server/service/githubWebhookService.js` | Replace queue enqueue, remove evaluateProject/getDpgSimilarProjects |
| `src/lib/server/providers/index.js` | Remove queue and AI exports |
| `src/lib/server/config.js` | Remove Redis and OpenAI config |
| `src/hooks.server.js` | Remove BullMQ worker |
| `src/routes/project/[id]/+page.js` | Fetch evaluation status |
| `src/routes/project/[id]/+page.svelte` | Pass isOwner and evaluations to dpgStatus |
| `src/lib/dpgStatus.svelte` | Add evaluation request button, status, history |
| `db/schema/schema.sql` | Add evaluation_queue table definition |
| `package.json` | Remove bullmq, openai, axios |

### Deleted files

| File | Reason |
|---|---|
| `src/lib/server/providers/queueProvider.js` | BullMQ — replaced by Supabase table |
| `src/lib/server/providers/inMemoryQueue.js` | Fallback queue — no longer needed |
| `src/lib/server/providers/aiProvider.js` | OpenAI client — evaluation moved to dpg-evaluator |
| `src/lib/server/service/aiService.js` | DPG evaluation logic — moved to dpg-evaluator |
| `src/lib/server/service/dpgStatusService.js` | Thin wrapper — no longer called |
| `src/lib/server/github.js` | GitHub file fetching — all consumers removed |
| `src/routes/api/ai/+server.js` | Inline evaluation endpoint — dead code |
| `src/routes/api/github/+server.js` | Manual evaluation trigger — dead code |
| `src/routes/api/github/match/+server.js` | DPG similarity matching — dead code |

---

## Task 1: Migration SQL and schema

**Files:**
- Create: `db/migrations/001_evaluation_queue.sql`
- Modify: `db/schema/schema.sql`

- [ ] **Step 1: Create migration file**

```sql
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

-- Authenticated users can read all evaluation queue entries
CREATE POLICY "evaluation_queue_select"
  ON public.evaluation_queue FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert evaluation requests
CREATE POLICY "evaluation_queue_insert"
  ON public.evaluation_queue FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only service role can update (dpg-evaluator uses service key)
-- No UPDATE policy for authenticated role means only service_role can update.
```

- [ ] **Step 2: Add evaluation_queue to schema.sql**

Add the table definition to `db/schema/schema.sql` after the `project_dpg_status` table (around line 92). This keeps the schema file in sync with the live database.

Add after the `project_dpg_status` table block:

```sql
CREATE TABLE IF NOT EXISTS public.evaluation_queue (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    github_url text NOT NULL,
    status text NOT NULL DEFAULT 'pending'::text,
    trigger text NOT NULL DEFAULT 'manual'::text,
    requested_by uuid NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    started_at timestamp with time zone NULL,
    completed_at timestamp with time zone NULL,
    retry_count integer DEFAULT 0,
    result jsonb NULL,
    error text NULL,
    report_url text NULL,
    report_markdown text NULL,
    CONSTRAINT evaluation_queue_pkey PRIMARY KEY (id),
    CONSTRAINT evaluation_queue_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT evaluation_queue_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES auth.users(id),
    CONSTRAINT evaluation_queue_status_check CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    CONSTRAINT evaluation_queue_trigger_check CHECK (trigger IN ('manual', 'webhook', 'auto'))
);
```

- [ ] **Step 3: Commit**

```bash
git add db/migrations/001_evaluation_queue.sql db/schema/schema.sql
git commit -m "feat: add evaluation_queue schema and migration SQL"
```

---

## Task 2: Repo layer

**Files:**
- Create: `src/lib/server/repo/evaluationQueueRepo.js`

- [ ] **Step 1: Create the repo file**

```js
//@ts-check

/**
 * Insert a new evaluation request.
 * @param {string} projectId
 * @param {string} githubUrl
 * @param {'manual'|'webhook'|'auto'} trigger
 * @param {string|null} requestedBy - auth user UUID or null
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<object>}
 */
export async function insertEvaluationRequest(projectId, githubUrl, trigger, requestedBy, supabase) {
  const { data, error } = await supabase
    .from('evaluation_queue')
    .insert({
      project_id: projectId,
      github_url: githubUrl,
      trigger,
      requested_by: requestedBy,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Get the active (pending or running) evaluation for a project.
 * @param {string} projectId
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<object|null>}
 */
export async function getActiveEvaluation(projectId, supabase) {
  const { data, error } = await supabase
    .from('evaluation_queue')
    .select('*')
    .eq('project_id', projectId)
    .in('status', ['pending', 'running'])
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Get evaluation history for a project, newest first.
 * @param {string} projectId
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {number} [limit=10]
 * @returns {Promise<object[]>}
 */
export async function getEvaluationHistory(projectId, supabase, limit = 10) {
  const { data, error } = await supabase
    .from('evaluation_queue')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Get the latest completed evaluation for a project.
 * @param {string} projectId
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<object|null>}
 */
export async function getLatestCompletedEvaluation(projectId, supabase) {
  const { data, error } = await supabase
    .from('evaluation_queue')
    .select('*')
    .eq('project_id', projectId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/server/repo/evaluationQueueRepo.js
git commit -m "feat: add evaluation queue repo layer"
```

---

## Task 3: Service layer

**Files:**
- Create: `src/lib/server/service/evaluationQueueService.js`

- [ ] **Step 1: Create the service file**

```js
//@ts-check
import {
  insertEvaluationRequest,
  getActiveEvaluation,
  getEvaluationHistory,
  getLatestCompletedEvaluation,
} from '$lib/server/repo/evaluationQueueRepo.js';

/**
 * Request a new evaluation for a project.
 * Checks for an active evaluation first (app-level uniqueness).
 * The DB partial unique index is the safety net for races.
 *
 * @param {string} projectId
 * @param {string} githubUrl
 * @param {'manual'|'webhook'|'auto'} trigger
 * @param {string|null} requestedBy
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<{success: boolean, evaluation: object|null, message: string}>}
 */
export async function requestEvaluation(projectId, githubUrl, trigger, requestedBy, supabase) {
  const active = await getActiveEvaluation(projectId, supabase);

  if (active) {
    return {
      success: false,
      evaluation: active,
      message: `Evaluation already ${active.status} for this project`,
    };
  }

  try {
    const evaluation = await insertEvaluationRequest(projectId, githubUrl, trigger, requestedBy, supabase);
    return { success: true, evaluation, message: 'Evaluation requested' };
  } catch (error) {
    // Unique constraint violation — another request raced us
    if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
      const active = await getActiveEvaluation(projectId, supabase);
      return {
        success: false,
        evaluation: active,
        message: 'Evaluation already requested for this project',
      };
    }
    throw error;
  }
}

/**
 * Get full evaluation status for a project (for UI rendering).
 *
 * @param {string} projectId
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<{active: object|null, latest: object|null, history: object[]}>}
 */
export async function getEvaluationStatus(projectId, supabase) {
  const [active, latest, history] = await Promise.all([
    getActiveEvaluation(projectId, supabase),
    getLatestCompletedEvaluation(projectId, supabase),
    getEvaluationHistory(projectId, supabase),
  ]);

  return { active, latest, history };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/server/service/evaluationQueueService.js
git commit -m "feat: add evaluation queue service layer"
```

---

## Task 4: API endpoints

**Files:**
- Create: `src/routes/api/projects/[id]/evaluate/+server.js`
- Create: `src/routes/api/projects/[id]/evaluations/+server.js`

- [ ] **Step 1: Create the POST evaluate endpoint**

```js
//@ts-check
import { json } from '@sveltejs/kit';
import { getProject } from '$lib/server/repo/projectRepo.js';
import { requestEvaluation } from '$lib/server/service/evaluationQueueService.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, locals }) {
  const { session, user: authUser } = await locals.safeGetSession();

  if (!session) {
    return json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  const project = await getProject(id, locals.supabase);

  if (!project?.id) {
    return json({ success: false, message: 'Project not found' }, { status: 404 });
  }

  if (authUser.id !== project.user_id) {
    return json({ success: false, message: 'Only the project creator can request evaluations' }, { status: 403 });
  }

  if (!project.github) {
    return json({ success: false, message: 'Project has no GitHub repository' }, { status: 400 });
  }

  const result = await requestEvaluation(
    project.id,
    project.github,
    'manual',
    authUser.id,
    locals.supabase,
  );

  const status = result.success ? 201 : 409;
  return json(result, { status });
}
```

- [ ] **Step 2: Create the GET evaluations endpoint**

```js
//@ts-check
import { json } from '@sveltejs/kit';
import { getEvaluationStatus } from '$lib/server/service/evaluationQueueService.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
  const { id } = params;

  const result = await getEvaluationStatus(id, locals.supabase);

  return json(result);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/routes/api/projects/[id]/evaluate/+server.js src/routes/api/projects/[id]/evaluations/+server.js
git commit -m "feat: add evaluation request and status API endpoints"
```

---

## Task 5: Wire up project creation and webhook

**Files:**
- Modify: `src/lib/server/service/projectService.js`
- Modify: `src/lib/server/service/githubWebhookService.js`

- [ ] **Step 1: Update projectService.js imports**

Replace lines 29-30:

```js
import { getQueueProvider } from '$lib/server/providers/index.js';
import { supabaseAnonKey, supabaseUrl } from '$lib/server/config.js';
```

With:

```js
import { requestEvaluation } from '$lib/server/service/evaluationQueueService.js';
```

- [ ] **Step 2: Remove module-level queue setup from projectService.js**

Delete lines 32-33:

```js
const { createQueue } = await getQueueProvider();
const projectEvaluationQueue = createQueue('projectEvaluation');
```

- [ ] **Step 3: Replace queue enqueue in storeProject()**

Replace lines 181-188 in `storeProject()`:

```js
  console.log('Evaluating project:', project.github);
  //Enqueue the project evaluation job
  await projectEvaluationQueue.add('evaluateProject', {
    github: project.github,
    projectId: project.id,
    supabaseUrl: supabaseUrl,
    supabaseAnonKey: supabaseAnonKey,
  });
```

With:

```js
  if (project.github) {
    await requestEvaluation(project.id, project.github, 'auto', user.id, supabase);
  }
```

- [ ] **Step 4: Update githubWebhookService.js**

Replace the entire file content with:

```js
//@ts-check
import { getProjectByGithubUrl } from '$lib/server/service/projectService.js';
import { createProjectUpdate } from '$lib/server/service/projectUpdatesService.js';
import { requestEvaluation } from '$lib/server/service/evaluationQueueService.js';

export async function githubWebhook(data, supabase) {
  try {
    console.log('Received webhook:');

    const url = data.repository?.html_url;

    if (!url) throw new Error('Repository URL missing in payload');

    const project = await getProjectByGithubUrl(url, supabase);
    if (!project) {
      console.error(`Project not found for URL: ${url}`);
      return { success: false, message: 'Project not found' };
    }

    console.log('Processing webhook for project:', project.github);

    if (data.action === 'closed' && data.pull_request?.merged) {
      console.log('Pull request merged. Storing update...');
      await createProjectUpdate(
        {
          project_id: project.id,
          title: data.pull_request.title,
          merged_url: data.pull_request.html_url,
          author_association: data.pull_request.author_association,
          commits: data.pull_request.commits,
          commits_url: data.pull_request.commits_url,
          merged: true,
          merged_at: data.pull_request.merged_at,
          user: data.pull_request.user,
          code: true,
        },
        supabase,
      );
    } else {
      console.log(
        `The action is "${data.action}" or the PR was not merged. Skipping update storage.`,
      );
    }

    console.log('Requesting project evaluation...');
    await requestEvaluation(project.id, project.github, 'webhook', null, supabase);

    return { success: true };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { success: false, error: error.message };
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/service/projectService.js src/lib/server/service/githubWebhookService.js
git commit -m "feat: wire project creation and webhook to evaluation queue"
```

---

## Task 6: Remove dead infrastructure

**Files:**
- Delete: `src/lib/server/providers/queueProvider.js`
- Delete: `src/lib/server/providers/inMemoryQueue.js`
- Delete: `src/lib/server/providers/aiProvider.js`
- Delete: `src/lib/server/service/aiService.js`
- Delete: `src/lib/server/service/dpgStatusService.js`
- Delete: `src/lib/server/github.js`
- Delete: `src/routes/api/ai/+server.js`
- Delete: `src/routes/api/github/+server.js`
- Delete: `src/routes/api/github/match/+server.js`
- Modify: `src/hooks.server.js`
- Modify: `src/lib/server/providers/index.js`
- Modify: `src/lib/server/config.js`
- Modify: `package.json`

- [ ] **Step 1: Delete dead files**

```bash
rm src/lib/server/providers/queueProvider.js
rm src/lib/server/providers/inMemoryQueue.js
rm src/lib/server/providers/aiProvider.js
rm src/lib/server/service/aiService.js
rm src/lib/server/service/dpgStatusService.js
rm src/lib/server/github.js
rm src/routes/api/ai/+server.js
rm src/routes/api/github/+server.js
rm src/routes/api/github/match/+server.js
```

- [ ] **Step 2: Clean up hooks.server.js**

Replace the full file with:

```js
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { createSessionClient, getSessionAndUser } from '$lib/server/providers/authProvider.js';

const supabase = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request
   * via the auth provider abstraction layer.
   */
  event.locals.supabase = createSessionClient({
    getAll: () => event.cookies.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value, options }) => {
        event.cookies.set(name, value, { ...options, path: '/' });
      });
    },
  });

  /**
   * Safe session getter that validates the JWT
   */
  event.locals.safeGetSession = async () => {
    return getSessionAndUser(event.locals.supabase);
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    },
  });
};

const authGuard = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession();

  event.locals.session = session;
  event.locals.authUser = user;

  const protectedRoutes = ['/profile', '/profile/edit', '/project/create'];

  if (!session && protectedRoutes.some((route) => event.url.pathname.startsWith(route))) {
    throw redirect(303, '/sign-in');
  }

  return resolve(event);
};

const apiProtection = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/api/')) {
    // Define public API routes with allowed methods
    const publicRoutes = [
      { path: '/api/projects/singleProject', methods: ['GET'] },
      { path: '/api/projects', methods: ['GET'] },
      { path: '/api/signIn', methods: ['POST'] },
      { path: '/api/signUp', methods: ['POST'] },
    ];

    const matchedRoute = publicRoutes.find((route) => event.url.pathname.startsWith(route.path));

    const isPublicRoute = matchedRoute !== undefined;

    // Check if the HTTP method is allowed for public routes
    if (isPublicRoute && !matchedRoute.methods.includes(event.request.method)) {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // For protected routes, require authentication
    if (!isPublicRoute) {
      const { session } = await event.locals.safeGetSession();

      if (!session) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    // Apply origin check for all API routes (public or protected)
    const origin = event.request.headers.get('origin');
    const host = event.request.headers.get('host');
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (origin) {
      const expectedOrigin = `${event.url.protocol}//${host}`;
      const isValidOrigin = origin === expectedOrigin;

      if (!isValidOrigin && !isDevelopment) {
        return new Response('Forbidden', { status: 403 });
      }
    }
  }

  return resolve(event);
};

export const handle = sequence(supabase, authGuard);
```

- [ ] **Step 3: Clean up providers/index.js**

Replace the full file with:

```js
//@ts-check

/**
 * Provider registry — selects the active provider implementation
 * for each external service based on environment configuration.
 *
 * Providers:
 * - Storage: Supabase Storage
 * - Auth: Supabase Auth
 */

export { uploadFile, getPublicUrl, deleteFiles } from './storageProvider.js';
export {
  createUser,
  deleteUser,
  signInWithPassword,
  signOut,
  createSessionClient,
  getSessionAndUser,
} from './authProvider.js';
```

- [ ] **Step 4: Clean up config.js**

Remove the Redis, OpenAI, and GitHub token exports. Replace the file with:

```js
//@ts-check
import { env } from '$env/dynamic/private';

export const SUPABASE_SERVICE_KEY = env.PRIVATE_SUPABASE_SERVICE_KEY;
export const supabaseUrl = env.VITE_SUPABASE_URL;
export const supabaseAnonKey = env.VITE_SUPERBASE_ANON_KEY;
```

- [ ] **Step 5: Verify config imports still resolve**

Check that no remaining file imports the removed config exports:

```bash
cd /Users/cf1/Github/pipeline && grep -r "OPENAI_API_KEY\|GITHUB_TOKEN\|redisHost\|redisPort\|redisPassword" src/
```

Expected: no matches (all consumers have been deleted).

- [ ] **Step 6: Remove npm dependencies**

```bash
cd /Users/cf1/Github/pipeline && npm uninstall bullmq openai axios
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: remove BullMQ, OpenAI, and dead evaluation infrastructure"
```

---

## Task 7: Update dpgStatus.svelte UI

**Files:**
- Modify: `src/lib/dpgStatus.svelte`

- [ ] **Step 1: Update the component**

Replace the full file with:

```svelte
<script>
  import Icon from '@iconify/svelte';
  import * as Popover from '$lib/components/ui/popover';

  export let project;
  export let isOwner = false;
  export let evaluations = { active: null, latest: null, history: [] };

  $: dpgStatuses = project.dpgStatus?.status;

  // Separate completed and incomplete items for better focus
  $: completedItems = dpgStatuses?.filter((item) => item.overallScore === 1) || [];
  $: incompleteItems = dpgStatuses?.filter((item) => item.overallScore !== 1) || [];

  // DPG Standard icons for better visual representation
  const standardIcons = {
    'Relevance to Sustainable Development Goals (SDGs)': 'mdi:earth',
    'Use of Approved Open Licenses': 'mdi:license',
    'Clear Ownership': 'mdi:account-check',
    'Platform Independence': 'mdi:devices',
    Documentation: 'mdi:file-document',
    'Mechanism for Extracting Data and Content': 'mdi:database-export',
    'Adherence to Privacy and Applicable Laws': 'mdi:shield-lock',
    'Adherence to Standards & Best Practices': 'mdi:check-circle',
    'Do No Harm By Design': 'mdi:heart-plus',
  };

  function getIconForStandard(name) {
    return standardIcons[name] || 'mdi:checkbox-marked-circle';
  }

  let requesting = false;

  async function handleRequestEvaluation() {
    requesting = true;
    try {
      const res = await fetch(`/api/projects/${project.id}/evaluate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        evaluations = { ...evaluations, active: data.evaluation };
      }
    } catch (err) {
      console.error('Failed to request evaluation:', err);
    } finally {
      requesting = false;
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  $: hasActiveEvaluation = evaluations?.active != null;
  $: showHistory = evaluations?.history?.filter((h) => h.status === 'completed' || h.status === 'failed').length > 0;
</script>

<div class="w-full space-y-8">
  <!-- Evaluation Controls (owner only) -->
  {#if isOwner}
    <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-800/50 p-4"
    >
      <div class="flex items-center gap-3">
        {#if hasActiveEvaluation}
          <div class="flex items-center gap-2">
            <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin text-dashboard-purple-400" />
            <span class="text-body-md text-dashboard-purple-300">
              Evaluation {evaluations.active.status}...
            </span>
          </div>
        {:else if evaluations?.latest}
          <span class="text-body-sm text-gray-400">
            Last evaluated: {formatDate(evaluations.latest.completed_at)}
          </span>
        {/if}
      </div>

      <button
        on:click={handleRequestEvaluation}
        disabled={hasActiveEvaluation || requesting}
        class="rounded-xl border border-dashboard-purple-500 bg-dashboard-gray-800 px-4 py-2 text-label-md font-medium text-dashboard-purple-400 transition-colors hover:bg-dashboard-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon
          icon={requesting ? 'lucide:loader-2' : 'lucide:refresh-cw'}
          class="mr-2 inline h-4 w-4"
          class:animate-spin={requesting}
        />
        {#if hasActiveEvaluation}
          Evaluation in progress
        {:else if dpgStatuses}
          Re-evaluate
        {:else}
          Request Evaluation
        {/if}
      </button>
    </div>
  {/if}

  {#if dpgStatuses != null}
    <!-- Progress Overview -->
    <div class="space-y-4 text-center">
      <div
        class="inline-flex items-center gap-4 rounded-2xl border border-dashboard-gray-700 bg-gradient-to-r from-dashboard-purple-500/10 to-dashboard-yellow-400/10 px-6 py-4"
      >
        <Icon icon="mdi:trophy" class="h-8 w-8 text-dashboard-yellow-400" />
        <div>
          <div class="text-display-lg font-semibold text-white">
            {project.dpgCount}<span class="text-gray-400">/9</span>
          </div>
          <div class="text-body-md text-gray-300">Standards Complete</div>
        </div>
      </div>

      <div class="mx-auto h-4 w-full max-w-md overflow-hidden rounded-full bg-dashboard-gray-700">
        <div
          class="h-4 bg-gradient-to-r from-dashboard-yellow-400 to-dashboard-purple-500 transition-all duration-700 ease-out"
          style="width: {(project.dpgCount / 9) * 100}%"
        ></div>
      </div>
    </div>

    <!-- Action Required Section - Highlight Incomplete Items -->
    {#if incompleteItems.length > 0}
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <Icon icon="mdi:alert-circle" class="h-6 w-6 text-dashboard-yellow-400" />
          <h3 class="text-heading-lg font-semibold text-white">
            Action Required ({incompleteItems.length} remaining)
          </h3>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          {#each incompleteItems as item}
            <Popover.Root>
              <Popover.Trigger
                class="group rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-left transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/10"
              >
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 rounded-lg bg-red-500/10 p-2">
                    <Icon icon={getIconForStandard(item.name)} class="h-5 w-5 text-red-400" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-heading-sm font-medium text-white line-clamp-2">
                      {item.name}
                    </h4>
                    <p class="mt-1 text-body-sm text-red-300">Needs attention</p>
                  </div>
                  <Icon
                    icon="mdi:arrow-right"
                    class="h-4 w-4 text-red-400 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Popover.Trigger>

              <Popover.Content
                class="w-96 max-w-lg space-y-4 rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6"
              >
                <div class="mb-4 flex items-center gap-3">
                  <Icon
                    icon={getIconForStandard(item.name)}
                    class="h-6 w-6 text-dashboard-yellow-400"
                  />
                  <h4 class="text-heading-md font-semibold text-white">{item.name}</h4>
                </div>

                <div class="space-y-4">
                  <div
                    class="rounded-xl border border-dashboard-gray-600 bg-dashboard-gray-900 p-4"
                  >
                    <div class="mb-3 flex items-center gap-2">
                      <Icon icon="mage:stars-b" class="h-5 w-5 text-dashboard-yellow-400" />
                      <span class="text-label-lg font-medium text-dashboard-yellow-400"
                        >AI Assessment</span
                      >
                    </div>
                    <p class="text-body-md leading-relaxed text-gray-300">
                      {item.explanation ||
                        'This standard requires further review and documentation.'}
                    </p>
                  </div>

                  <div class="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
                    <div class="mb-2 flex items-center gap-2">
                      <Icon icon="mdi:lightbulb" class="h-5 w-5 text-yellow-400" />
                      <span class="text-label-md font-medium text-yellow-400">Next Steps</span>
                    </div>
                    <p class="text-body-sm text-gray-300">
                      Review the requirements for this standard and update your project
                      documentation accordingly.
                    </p>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Root>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Completed Standards Section -->
    {#if completedItems.length > 0}
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <Icon icon="mdi:check-circle" class="h-6 w-6 text-green-400" />
          <h3 class="text-heading-lg font-semibold text-white">
            Completed Standards ({completedItems.length})
          </h3>
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          {#each completedItems as item}
            <Popover.Root>
              <Popover.Trigger
                class="group rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-left transition-all duration-200 hover:bg-green-500/10"
              >
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0 rounded-lg bg-green-500/10 p-2">
                    <Icon icon={getIconForStandard(item.name)} class="h-5 w-5 text-green-400" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-heading-sm font-medium text-white line-clamp-2">
                      {item.name}
                    </h4>
                    <div class="mt-1 flex items-center gap-1">
                      <Icon icon="mdi:check" class="h-3 w-3 text-green-400" />
                      <span class="text-body-sm text-green-300">Complete</span>
                    </div>
                  </div>
                </div>
              </Popover.Trigger>

              <Popover.Content
                class="w-96 max-w-lg space-y-4 rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6"
              >
                <div class="mb-4 flex items-center gap-3">
                  <Icon icon={getIconForStandard(item.name)} class="h-6 w-6 text-green-400" />
                  <h4 class="text-heading-md font-semibold text-white">{item.name}</h4>
                  <Icon icon="mdi:check-circle" class="h-5 w-5 text-green-400" />
                </div>

                <div class="space-y-4">
                  <div class="rounded-xl border border-green-500/30 bg-green-500/5 p-4">
                    <div class="mb-2 flex items-center gap-2">
                      <Icon icon="mdi:check-circle" class="h-5 w-5 text-green-400" />
                      <span class="text-label-md font-medium text-green-400">Status: Complete</span>
                    </div>
                    <p class="text-body-sm text-gray-300">
                      This standard has been successfully met by your project.
                    </p>
                  </div>

                  <div
                    class="rounded-xl border border-dashboard-gray-600 bg-dashboard-gray-900 p-4"
                  >
                    <div class="mb-3 flex items-center gap-2">
                      <Icon icon="mage:stars-b" class="h-5 w-5 text-dashboard-yellow-400" />
                      <span class="text-label-md font-medium text-dashboard-yellow-400"
                        >AI Assessment</span
                      >
                    </div>
                    <p class="text-body-md leading-relaxed text-gray-300">
                      {item.explanation || 'This standard has been successfully implemented.'}
                    </p>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Root>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Final Recommendation -->
    <div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-800/50 p-6">
      <div class="mb-4 flex items-center gap-3">
        <Icon icon="mdi:star-check" class="h-6 w-6 text-dashboard-yellow-400" />
        <h3 class="text-heading-lg font-semibold text-white">Overall Assessment</h3>
      </div>

      <div class="rounded-xl border border-dashboard-gray-600 bg-dashboard-gray-900 p-4">
        <p class="mb-4 text-body-lg leading-relaxed text-gray-300">
          {project.dpgStatus.final_recommendation}
        </p>

        <div class="flex items-center gap-4 border-t border-dashboard-gray-700 pt-4">
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-green-400"></div>
            <span class="text-body-sm text-gray-400">{completedItems.length} Complete</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-red-400"></div>
            <span class="text-body-sm text-gray-400">{incompleteItems.length} Remaining</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-dashboard-yellow-400"></div>
            <span class="text-body-sm text-gray-400"
              >{Math.round((project.dpgCount / 9) * 100)}% Complete</span
            >
          </div>
        </div>
      </div>
    </div>
  {:else if hasActiveEvaluation}
    <!-- Pending/Running State -->
    <div class="space-y-6 text-center">
      <div>
        <h3 class="mb-2 text-heading-lg font-semibold text-white">DPG Standards Evaluation</h3>
        <p class="text-body-lg text-gray-400">
          {#if evaluations.active.status === 'pending'}
            Your evaluation request is queued and will be processed shortly.
          {:else}
            Analyzing project compliance with Digital Public Good standards...
          {/if}
        </p>
      </div>

      <div class="flex flex-col items-center gap-4 py-12">
        <div class="relative">
          <Icon icon="lucide:loader-2" class="h-12 w-12 animate-spin text-dashboard-yellow-400" />
        </div>
        <p class="text-body-lg font-medium text-gray-300">
          Evaluation {evaluations.active.status}
        </p>
        <p class="text-body-sm text-gray-500">
          Requested {formatDate(evaluations.active.created_at)}
        </p>
      </div>
    </div>
  {:else}
    <!-- No Evaluation State -->
    <div class="space-y-6 text-center">
      <div>
        <h3 class="mb-2 text-heading-lg font-semibold text-white">DPG Standards Evaluation</h3>
        <p class="text-body-lg text-gray-400">
          {#if isOwner}
            Request an evaluation to see how your project aligns with DPG standards.
          {:else}
            This project has not been evaluated yet.
          {/if}
        </p>
      </div>

      <div class="flex flex-col items-center gap-4 py-12">
        <Icon icon="mdi:clipboard-check-outline" class="h-16 w-16 text-dashboard-gray-600" />
        {#if isOwner}
          <button
            on:click={handleRequestEvaluation}
            disabled={requesting}
            class="rounded-xl border border-dashboard-purple-500 bg-dashboard-purple-500/10 px-6 py-3 text-label-lg font-medium text-dashboard-purple-400 transition-colors hover:bg-dashboard-purple-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-purple-500 disabled:opacity-50"
          >
            <Icon
              icon={requesting ? 'lucide:loader-2' : 'lucide:play'}
              class="mr-2 inline h-4 w-4"
              class:animate-spin={requesting}
            />
            Request Evaluation
          </button>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Evaluation History -->
  {#if showHistory}
    <details class="group rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-800/30">
      <summary
        class="flex cursor-pointer items-center justify-between p-4 text-heading-sm font-medium text-gray-300 hover:text-white"
      >
        <span>Previous Evaluations</span>
        <Icon
          icon="lucide:chevron-down"
          class="h-4 w-4 transition-transform group-open:rotate-180"
        />
      </summary>
      <div class="border-t border-dashboard-gray-700 p-4">
        <div class="space-y-2">
          {#each evaluations.history.filter((h) => h.status === 'completed' || h.status === 'failed') as run}
            <div
              class="flex items-center justify-between rounded-lg bg-dashboard-gray-900/50 px-4 py-3"
            >
              <div class="flex items-center gap-3">
                <Icon
                  icon={run.status === 'completed' ? 'mdi:check-circle' : 'mdi:alert-circle'}
                  class="h-4 w-4 {run.status === 'completed' ? 'text-green-400' : 'text-red-400'}"
                />
                <span class="text-body-sm text-gray-300">
                  {formatDate(run.completed_at || run.created_at)}
                </span>
              </div>
              <div class="flex items-center gap-2">
                {#if run.result?.score}
                  <span class="text-body-sm text-gray-400">{run.result.score}</span>
                {/if}
                <span
                  class="rounded-full px-2 py-0.5 text-body-xs {run.status === 'completed'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'}"
                >
                  {run.status}
                </span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </details>
  {/if}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/dpgStatus.svelte
git commit -m "feat: add evaluation request button, status, and history to DPG assessment"
```

---

## Task 8: Wire up the project page

**Files:**
- Modify: `src/routes/project/[id]/+page.js`
- Modify: `src/routes/project/[id]/+page.svelte`

- [ ] **Step 1: Add evaluations fetch to +page.js**

The current file fetches project and resources in parallel. Add evaluations to the same parallel fetch. Replace the `load` function:

Find:
```js
  const [projectRes, resourcesRes] = await Promise.all([
    fetch(`/api/projects/singleProject/${id}`),
    fetch(`/api/projects/singleProject/${id}/contribution/resources`),
  ]);
```

Replace with:
```js
  const [projectRes, resourcesRes, evaluationsRes] = await Promise.all([
    fetch(`/api/projects/singleProject/${id}`),
    fetch(`/api/projects/singleProject/${id}/contribution/resources`),
    fetch(`/api/projects/${id}/evaluations`),
  ]);
```

Add after the existing data parsing:
```js
  const evaluationsData = await evaluationsRes.json();
```

And add `evaluations` to the return object:
```js
  return {
    project: projectData.project || [],
    totalResources: resourcesData.totalResources,
    evaluations: evaluationsData,
  };
```

- [ ] **Step 2: Update +page.svelte to pass new props**

Find the `DpgStatus` usage in the template. It will look like:

```svelte
<DpgStatus {user} {project} />
```

Replace with:

```svelte
<DpgStatus {project} isOwner={user?.id === project.user_id} evaluations={data.evaluations} />
```

Also find the data destructuring at the top of the script and add `evaluations`:

In the script section, the `data` prop is already available as `export let data;`. The `evaluations` data flows through `data.evaluations` directly to the component — no extra variable needed.

- [ ] **Step 3: Remove the `user` prop from DpgStatus if present**

Check the current `DpgStatus` component usage. The original component had `export let user` but we've replaced it with `isOwner`. If the template passes `{user}` to DpgStatus, remove it.

- [ ] **Step 4: Commit**

```bash
git add src/routes/project/[id]/+page.js src/routes/project/[id]/+page.svelte
git commit -m "feat: wire evaluation status data to project page"
```

---

## Task 9: Add evaluations endpoint to public API routes

**Files:**
- Modify: `src/hooks.server.js`

- [ ] **Step 1: Add evaluations GET to public routes**

The `GET /api/projects/[id]/evaluations` endpoint should be accessible without auth (like `GET /api/projects`). In `hooks.server.js`, the `apiProtection` hook defines public routes. Add the evaluations route:

Find:
```js
    const publicRoutes = [
      { path: '/api/projects/singleProject', methods: ['GET'] },
      { path: '/api/projects', methods: ['GET'] },
      { path: '/api/signIn', methods: ['POST'] },
      { path: '/api/signUp', methods: ['POST'] },
    ];
```

Note: `/api/projects` with method `GET` already covers `/api/projects/[id]/evaluations` since `startsWith` is used for matching. The evaluations endpoint uses GET, so it's already covered by the `{ path: '/api/projects', methods: ['GET'] }` rule.

Verify this is correct — the `apiProtection` hook checks:
```js
const matchedRoute = publicRoutes.find((route) => event.url.pathname.startsWith(route.path));
```

Since `/api/projects/123/evaluations` starts with `/api/projects`, the GET method is allowed. No change needed here.

- [ ] **Step 2: Verify the POST evaluate endpoint requires auth**

`POST /api/projects/[id]/evaluate` will NOT match any public route (POST method is not in the `methods` array for `/api/projects`). The `apiProtection` hook will require a session for it. The endpoint itself also checks `locals.safeGetSession()` as a second layer. No change needed.

- [ ] **Step 3: Commit (skip if no changes were needed)**

No file changes required for this task — the existing route matching covers our new endpoints correctly.

---

## Task 10: Verify and clean up

**Files:**
- Modify: `package.json` (verify deps removed)

- [ ] **Step 1: Verify no broken imports**

```bash
cd /Users/cf1/Github/pipeline && grep -r "from.*aiService\|from.*aiProvider\|from.*queueProvider\|from.*inMemoryQueue\|from.*dpgStatusService\|from.*github\.js" src/ --include="*.js" --include="*.svelte"
```

Expected: no matches.

- [ ] **Step 2: Verify no references to removed functions**

```bash
cd /Users/cf1/Github/pipeline && grep -r "evaluateProject\|checkDPGStatus\|saveDPGStstatus\|getDpgSimilarProjects\|chatCompletionWithSchema\|getEmbedding\|getQueueProvider\|projectEvaluationQueue" src/ --include="*.js" --include="*.svelte"
```

Expected: no matches.

- [ ] **Step 3: Run the build**

```bash
cd /Users/cf1/Github/pipeline && npm run check
```

Expected: no type errors related to removed code. There may be pre-existing type warnings.

- [ ] **Step 4: Run formatter**

```bash
cd /Users/cf1/Github/pipeline && npm run format
```

- [ ] **Step 5: Commit any formatting fixes**

```bash
git add -A
git commit -m "chore: formatting pass"
```

- [ ] **Step 6: Run existing tests**

```bash
cd /Users/cf1/Github/pipeline && npm run test
```

Expected: existing tests in `exportService.test.js` and `page.server.test.js` should still pass — they don't depend on evaluation infrastructure.
