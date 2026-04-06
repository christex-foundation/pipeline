# Evaluation Queue Proposal

## Summary

This proposal supersedes the execution model in PR #372.

Pipeline should own the product workflow for requesting and displaying evaluations.

`dpg-evaluator` should own evaluation execution.

Both systems should coordinate through the shared Supabase database that they already use.

## Why This Direction

The current reality is:

- project evaluation results are already written by `~/Github/dpg-evaluator`
- `dpg-evaluator` already updates `projects.dpgStatus` in the same Supabase database used by Pipeline
- Pipeline should not duplicate that evaluator logic internally

This means the right boundary is not:

- Pipeline runs evaluation logic itself

The right boundary is:

- Pipeline creates and displays evaluation requests
- `dpg-evaluator` processes queued requests and writes results back to Supabase

## Goals

- allow project maintainers to manually request an evaluation
- persist a queue and run history in Supabase
- ensure only one active evaluation per project at a time
- let `dpg-evaluator` process queued work from a dedicated queue entrypoint
- keep historical runs and results instead of deleting queue rows
- let Pipeline render current status and historical runs from Supabase

## Non-Goals

- moving evaluator logic into Pipeline
- making Pipeline depend on Redis/BullMQ for evaluation execution
- deleting completed queue rows
- treating Notion as the only durable record of evaluation history

## Review of PR #372

PR #372 introduced a useful idea:

- replace the ephemeral queue with a persistent `evaluation_queue` table

But it is not the right path forward because it makes Pipeline execute the evaluation itself.

That conflicts with the real system boundary, where `dpg-evaluator` is already the evaluator of record.

PR #372 should be treated as superseded, with only these ideas retained:

- `evaluation_queue` table
- status fields for queued work
- historical run retention

## Proposed Architecture

### 1. Pipeline responsibilities

Pipeline should:

- allow the project maintainer to request an evaluation from the project page
- insert a row into `evaluation_queue`
- block duplicate active requests for the same project
- display latest evaluation status and run history
- continue reading `projects.dpgStatus` as the current structured evaluation result

Pipeline should not:

- run the evaluator itself
- generate the report itself
- directly implement the scoring workflow already owned by `dpg-evaluator`

### 2. `dpg-evaluator` responsibilities

`dpg-evaluator` should add a queue-processing entrypoint that:

- fetches pending evaluation rows from Supabase
- claims one or more rows safely
- runs the existing evaluator skill flow
- updates `projects.dpgStatus`
- writes run result metadata back to the queue row
- marks the row `completed` or `failed`

### 3. Shared Supabase contract

Supabase becomes the system boundary between the product and the evaluator.

The queue table is the orchestration layer.

The `projects.dpgStatus` field remains the latest structured result.

## Queue Model

### Table

Use a persistent `evaluation_queue` table.

Suggested columns:

- `id`
- `project_id`
- `github_url`
- `status`
- `trigger`
- `requested_by`
- `created_at`
- `updated_at`
- `started_at`
- `completed_at`
- `retry_count`
- `result`
- `error`
- `report_url`
- `report_markdown`

### Statuses

Recommended statuses:

- `pending`
- `running`
- `completed`
- `failed`
- `cancelled`

Avoid introducing extra transient states unless they are operationally necessary.

### Uniqueness rule

A project must appear only once in active states.

Enforce a single active row per project where status is one of:

- `pending`
- `running`

Completed and failed rows remain for history.

## Processing Flow

### Manual request

1. Project maintainer clicks “Request evaluation” in Pipeline.
2. Pipeline verifies ownership.
3. Pipeline inserts a queue row with `status = pending`.
4. If an active row already exists for that project, Pipeline returns the existing run instead of inserting another one.

### Evaluator processing

1. `dpg-evaluator` queue runner queries pending rows.
2. It claims a row by moving it to `running` and setting `started_at`.
3. It runs the existing evaluation workflow.
4. It updates `projects.dpgStatus` in Supabase.
5. It stores run metadata and report metadata on the queue row.
6. It marks the row `completed` or `failed`.

### History

Queue rows are not deleted.

They are the evaluation run history.

## Report Storage

There are two acceptable rollout phases:

### Phase 1

Store:

- queue result summary
- approval likelihood
- score
- optional external report URL

Pipeline can show status/history immediately.

### Phase 2

Also store:

- full markdown report in `report_markdown`

Then Pipeline can render the latest full report directly without relying on Notion.

## API / Entry Points

### Pipeline

Add:

- `POST /api/projects/:id/evaluation-request`
- `GET /api/projects/:id/evaluations`

### `dpg-evaluator`

Add a dedicated queue processor entrypoint, for example:

- `python3 scripts/process_queue.py`

That script should:

- read pending jobs
- claim them safely
- run the evaluator
- update queue rows and `projects.dpgStatus`

## Safety / Correctness Requirements

- never allow duplicate active runs per project
- retain completed and failed rows for auditability
- do not log secrets
- make retries explicit through `retry_count`
- support recovery for stuck `running` rows, either by timeout or by operator action

## Migration Plan

### Step 1

Create and finalize the `evaluation_queue` schema in Pipeline.

### Step 2

Add manual request UI and API in Pipeline.

### Step 3

Add the queue-processing entrypoint in `dpg-evaluator`.

### Step 4

Update Pipeline UI to show:

- active run
- latest completed run
- history of prior runs

### Step 5

Optionally add full markdown report storage and rendering.

## Acceptance Criteria

- a project maintainer can request an evaluation manually
- only one active evaluation exists per project
- `dpg-evaluator` can process queued requests from Supabase
- completion updates `projects.dpgStatus`
- completed and failed runs remain visible historically
- Pipeline can show evaluation request status without owning evaluator execution

## Implementation Order

1. schema and uniqueness rule
2. Pipeline manual request endpoint and UI
3. `dpg-evaluator` queue processor
4. historical run display
5. markdown report storage and rendering
