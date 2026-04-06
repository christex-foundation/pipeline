# Evaluation Queue — Design Spec

## Overview

Replace Pipeline's in-process evaluation system (BullMQ + OpenAI aiService) with a persistent `evaluation_queue` table in Supabase. Pipeline writes evaluation requests; dpg-evaluator (separate repo) processes them asynchronously. Supabase is the system boundary.

This is Pipeline-side only. No changes to dpg-evaluator.

## Decisions

| Decision | Choice |
|---|---|
| Who can request | Project creator only (`user.id === project.user_id`). Team members later. |
| Where in UI | DPG Assessment tab inside `dpgStatus.svelte` |
| Old evaluation system | Remove entirely: BullMQ, Redis, aiService, aiProvider, OpenAI dep |
| Uniqueness enforcement | App-level check (UX) + DB partial unique index (safety net) |
| Queue row lifecycle | Rows are never deleted. Completed/failed rows are history. |

## Schema

### `evaluation_queue` table

The table already exists in Supabase (dpg-evaluator writes to it). Formalize and add constraints.

```sql
CREATE TABLE IF NOT EXISTS evaluation_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
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

CREATE UNIQUE INDEX evaluation_queue_one_active_per_project
  ON evaluation_queue (project_id)
  WHERE status IN ('pending', 'running');
```

- `requested_by`: Supabase auth UUID from `locals.authUser.id`
- `trigger`: `manual` (button), `webhook` (GitHub PR merge), `auto` (project creation)
- `github_url`: Denormalized — dpg-evaluator reads it from the queue row directly
- Partial unique index: prevents concurrent active evaluations per project at DB level

### RLS considerations

The evaluation_queue table needs policies:
- Authenticated users can INSERT (Pipeline's request-scoped client uses anon key + user JWT)
- Authenticated users can SELECT (for reading status/history)
- Only the service role can UPDATE (dpg-evaluator uses service key)

Exact policies to be written during implementation based on the existing RLS patterns in the project.

## Three-Layer Implementation

### Repo layer — `src/lib/server/repo/evaluationQueueRepo.js`

```
insertEvaluationRequest(projectId, githubUrl, trigger, requestedBy, supabase)
  → INSERT into evaluation_queue, returns row

getActiveEvaluation(projectId, supabase)
  → SELECT where status IN ('pending', 'running'), returns row or null

getEvaluationHistory(projectId, supabase, limit=10)
  → SELECT all rows for project, ordered by created_at DESC

getLatestCompletedEvaluation(projectId, supabase)
  → SELECT latest row where status = 'completed'
```

All functions take `supabase` as last parameter per project convention.

### Service layer — `src/lib/server/service/evaluationQueueService.js`

```
requestEvaluation(projectId, githubUrl, trigger, requestedBy, supabase)
  → Checks for active row (app-level uniqueness)
  → If active: returns { success: false, evaluation: activeRow, message: 'already active' }
  → If none: inserts and returns { success: true, evaluation: newRow }

getEvaluationStatus(projectId, supabase)
  → Returns { active, latest, history } for the UI
```

### Validator layer

Not needed. Inputs are internal (project ID from DB, user ID from session).

## API Endpoints

### `POST /api/projects/[id]/evaluate` — `src/routes/api/projects/[id]/evaluate/+server.js`

- Requires authentication
- Verifies ownership: `authUser.id === project.user_id`
- Calls `requestEvaluation(projectId, project.github, 'manual', authUser.id, supabase)`
- Returns `{ success, evaluation, message }`
- Returns 409 if active evaluation already exists

### `GET /api/projects/[id]/evaluations` — `src/routes/api/projects/[id]/evaluations/+server.js`

- Public (no auth required, like `GET /api/projects`)
- Calls `getEvaluationStatus(projectId, supabase)`
- Returns `{ active, latest, history }`

## UI Changes

### `dpgStatus.svelte`

New prop: `isOwner` (boolean).

**Top of assessment section** (owner only):
- "Request Evaluation" button (purple outline, matches existing button style)
- When active evaluation exists: show status badge ("Pending..." / "Running...") and disable button
- "Last evaluated: <date>" timestamp from latest completed queue row

**When dpgStatus is null and no queue rows exist:**
- Replace the perpetual loading spinner with a "No evaluation yet" empty state
- Show "Request Evaluation" button for owners
- Show "Evaluation not yet available" message for non-owners

**When dpgStatus is null but a queue row is pending/running:**
- Show "Evaluation requested" / "Evaluation in progress" status with a subtle animation
- No button (already requested)

**Evaluation history** (below results):
- Collapsible "Previous Evaluations" list
- Each entry: date, status (completed/failed), score summary if available
- Simple list, not elaborate UI

### Data loading

The project detail page's `+page.js` already fetches from `/api/`. Add a fetch to `/api/projects/[id]/evaluations` and pass the result to `dpgStatus.svelte`.

## Integration Points

### Project creation — `projectService.js` `storeProject()`

Replace:
```js
await projectEvaluationQueue.add('evaluateProject', { github, projectId, supabaseUrl, supabaseAnonKey });
```

With:
```js
await requestEvaluation(projectId, github, 'auto', userId, supabase);
```

### GitHub webhook — `githubWebhookService.js` `githubWebhook()`

Replace:
```js
await projectEvaluationQueue.add('evaluateProject', { ... });
```

With:
```js
await requestEvaluation(project.id, project.github, 'webhook', null, supabase);
```

## Removals

### Delete entirely

| File | Reason |
|---|---|
| `src/lib/server/providers/queueProvider.js` | BullMQ queue — replaced by Supabase table |
| `src/lib/server/providers/inMemoryQueue.js` | In-memory fallback — no longer needed |
| `src/lib/server/providers/aiProvider.js` | OpenAI client — evaluation moved to dpg-evaluator |
| `src/lib/server/service/aiService.js` | DPG evaluation logic — moved to dpg-evaluator |
| `src/lib/server/service/dpgStatusService.js` | Thin wrapper for saving dpgStatus — no longer called |
| `src/routes/api/ai/+server.js` | Inline evaluation endpoint — dead code |
| `src/routes/api/github/match/+server.js` | Similar DPG matching — data now comes from dpg-evaluator |
| `src/routes/api/github/+server.js` | Manual evaluation trigger — dead code, `evaluateProject` removed |
| `src/lib/server/github.js` | GitHub file fetching for AI evaluation — all consumers removed |

### Remove from package.json

- `bullmq`
- `openai`
- `axios` (only used by `github.js` and `getDpgSimilarProjects`, both removed)

### Edit (surgical removal)

| File | Change |
|---|---|
| `src/hooks.server.js` | Remove BullMQ worker setup (lines 7-8, 100-116), keep auth hooks |
| `src/lib/server/providers/index.js` | Remove `getQueueProvider`, `chatCompletionWithSchema`, `getEmbedding` exports |
| `src/lib/server/config.js` | Remove `redisHost`, `redisPort`, `redisPassword` |
| `src/lib/server/service/githubWebhookService.js` | Remove `evaluateProject`, `getDpgSimilarProjects`, queue imports, `axios` import, `parseGithubUrl` import. Keep `githubWebhook` (modified to use evaluation queue). Remove `cosineSimilarity`. |
| `src/lib/server/service/projectService.js` | Replace queue setup/enqueue with evaluation queue service call |

## Migration

A single SQL file for the Supabase dashboard. Also update `db/schema/schema.sql` to include the `evaluation_queue` table definition (fixes existing schema drift).

## Follow-up (not in scope)

- Surfacing dpg-evaluator v2 data in the UI (similarDPGs, matchedPeers, featureInventory, timeline) — separate PR once evaluations start flowing through
- Team member evaluation permissions
- dpg-evaluator queue processor implementation
- Stuck row recovery mechanism (timeout-based reset)
- Claiming RPC function for dpg-evaluator's safe row claiming
