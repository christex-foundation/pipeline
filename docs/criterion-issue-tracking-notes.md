# Criterion → GitHub Issue Tracking: Notes & Proposal

Working doc for the feature: detect failed DPG criteria on a project, check the project's GitHub repo for a tracking issue, and suggest/create one if missing. Uses the GitHub OAuth account-linking work on `feat/github-integration`.

## Direction (decided 2026-04-22)

- **Bot-write path only.** Project owner views their project, sees failed-criterion cards, clicks "Create tracking issue", and the platform uses their stored OAuth token to POST the issue to their repo. Deep links were considered but rejected: they prefill a form but do not automate creation, and they shift the action off-platform.
- **Visibility rule:** only the authenticated project owner sees the recommendation buttons. Non-owners see the tracked-issue badge (if present) but no create affordance.
- **Platform-as-checker:** the app is responsible for reading the repo (via `githubApiService`) and presenting the gap. The user never has to diff their repo against the criteria manually.
- **Scope:** webhook-driven issue-state refresh is **out of scope** for this iteration. "Last seen" state is acceptable; we'll decide later whether to poll or webhook.
- **Prerequisite still required:** OAuth scope must be bumped to `public_repo` and tokens must be encrypted at rest before the create-issue button goes live. These are non-negotiable.

---

## How DPG evaluation actually works today

- **Evaluation runs out-of-process.** This SvelteKit app does **not** run AI. A separate service at `~/Github/dpg-evaluator` polls `public.evaluation_queue` (service_role, bypasses RLS) and writes results back. See `db/migrations/001_evaluation_queue.sql:4,72,96`. CLAUDE.md is stale — it still says "BullMQ worker in hooks.server.js ... OpenAI GPT-4o via aiService.js". That hasn't been true since commit `337981e`.
- **Per-criterion result shape:** `projects.dpgStatus` JSONB (`db/schema/schema.sql:25`) contains `{ status: [{ name, overallScore, explanation }, ...], final_recommendation }`. Failed criteria = `overallScore !== 1`.
- **UI for failed items** lives in `src/lib/dpgStatus.svelte:111-186`. Each failed criterion is already rendered as a card with a popover showing the AI explanation and a static "Next Steps" blurb. **This is the exact surface the new feature bolts onto.**
- There is a **second table, `project_dpg_status`** (`schema.sql:90-100`), modeled for atomic per-criterion rows. Nothing on main reads or writes it. Dead schema or unfinished — pick one and delete the other.

## State of `feat/github-integration`

Solid primitives, two showstoppers.

### What's good
- `src/lib/server/service/githubApiService.js` — clean Octokit wrapper, Zod-validated. Already has `createIssue`, `listIssues`, `updateIssueState`. PR helpers too.
- OAuth callback at `src/routes/auth/github/callback/+server.js` handles the `identity_already_exists` race via a relink bounce. Nice.
- `github_connections` table with RLS (`db/migrations/003_github_connections.sql`), repo/service layers follow house style.
- Layering is clean — `authProvider.js` exposes `linkIdentity`/`exchangeCodeForSession`/`unlinkIdentityByProvider`, service handles orchestration.

### What's broken for this feature
1. **Scope mismatch.** OAuth requests `'read:user'` (`callback/+server.js:29`, `relink/+server.js:17`). That scope **cannot create issues**. Creating an issue needs `public_repo` (public repos) or `repo` (private). `createIssue()` will 404/403 for every linked user today. This bug is already latent on the branch.
2. **Plain-text tokens.** `github_connections.access_token text NOT NULL` — stored unencrypted. If the DB or a logging pipeline leaks, every user's GitHub is compromised to the granted scope. Must be encrypted at rest (pgsodium / pgcrypto / app-side envelope) before this feature goes near production.

### Other branch-state notes
- `GitHubManager.svelte` (576 lines) is still on the branch in the diff even though the commit log says "Simplify GitHub integration to account linking." Verify whether it's dead code or meant to ship.
- Issue/PR endpoints exist (`/api/github/issues`, `/api/github/pulls/*`) but take raw `{owner, repo, ...}` from the client — they should key on `project_id` instead so authorization can be checked against project ownership.
- `.env.example` on the branch uses `VITE_SUPABASE_ANON_KEY` (correct spelling). CLAUDE.md insists the typo `VITE_SUPERBASE_ANON_KEY` must be preserved. One of them is lying — need to check `src/lib/server/config.js` on each branch before merging or this breaks auth.

---

## Brutal honest notes on the broader codebase

- **GitHub webhook has no HMAC signature verification.** `src/routes/api/github/webhook/+server.js` accepts any payload. Anyone who knows the URL can force a re-evaluation for any project. Real vulnerability — fix independently of this feature.
- **Webhook always returns 200** regardless of success. `githubWebhookService.js:15-17` returns `{success: false}` on missing project, but the route doesn't translate that. GitHub will never retry, and real failures vanish.
- **Debug log in production.** `src/lib/server/repo/projectRepo.js:215` — `console.log('repo', projectData)`. Remove it.
- **No rate limit on `/api/projects/[id]/evaluate`.** A user can spam the evaluator queue. Export has a rate limit; evaluation doesn't. Inconsistent.
- **`profile.github` is overloaded** — it's simultaneously the display username *and* the link-status marker. A boolean `github_linked` or checking `github_connections` directly is cleaner.
- **No tests for the critical paths**: evaluation queue service, webhook flow, project creation. ExportService and ProjectService have tests; the things that actually break in prod don't.
- **CLAUDE.md is drifting from reality.** It describes BullMQ + aiService.js running locally. Both are gone. If you trust CLAUDE.md when onboarding an agent you do, this will mislead future sessions.

---

## Proposed design for the feature

### Data model — pick one

**Option A — new table (preferred):**
```sql
project_criterion_issue (
  project_id   uuid references projects(id) on delete cascade,
  criterion    text not null,            -- matches dpgStatus.status[].name
  issue_url    text not null,
  issue_number int  not null,
  repo_owner   text not null,
  repo_name    text not null,
  state        text not null,            -- 'open' | 'closed', refreshable
  linked_by    uuid references auth.users(id),
  linked_at    timestamptz default now(),
  primary key (project_id, criterion)
)
```
Queryable, survives re-evaluations that rewrite `dpgStatus` JSONB, lets us show issue state on the card. RLS: readable by anyone who can read the project, writable by owner.

**Option B — piggyback on `dpgStatus` JSONB.** Append `tracking_issue` onto each status entry. Simpler, but the dpg-evaluator rewrites that blob on each run and would wipe links unless we teach it to merge — coupling you don't want.

Recommend A.

### UX flow

In `dpgStatus.svelte` for each failed criterion, add to the popover (or the card itself) a small section:
- If **user owns project AND has GitHub linked AND project has `github_repo`:**
  - `[Find or create tracking issue]` button
- If **already linked:** `Tracked in #123 · open` link to issue
- If user isn't the owner: no button, just show the tracked-issue badge when present
- If user is owner but hasn't linked GitHub: inline prompt → `/profile/settings`

### Backend

New endpoint: `POST /api/projects/[id]/criteria/track`, body `{ criterion: string }`.

Service `criterionIssueService.trackCriterion(userId, projectId, criterion, supabase)`:
1. Load project, verify ownership + `github_repo` exists, parse to `{owner, repo}`.
2. Verify criterion actually appears in `project.dpgStatus.status` with `overallScore !== 1` (don't let users create issues for passing criteria).
3. **Search existing issues** via `octokit.rest.search.issuesAndPullRequests` — query `repo:{owner}/{repo} is:issue "[DPG] {criterion}" in:title`. If a match exists, link it and return. (This is the "check their github first" step.)
4. Otherwise `createIssue` with:
   - title `"[DPG] {criterion}"`
   - body templated from the AI `explanation` + a link back to the project page + a note about which DPG standard this maps to
   - label `dpg-standard` (create if missing? or require pre-existing? — decision needed)
5. Upsert into `project_criterion_issue`.

Add `searchIssues(userId, {owner, repo, query}, supabase)` to `githubApiService.js` — it doesn't exist yet. Zod schema for it.

### Prerequisites before this feature can ship

1. Bump OAuth scope to `public_repo` on the feat branch (or prompt for re-consent). Private-repo support is a separate decision.
2. Encrypt `github_connections.access_token` at rest. Non-negotiable before shipping.
3. Decide: merge feat/github-integration to main first, or build this on top of it? Recommend merge the plumbing after the two fixes above, then build this feature on main.
4. Confirm which supabase env var name is actually used (`VITE_SUPABASE_*` vs typo). CLAUDE.md vs feat branch disagree.

---

## Open questions

1. **Scope:** OK to request `public_repo` on OAuth? Do you need private-repo support (`repo`)?
2. **Token encryption:** solve as part of this feature, or separate ticket? Arguably cannot ship issue creation without it.
3. **Merge strategy:** build on `feat/github-integration` directly, or merge that branch first and build on main?
4. **Data model:** new `project_criterion_issue` table (A) or JSONB piggyback (B)?
5. **Search behavior:** if the user already has an issue titled "Documentation", auto-link on first match, or show candidates and let them pick?
6. **Out of scope check:** issue state auto-refresh (poll / webhook on issue close), or is a "last seen" status fine?
