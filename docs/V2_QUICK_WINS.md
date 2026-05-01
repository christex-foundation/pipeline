# V2 Quick Wins

This doc tracks the incremental work toward [PRD v2](./PRD_V2.md). Each slice ships a self-contained, user-visible piece of the V2 vision. The doc is meant to be readable by anyone on the team — engineering reference is at the bottom of each slice.

[`PRODUCT_STATUS.md`](./PRODUCT_STATUS.md) should be updated to reflect each slice once it lands.

PRD v2 reframes Pipeline from "a directory of projects" to "an interactive compliance engine with a community heart." The slices below land that vision one focused piece at a time.

---

## Status at a glance

If you're new to this doc and just want the score: read this section. Everything below is detail.

### ✅ Shipped

- **Slice 1** — Project card pills (`New Evaluation`, `Funding Needed`) + server-cached `good-first-issue` ingestion on the project page Issues tab.
- **Slice 2** — Actionable DPG checklist. The Action Required popovers now have per-standard "Next Steps" with one-click GitHub buttons (LICENSE, README, CODEOWNERS, PRIVACY) and a docs link for abstract standards.
- **Slice 3** — DPG Score badge for READMEs. Public `/api/projects/[id]/badge.svg` endpoint plus a copy-paste snippet panel on the project page.
- **Slice 4** — Activity-based `Trending` pill on the explore feed. Heuristic over recent project updates + comments + completed evaluations.
- **Slice 5** — GitHub webhook signature verification + `apiProtection` hook wired into `sequence()`. The orphaned auth gate is now live and the webhook is no longer accept-anything. Public-route table is unit-tested.
- **Slice 6** — Momentum ranking (Heat Score). New `project_dpg_history` table captures snapshots, new `momentumService.computeHeatScore` blends dpg-score deltas with recent activity and decay, new `Hot` pill on cards, new `?sort=heat` option on `/api/projects`. Unblocks the PRD's Heat Score formula.
- **Bug fixes shipped alongside** — see [Other fixes shipped alongside](#other-fixes-shipped-alongside-smaller-but-worth-noting). Includes the github-input clobber, validator preprocess, layout SSR crash, error-message propagation, missing social fields, edit page binding, and `toast.warn` typo.

Test posture: 131 unit tests across 11 files, all green. Vitest no longer picks up Playwright `e2e/*.spec.js` files.

### 🟡 Recommended next (ranked)

These aren't shipped yet. Ranked by value-per-effort.

| #   | Candidate                                    | Effort    | Why this rank                                                                                                                                                                                                       |
| --- | -------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Evaluator API wrapper / worker**           | Multi-day | Biggest user impact — without it, no new evaluations actually run. Slice 5 already secured the webhook that triggers it. Needs an LLM provider/runtime/cost decision, so it's its own plan rather than a quick win. |
| 2   | **Interactive support / contributor widget** | Variable  | Comments-on-projects vs. GitHub Discussions handoff is still a product decision. Pick the data layer and the rest is a normal feature.                                                                              |

### 🔴 Blocked or deferred (needs a decision before it can be picked up)

_Nothing blocked solely by missing engineering signal anymore — Slice 6 closed the Heat Score gap by capturing dpg history. The remaining items below are all blocked on product decisions._

- ~~**Momentum ranking ("Heat Score")** — needs historical dpg-score-over-time tracking we don't yet capture. The Slice 4 Trending pill is a heuristic stand-in that ships today.~~ → ✅ shipped as Slice 6.

### ⚪ Pre-existing issues — resolved in this round

- ✅ ~~`apiProtection` hook is defined but not wired into `sequence()`~~ — wired in Slice 5 with a method-aware public-route matcher.
- ✅ ~~`db/schema/schema.sql` declares `github_repo` but the running DB clearly has `github`~~ — schema file now uses `github` with a comment about the legacy name.
- ✅ ~~`CLAUDE.md` references a BullMQ worker that doesn't exist~~ — section rewritten to describe the real Supabase-table-based queue.
- ✅ ~~Vitest is picking up Playwright `e2e/*.spec.js` files~~ — added `test.exclude` to `vite.config.js`.

---

## Slice 1 — Project card pills + good-first-issue ingestion

The PRD's Final Instruction names two tasks to ship first as immediate visual progress: signal pills on the explore feed and `good-first-issue` ingestion on the project page. Both shipped here.

### What changed for users

**Explore feed.** Project cards now show small status pills next to the existing DPG rating and SDG tags. Two pills exist:

- **New Evaluation** — the project's most recent evaluation finished within the last 7 days.
- **Funding Needed** — the project has a funding goal, but is less than 25% of the way there.

Pills only render when their condition is true. A card with neither shows the same UI it always did.

**Project page — Issues tab.** The Issues tab now lists open issues from the project's GitHub repo that are labeled `good-first-issue`. The header shows the count. Each row links straight to GitHub. Before, the tab fetched every open issue indiscriminately and called the GitHub API directly from the user's browser.

### How it works

**Pills are derived, not stored.** The PRD asks for `dpg_score`, `comment_count`, and `last_evaluation_at` columns on the `projects` table. None exist in the schema today. We derive on read:

- "New Evaluation" reads `evaluation_queue.completed_at` (newest completed row per project).
- "Funding Needed" reads `current_funding` and `funding_goal`, which already live on `projects`.

The trade-off is that list endpoints do a little more work per request — one extra query against `evaluation_queue` per page render. The benefit is no migration, no backfill, no risk of denormalized columns drifting from their source. To avoid an N+1, the evaluation lookup is a single batched query that takes a list of project IDs and returns a `Map<projectId, completedAt>`. Six cards on a page = one extra DB round-trip.

**`good-first-issue` is fetched server-side, with a cache.** When the project page asks for items, the request goes to our server. Our server then asks GitHub once per repo every 30 minutes and serves the cached answer in between. GitHub's unauthenticated API allows 60 requests/hour per IP — without caching, six explore-feed visitors loading six cards each would burn the budget in one render. Implementation notes:

- Cache is an in-process `Map`, keyed by `owner/repo`. Lost on redeploy. Acceptable here — detail-page traffic is low and a cold cache costs one GitHub call.
- If a `GITHUB_TOKEN` env var is set, the request is authenticated and the rate limit becomes 5,000/hr. Everything works without it.
- If GitHub returns an error, we serve the last good cached answer if we have one, otherwise an empty list. A pill never breaks a page.
- Pull requests are filtered out (the GitHub `/issues` endpoint returns both).

**Why no `[Good First Issues: N]` pill on cards.** That pill is what you'd expect to see first. We deliberately didn't ship it. The explore feed is high-traffic and loads many projects at once. Even with the cache, six cards × one first-time GitHub call would tear through the rate limit on the first cold load after a deploy. The right way to do it is a periodic backfill that pre-computes the count and stores it on each project. That needs a scheduler — separate piece of V2 work. For now the count lives only on the project detail page, which gets one fetch per page-view.

---

## Slice 2 — Actionable DPG checklist

Slice 1 made the explore feed feel alive. Slice 2 makes the DPG status tab on a project page **actionable** instead of informational.

### What changed for users

**Project page — DPG Status tab.** The "Action Required" cards (one per failing standard) now open a popover with a per-standard "Next Steps" panel. For standards that can be fixed in code (Open License, Documentation, Clear Ownership, Privacy), the panel includes a one-click GitHub button:

- **Use of Approved Open Licenses** → "Add a LICENSE file on GitHub" → opens GitHub's native license-creation flow on the repo's main branch.
- **Documentation** → "Improve your README on GitHub" → opens the README anchor on the repo.
- **Clear Ownership** → "Add a CODEOWNERS file" → opens GitHub's new-file UI pre-filled at `.github/CODEOWNERS`.
- **Adherence to Privacy and Applicable Laws** → "Add a PRIVACY.md to your repo" → same pattern.

For abstract standards (Platform Independence, Do No Harm, etc.) the panel explains they aren't directly fixable in code and points to the official DPG guidance. Every popover — fixable or not — also includes a "Learn more about this standard" link to the official DPG Standard docs anchor.

If the project has no GitHub URL set, the popover prompts to add one to unlock the one-click fixes.

Before this slice, that panel showed the same generic placeholder text ("Review the requirements for this standard and update your project documentation accordingly") regardless of which standard had failed.

### How it works

A new `STANDARD_META` table in `src/lib/utils/dpgStandards.js` carries the per-standard data: icon (already existed), official DPG docs URL, and a `remediation(githubUrl)` function. The function returns either a `{label, href}` actionable CTA or `null` — for standards that don't have a code-level fix, `null` causes the UI to fall back to the docs link only.

The popover in `dpgStatus.svelte` calls `getRemediation(item.name, project.github)` and `getDocsUrl(item.name)` with Svelte's `{@const}` blocks at render time, so the rendered branch picks itself based on what data is available. No data is fetched, no schema is touched — this is purely the existing `dpgStatus` jsonb plus a static metadata table.

### Bonus cleanup in this slice

The shared `parseGithubRepo` utility from Slice 1 was previously inlined as a string-split in three places. All three now route through the helper:

- `src/routes/project/[id]/+page.svelte` — contributors fetch
- `src/lib/GitContributorsViewAll.svelte` — contributors fetch
- `src/routes/project/[id]/contribute/+page.svelte` — issues fetch

Behavior identical; the inline `githubLinkSplit[3] + '/' + githubLinkSplit[4]` pattern is gone, and these paths now correctly return `[]` instead of `"undefined/undefined"` when the project has no GitHub URL.

---

## Slice 3 — DPG Score Badge for READMEs

Slice 1 made the explore feed feel alive. Slice 2 made the checklist actionable. Slice 3 turns each project into a self-marketing surface for Pipeline.

The PRD names this directly as a quick win: _"Create a 'DPG Score' badge that maintainers can put in their GitHub READMEs, linking back to their Pipeline page."_ Every adoption is a backlink that introduces new contributors and funders to Pipeline without us paying for distribution.

### What changed for users

**Project page — DPG Status tab.** Below the Overall Assessment section, a new "Show your DPG score" panel gives the maintainer a copy-paste badge for their README. The panel includes:

- A live preview of the badge as it appears today (e.g. `DPG: 7/9` in yellow-green).
- The Markdown snippet, with a one-click "Copy" button.
- The HTML snippet, with its own "Copy" button.

When a snippet is copied, a toast confirms which one. If the browser blocks clipboard access, the toast says so instead of failing silently.

**New public endpoint — `/api/projects/[id]/badge.svg`.** Returns a shields.io-style SVG sized for inline use in a README. Two-segment layout: dark gray "DPG" label on the left, color-coded "{score}/9" on the right. Color tiers follow shields.io's scale: red (0), orange (1–3), yellow (4–6), yellow-green (7–8), bright green (9). The endpoint is unauthenticated, returns `Cache-Control: public, max-age=3600`, and is safe to be hammered by GitHub's image proxy.

The badge link points back to `/project/{id}`, so every README install is a backlink that brings new contributors to the platform.

### How it works

Three pieces, each independently testable:

- **`src/lib/utils/dpgBadge.js`** — pure functions: `pickColor(score)`, `buildBadgeSvg(rawScore)`, `buildBadgeMarkdown(origin, projectId)`, `buildBadgeHtml(origin, projectId)`. The SVG is built as a string with all dimensions hardcoded (we know the exact text "DPG" and "{0..9}/9" so font metrics aren't needed). Score is clamped to 0..9 so a malformed `dpgCount` never renders a broken badge.
- **`src/routes/api/projects/[id]/badge.svg/+server.js`** — looks up the project, reads `dpgCount`, calls `buildBadgeSvg`. If the lookup throws (project deleted, RLS denies, etc.) we fall through to a 0/9 badge so the README never shows a broken-image icon.
- **The snippet UI in `dpgStatus.svelte`** — builds Markdown and HTML strings reactively from `$page.url.origin`, so the snippet you copy in dev points at localhost and the snippet you copy in production points at the production host. No env-var configuration needed.

### Why it ships safely without auth

The endpoint is read-only and exposes only the public DPG score (which is already visible on the project page). No PII, no privileged data. Caching aggressively (1 hour) means a popular badge doesn't translate to a query storm against Supabase.

---

## Slice 4 — Activity-based Trending pill

The pills story from Slice 1 had two pills shipped (`New Evaluation`, `Funding Needed`) and one deliberately deferred (`Trending`). Slice 4 closes that gap with a heuristic version that ships today, before any historical signal capture exists.

### What changed for users

**Explore feed.** A third pill — **Trending** — joins the existing two on project cards. It renders when a project has had at least 2 distinct activity events in the last 7 days, where an activity is one of:

- a new entry on the project's update timeline,
- a comment on one of those updates,
- or a recently completed DPG evaluation (the same signal that drives the `New Evaluation` pill).

A project with one update and one comment in the same week trends. A project with three completed evaluations does too. Truly idle projects don't.

The pill uses a warm orange chip to stand visually apart from the lime "Funding Needed" and purple "New Evaluation" tones.

### How it works

Two new batched repo functions:

- `getRecentUpdateCountsByProjectIds(projectIds, sinceDate, supabase)` — single query against `project_updates`, returns `Map<projectId, count>`.
- `getRecentCommentCountsByProjectIds(projectIds, sinceDate, supabase)` — same shape against `project_update_comment`.

`withPills` in `projectService.js` now runs three batched lookups in parallel (evaluations + updates + comments) per page render, instead of one. Still no N+1 — six explore-feed cards = three round-trips total, regardless of how many cards.

`derivePills` in `pillsService.js` gained a new `trending` boolean, computed by `isTrending({ newEvaluation, recentUpdateCount, recentCommentCount })`. Pure function, threshold-based (`TRENDING_MIN_ACTIVITY = 2`), with negative/non-numeric counts coerced to zero.

### Why a heuristic and not real momentum

"Real" momentum (PRD's Heat Score) requires comparing `dpg_score` over time, which we don't track historically. Slice 4 ships an honest stand-in: recent activity is a useful signal that doesn't lie, even if it doesn't directly track DPG-readiness improvement. When the evaluator wrapper lands and starts writing dpg-score history, this pill can graduate into a true momentum metric without changing the UI contract.

---

## Slice 5 — Webhook hardening + apiProtection wiring

Two pieces of defensive plumbing that should land before any external-facing automation goes live. They were both flagged as field notes after Slice 3.

### What changed (mostly invisible to users; very visible to attackers)

**GitHub webhook signature verification.** `/api/github/webhook` now checks the `X-Hub-Signature-256` header against `GITHUB_WEBHOOK_SECRET` before doing anything. If the signature doesn't match, the request is rejected with 401 and no evaluation is queued. Without this, anyone with the URL could POST a fake payload and trigger evaluations on arbitrary projects.

If `GITHUB_WEBHOOK_SECRET` is unset (e.g. local dev without a tunnel), the handler accepts the request and logs a warning. Production should set it.

**`apiProtection` hook wired into `sequence()`.** The hook was defined but not active for as long as anyone could remember. It now runs on every `/api/*` request. Two policies:

- **Auth gate.** Requires a session for any route not on the public list. The list is in `src/lib/server/security/apiPublicRoutes.js`, method-aware (so the GET on `/api/projects/{id}` can be public while PUT/DELETE require auth), and unit-tested with 20 cases including reserved-segment edge cases like `/api/projects/store` (which would otherwise look like a project ID).
- **Origin check.** Same-origin only in production. The webhook path explicitly opts out (`skipsOriginCheck`) because GitHub doesn't send a same-origin Origin header.

### How it works

```
isPublicApiRoute(pathname, method) → boolean
skipsOriginCheck(pathname)         → boolean
```

Both are pure functions, no IO. The hook composes them:

```js
if (!isPublicApiRoute(pathname, method) && !event.locals.session) {
  return new Response('Unauthorized', { status: 401 });
}
if (!skipsOriginCheck(pathname)) {
  /* normal origin check */
}
```

`verifyGithubSignature(rawBody, signatureHeader, secret)` lives in `src/lib/server/security/githubWebhookSignature.js`. Constant-time HMAC-SHA256 comparison via `node:crypto`'s `timingSafeEqual`. Returns false (never throws) for any failure, so the handler can do `if (!verifyGithubSignature(...)) return 401`.

The webhook handler reads the body with `request.text()` first (not `.json()`), because HMAC needs the exact raw bytes — re-serializing parsed JSON wouldn't byte-match GitHub's signature.

### Public route audit (what's open and why)

| Route                                                                | Method | Why public                                 |
| -------------------------------------------------------------------- | ------ | ------------------------------------------ |
| `/api/signIn`, `/api/signUp`                                         | POST   | Auth flows                                 |
| `/api/github/webhook`                                                | POST   | Sig-verified by handler                    |
| `/api/categories`                                                    | GET    | Public reference data                      |
| `/api/projects`, `/api/projects/top`                                 | GET    | Public listing                             |
| `/api/projects/projectByCategory`                                    | GET    | Public filter                              |
| `/api/projects/{id}`, `/badge.svg`, `/github/issues`, `/evaluations` | GET    | Public per-project reads                   |
| `/api/projects/singleProject/...`                                    | GET    | Legacy single-project namespace, all reads |

Everything else now requires a session. Writes, exports, user-scoped routes (`/api/me`, `/api/profile/*`, `/api/file-upload`, `/api/projects/store`, etc.) are all protected.

### Required env var

```
GITHUB_WEBHOOK_SECRET=<paste from your GitHub repo's webhook settings>
```

Add to your local `.env` (and to Vercel/Supabase env vars in deployed environments). The handler tolerates it being missing in dev with a warning.

---

## Slice 6 — Momentum ranking (Heat Score)

The doc previously parked this item in "Blocked / deferred" because the PRD's Heat Score formula needed `dpg_score_improvement` over time and we weren't capturing that signal. Slice 6 unblocks it: snapshots are recorded going forward, the existing `dpgStatus` data is backfilled into the new history table, and the formula is wired into the explore feed.

### What changed for users

**Explore feed.** A new `🔥 Hot` pill appears on cards above the existing `Trending` / `New Evaluation` / `Funding Needed` pills, gated by a Heat Score threshold of 3. Heat Score blends:

- DPG score gain over the last 30 days (heaviest weighted at 2×)
- Recent comments on the project's update timeline (1.5×)
- Recent project updates (1×)
- A small decay penalty (0.5×) for time since the last in-product activity

A project that closed two compliance gaps in the last month and posted a single update will pass the threshold easily. A project that's been silent for a month won't, even if it picked up a stray comment.

**New API option.** `GET /api/projects?sort=heat` returns the same paginated project list, but ordered by Heat Score descending. Default ordering (`created_at` desc) is unchanged — the explore page UI still uses it. Anyone wanting a "Trending Now" surface can call this option.

### How it works

Five pieces, each independently inspectable:

- **`db/schema/migrations/0001_project_dpg_history.sql`** — creates `project_dpg_history (id, project_id, dpg_score, recorded_at)` with an index on `(project_id, recorded_at DESC)`, RLS policies (public read, authenticated insert), and a backfill query that seeds one snapshot per existing evaluated project from `projects.dpgStatus`. Idempotent: safe to re-run.
- **`src/lib/server/repo/projectDpgHistoryRepo.js`** — `recordDpgScore(projectId, score, supabase)` and `getDpgScoreDeltasByProjectIds(projectIds, sinceDate, supabase)`. Both tolerate the migration not being applied — the repo logs a one-time warning and returns empty results, so the rest of the app degrades gracefully (no Hot pill, no errors).
- **`src/lib/server/service/momentumService.js`** — pure `computeHeatScore({...})` with the formula above plus `daysSinceLastActivity(lastUpdateAt, lastEvaluationAt, now)`. Both heavily unit-tested for edge cases (negative deltas, missing dates, future timestamps, capping Infinity decay at 365 days). Exposes `HOT_PILL_THRESHOLD` so the pill threshold is one constant to tune.
- **`src/lib/server/service/projectService.js`** — `withPills` now runs four batched lookups in parallel (evals + updates + comments + dpg deltas), computes Heat Score per project, attaches it as `project.heatScore`, and feeds the score into `derivePills` for the Hot pill. Stable secondary sort by index preserves the existing created_at order on heat ties.
- **`updateProjectDpgWithHistory(projectId, dpgStatus, supabase)`** — new service wrapper that writes the dpgStatus jsonb AND records a history snapshot. The evaluator wrapper (when it lands) should call this instead of the bare `updateProjectDpg` repo function.

### Why a backfill instead of "wait for new data"

The migration backfills one row per existing project so the system has a baseline. Without it, every project's `dpgScoreDelta30d` would be 0 until two distinct snapshots accumulated — meaning the Hot pill would never fire for months. The backfill records each project's _current_ score with a timestamp of `updated_at` (or `created_at`), giving us a real "before" point against which future deltas can be measured.

### Operational note

Apply `db/schema/migrations/0001_project_dpg_history.sql` via the Supabase SQL editor before expecting Hot pills or `?sort=heat` to do anything. Without the migration, the repo tolerates the missing table (one console warning per process), the Heat Score is always 0, and no Hot pills render — code-safe but functionally inert.

---

## Other fixes shipped alongside (smaller, but worth noting)

These weren't in the V2 blueprint — they're real bugs we hit while shipping the slices above. Each is a one-file change.

- **Empty optional URL fields rejected by validator.** `z.string().regex(...).optional()` only excludes `undefined`, not `""`. Blank optional URL fields (github, linkedin, twitter, website, other) failed the regex on submit. Wrapped them in `z.preprocess` that trims and treats blank as undefined.
- **`matchedDPGs` reaching the projects insert.** A hidden form input from a half-built feature was being passed straight into Supabase. Schema has no such column → "Could not find the 'matchedDPGs' column" error. Stripped in `storeProject` alongside `tags`.
- **GitHub URL silently wiped on every keystroke.** `LinksSection.svelte` used `value={project.github || ''}` (one-way), but the parent re-rendered on every character typed in another field. The shadcn `<Input>` does `bind:value` internally, so each re-render reset the github input back to `""`. Switched to `bind:value={project.github}` and `bind:project` from the parent.
- **Layout SSR crash on every page.** `+layout.svelte` subscribed to `$page.url.pathname` to hide Nav/Footer on sign-in pages. The store needed a request-scoped Svelte context that wasn't bound, so SSR crashed. Replaced with `data.pathname` from `+layout.server.js` — no store, no context dependency.
- **Form action error reporting.** Both `/api/projects/store` and the create form action threw away the real error. Toast showed "Could not create a project" while the actual message (e.g. the matchedDPGs schema error) was hidden. Both now propagate `error.message` end-to-end.
- **Links section was missing social fields.** Section was titled "Links & Social" but only had GitHub and Website. Added LinkedIn, X (Twitter), and Other — all already accepted by the validator and present in the `projects` table; just no inputs were fed.

---

## What we did not build

These are pulled from the V2 blueprint and remain out of scope after this round.

| Feature                                  | Status                                       | Why deferred                                                                                                                                                                                                                                               |
| ---------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Evaluate Now" / Evaluator API wrapper   | Queue infrastructure exists; worker does not | The `evaluation_queue` table, queueing service, and `/api/projects/[id]/evaluate` endpoint were already in place. What is missing is the worker that actually processes queued rows. Needs LLM integration and probably a separate runtime — its own plan. |
| Interactive support / contributor widget | Not started                                  | Comments today are scoped to project _updates_, not projects directly. A "support widget" needs either a new comments-on-projects table or a clean GitHub Discussions handoff. Decision pending.                                                           |

---

## What this teed up for the next contributor

- **The `evaluation_queue` table has `report_markdown` and `report_url` columns** that no code currently writes or reads. They're waiting for the evaluator wrapper.
- **`STANDARD_META` is the right place to land any future per-standard intelligence** — pre-canned templates (LICENSE, README, CODEOWNERS), copy variants for the popover, links to "good examples" repos, etc. Keep it as static data; the popover is already structured to consume whatever the function returns.
- **The pill mechanism in `pillsService.derivePills` is extensible.** A third pill is one boolean and one CSS class. The `withPills` helper in `projectService.js` wraps every list-returning function, so any new pill shows up everywhere automatically.

---

## Field notes (small things resolved alongside the slices)

Pre-existing conditions noted during this round. Each was either fixed in-line or is now tracked as its own item in the ✅ list at the top of this doc.

- **Stale `<!-- Email -->` comment removed from `LinksSection.svelte`** — minor cleanup, mentioned only here for traceability.

The four other items previously listed here (`apiProtection` unwired, `github_repo` schema drift, BullMQ doc reference, Vitest picking up Playwright e2e files) were all resolved in Slice 5 — see the ✅ "Pre-existing issues — resolved in this round" section above.

---

## Engineering reference

### Tests

131 unit tests passing across 11 files. New tests by slice:

- **Slice 1** (31 new):
  - `src/lib/utils/github.test.js` — 11 tests for the URL parser
  - `src/lib/server/service/pillsService.test.js` — 12 tests covering pill boundaries (originally — extended in Slice 4)
  - `src/lib/server/service/githubIssuesService.test.js` — 8 tests covering cache hit, TTL expiry, stale-on-error fallback, PR filtering, per-repo isolation
- **Slice 2** (14 new):
  - `src/lib/utils/dpgStandards.test.js` — 14 tests covering the standard meta lookup, alias resolution, remediation builders for fixable and abstract standards, and missing-GitHub fallbacks
- **Slice 3** (18 new):
  - `src/lib/utils/dpgBadge.test.js` — 18 tests covering color tiers across all 0..9 scores, SVG well-formedness, score clamping (negative, > 9, NaN, null/undefined, fractional), Markdown and HTML snippet builders, and origin-trailing-slash handling
- **Slice 4** (8 new):
  - `src/lib/server/service/pillsService.test.js` — extended with 8 trending tests (2-event threshold, recent eval as activity, old eval excluded, negative/non-numeric coercion). File now totals 20 tests.
- **Slice 5** (29 new):
  - `src/lib/server/security/githubWebhookSignature.test.js` — 9 tests covering valid/tampered/wrong-secret signatures, missing/malformed headers, legacy `sha1=` prefix rejection, length-mismatch guard, garbage hex non-throwing
  - `src/lib/server/security/apiPublicRoutes.test.js` — 20 tests covering auth flows, webhook public-POST, public listing GETs, per-project read patterns, reserved-segment edge cases (`/api/projects/store`, `/api/projects/export`), singleProject reads, write rejection, user-scoped rejection, origin-check exemption
- **Slice 6** (19 new):
  - `src/lib/server/service/momentumService.test.js` — 16 tests covering each formula term (delta, comments, updates, decay), negative deltas, non-numeric coercion, Infinity decay cap, `HOT_PILL_THRESHOLD` reachability, and `daysSinceLastActivity` edge cases (one missing source, both missing, ISO strings, future timestamps from clock skew, unparseable input)
  - `src/lib/server/service/pillsService.test.js` — extended with 3 hot-pill tests (threshold met / below / missing input). File now totals 23 tests.

The existing `projectService.test.js` was updated with mocks for the two new repo deps from Slice 4 (`getRecentUpdateCountsByProjectIds`, `getRecentCommentCountsByProjectIds`); behavior unchanged.

Run all of them: `npx vitest run src/lib/utils/ src/lib/server/service/ src/routes/project/create/`

### Files added

**Slice 1**

- `src/lib/utils/github.js` — `parseGithubRepo(url)` returning `{ owner, repo }` or null
- `src/lib/server/service/pillsService.js` — pure `derivePills({ project, lastEvaluationCompletedAt })`
- `src/lib/server/service/githubIssuesService.js` — `getGoodFirstIssues(owner, repo)` with 30-min in-process cache
- `src/routes/api/projects/[id]/github/issues/+server.js` — `GET` endpoint
- Colocated `.test.js` files for each of the above

**Slice 2**

- `src/lib/utils/dpgStandards.test.js` — colocated tests for the extended util

**Slice 3**

- `src/lib/utils/dpgBadge.js` — pure SVG/Markdown/HTML builders for the README badge
- `src/lib/utils/dpgBadge.test.js` — colocated tests
- `src/routes/api/projects/[id]/badge.svg/+server.js` — public unauthenticated `GET` endpoint returning the SVG with a 1 hour cache

**Slice 4** — no new files (extends existing modules)

**Slice 5**

- `src/lib/server/security/githubWebhookSignature.js` — `verifyGithubSignature(rawBody, signatureHeader, secret)` constant-time HMAC check
- `src/lib/server/security/githubWebhookSignature.test.js` — colocated tests
- `src/lib/server/security/apiPublicRoutes.js` — `isPublicApiRoute(pathname, method)` and `skipsOriginCheck(pathname)` matchers
- `src/lib/server/security/apiPublicRoutes.test.js` — colocated tests

**Slice 6**

- `db/schema/migrations/0001_project_dpg_history.sql` — table, index, RLS policies, idempotent backfill from `projects.dpgStatus`
- `src/lib/server/repo/projectDpgHistoryRepo.js` — `recordDpgScore`, `getDpgScoreDeltasByProjectIds`, both tolerant of missing migration
- `src/lib/server/service/momentumService.js` — `computeHeatScore`, `daysSinceLastActivity`, `HOT_PILL_THRESHOLD`
- `src/lib/server/service/momentumService.test.js` — colocated tests

### Files changed

**Slice 1**

- `src/lib/server/repo/evaluationQueueRepo.js` — new `getLastCompletedByProjectIds(projectIds, supabase)`, single batched query
- `src/lib/server/service/projectService.js` — new `withPills` helper, attached to every list-returning service function (`getProjectsWithDetails`, `getTopProjectsByReadiness`, `getUserProjects`, `getProjectsByCategory`, `getProjectById`, `getUserBookmarkedProjects`, `getUserContributedProjects`)
- `src/lib/Card.svelte` — pill row above DPGReadiness; scoped CSS for two pill variants using existing dashboard color tokens
- `src/lib/Issues.svelte` — fetches from the new endpoint, filters by `good-first-issue`, shows the count

**Slice 2**

- `src/lib/utils/dpgStandards.js` — added `STANDARD_META` table, `getStandardMeta`, `getRemediation`, `getDocsUrl`. `getIconForStandard` now reads through the same table.
- `src/lib/dpgStatus.svelte` — popover for failing items uses `getRemediation` + `getDocsUrl`; renders one of three Next-Steps states (CTA available / no GitHub URL / abstract standard) plus a docs link.
- `src/routes/project/[id]/+page.svelte` — contributors fetch uses `parseGithubRepo` instead of inline split
- `src/lib/GitContributorsViewAll.svelte` — same
- `src/routes/project/[id]/contribute/+page.svelte` — issues fetch uses `parseGithubRepo`

**Slice 3**

- `src/lib/dpgStatus.svelte` — appended a "Show your DPG score" panel below the Overall Assessment block. Renders the live badge `<img>`, Markdown snippet, HTML snippet, and copy buttons. Snippets are built reactively from `$page.url.origin` so they always match the host the user is viewing.

**Slice 4**

- `src/lib/server/repo/projectUpdatesRepo.js` — added `getRecentUpdateCountsByProjectIds(projectIds, sinceDate, supabase)`
- `src/lib/server/repo/projectUpdateCommentRepo.js` — added `getRecentCommentCountsByProjectIds(projectIds, sinceDate, supabase)`
- `src/lib/server/service/pillsService.js` — `derivePills` now returns `trending: boolean`; new private `isTrending` helper
- `src/lib/server/service/projectService.js` — `withPills` now runs three batched lookups in parallel (evals + updates + comments) instead of one
- `src/lib/server/service/projectService.test.js` — added mocks for the two new repo deps so the existing 5 tests still pass
- `src/lib/Card.svelte` — added the orange "Trending" chip to the pills row; new `.pill-trending` CSS

**Slice 5**

- `src/routes/api/github/webhook/+server.js` — reads body as text, verifies signature against `GITHUB_WEBHOOK_SECRET`, then parses JSON and dispatches
- `src/hooks.server.js` — refactored `apiProtection` to use the new public-route matcher; wired `apiProtection` into `sequence(supabase, authGuard, apiProtection)`
- `vite.config.js` — added `test.exclude` to keep Playwright `e2e/*.spec.js` files out of the Vitest run
- `db/schema/schema.sql` — `github_repo` → `github` with a comment about the legacy name
- `CLAUDE.md` — Async Job Processing section rewritten to describe the real Supabase-table-based queue (no BullMQ)

**Slice 6**

- `src/lib/server/service/projectService.js` — `withPills` extended with a 4th batched lookup (`getDpgScoreDeltasByProjectIds`); computes `heatScore` per project and feeds it into `derivePills`. New `getProjectsWithDetails(..., sort)` parameter accepts `'heat'` for descending Heat Score ordering. New `updateProjectDpgWithHistory` service wrapper for evaluators to call.
- `src/lib/server/service/projectService.test.js` — added mock for the new repo dep so existing 5 tests still pass
- `src/lib/server/service/pillsService.js` — `derivePills` now returns `hot: boolean`, gated by `HOT_PILL_THRESHOLD` from momentumService
- `src/routes/api/projects/+server.js` — accepts `?sort=heat` query param and passes it through
- `src/lib/Card.svelte` — added the `🔥 Hot` chip to the pills row; new `.pill-hot` CSS with a saturated red/pink gradient

**Bug-fix changes alongside the slices** (see "Other fixes shipped alongside")

- `src/lib/server/validator/projectSchema.js` — preprocess wrappers on optional URL fields
- `src/lib/server/service/projectService.js` — destructure `matchedDPGs` so it doesn't reach the insert
- `src/lib/components/LinksSection.svelte` — `bind:value`, plus initial-value setup, plus social fields
- `src/routes/project/create/+page.svelte` and `src/routes/project/[id]/edit/+page.svelte` — `bind:project` so changes propagate
- `src/routes/+layout.server.js` and `src/routes/+layout.svelte` — `data.pathname` instead of `$page` store
- `src/routes/api/projects/store/+server.js` and `src/routes/project/create/+page.server.js` — propagate real error messages

### Manual verification checklist

Run `npm run dev` and check each:

**Slice 1**

1. **Explore feed** — Visit `/explore`. Pills render on seeded cards. Network tab shows one `/api/projects` call and zero direct `api.github.com` calls.
2. **Funding Needed** — In Supabase Studio, set a project to `current_funding = 0, funding_goal = 1000`. Reload `/explore`. The pill appears on that card.
3. **New Evaluation** — Insert an `evaluation_queue` row for a project with `status = 'completed', completed_at = now()`. Reload `/explore`. The pill appears.
4. **Good First Issues** — Visit `/project/{id}` for a project whose GitHub repo has `good-first-issue` items. Open the Issues tab. Network tab shows a request to `/api/projects/{id}/github/issues`. Reload within 30 minutes; the response includes `"fromCache": true`.
5. **No GitHub URL on project** — Visit a project with no GitHub URL. Issues tab renders the empty state without errors.

**Slice 2**

6. **Fixable standard with GitHub URL** — On a project that has failed "Use of Approved Open Licenses" and has a GitHub URL set, click that card on the DPG Status tab. The popover shows a purple "Add a LICENSE file on GitHub" button that opens GitHub's license-creation flow in a new tab. Below it, "Learn more about this standard" links to the DPG docs.
7. **Abstract standard** — Click a failing card for "Platform Independence" or "Do No Harm By Design". The popover shows the explanatory copy ("This standard isn't directly fixable in code...") plus the docs link, no GitHub button.
8. **No GitHub URL on project** — On a project with no GitHub URL, click any failing fixable standard. The popover shows "Add a GitHub repo to your project to get a one-click fix" plus the docs link.
9. **Completed standards** — Already-passing standards still open the existing green popover with the AI Assessment. Behavior unchanged from Slice 1.

**Slice 3**

10. **Badge endpoint serves valid SVG** — `curl -i http://localhost:5173/api/projects/{id}/badge.svg` returns `200 OK`, `Content-Type: image/svg+xml; charset=utf-8`, `Cache-Control: public, max-age=3600`, and a body that starts with `<svg` and ends with `</svg>`.
11. **Color matches score tier** — Open the badge URL in a browser. A 0/9 project shows red, 1–3 shows orange, 4–6 yellow, 7–8 yellow-green, 9/9 bright green.
12. **Snippet panel renders on the project page** — Visit `/project/{id}` for an evaluated project, open the DPG Status tab, scroll to the bottom. The "Show your DPG score" panel shows the live badge preview plus the Markdown and HTML snippets.
13. **Copy works** — Click "Copy" next to either snippet. Toast confirms the copy. Paste into a text editor; the snippet matches the displayed code exactly.
14. **Badge link points to the project** — Paste the Markdown into any GitHub README preview. The badge image renders, and clicking it lands on `/project/{id}`.
15. **Unevaluated project hides the panel** — Visit `/project/{id}` for a project that has not yet been evaluated. The DPG Status tab shows the empty/pending state. The badge panel does not render (it's gated on `dpgStatuses != null`).

**Slice 4**

16. **Trending pill renders** — In Supabase Studio, insert two `project_updates` rows for the same project with `created_at = now()`. Reload `/explore`. The orange "Trending" pill appears on that card, alongside any other pills.
17. **Activity threshold is honored** — Insert just one update. Reload. The pill does NOT appear (one event isn't enough). Add a comment on that update — pill appears.
18. **Old activity is excluded** — Update an existing `project_updates.created_at` to 30 days ago. Reload. That row no longer counts toward Trending.
19. **No N+1 on the explore feed** — DevTools Network tab shows ONE `/api/projects` call (no per-card requests). Server logs show three Supabase queries per page render (evaluations + updates + comments), independent of card count.

**Slice 5**

20. **Webhook rejects unsigned requests in production** — With `GITHUB_WEBHOOK_SECRET` set, `curl -X POST http://localhost:5173/api/github/webhook -d '{}'` returns `401 invalid signature`.
21. **Webhook accepts a valid signature** — `curl` with the correct `X-Hub-Signature-256` header (HMAC-SHA256 of body, hex, `sha256=` prefix) returns `200`.
22. **Webhook tolerates missing secret in dev** — Unset the env var. Repeat the unsigned curl. Server logs show a warning, request is accepted.
23. **`apiProtection` blocks anonymous writes** — `curl -X POST http://localhost:5173/api/projects/store -d '{}'` returns `401 Unauthorized` (no session cookie).
24. **`apiProtection` allows public reads** — `curl http://localhost:5173/api/projects` returns `200` with the project list. `curl http://localhost:5173/api/projects/{id}/badge.svg` returns the SVG.
25. **Reserved-segment edge cases** — `curl http://localhost:5173/api/projects/store` (GET) returns `401`, not the project list (proves `store` isn't being treated as a project ID).
26. **No spurious vitest failures** — `npm run test` reports `Test Files 10 passed (10)` and zero `e2e/*.spec.js` lines. The Playwright suite still runs separately via its own command.

**Slice 6**

27. **Migration applies cleanly** — Run `db/schema/migrations/0001_project_dpg_history.sql` in Supabase SQL editor. Table is created, index is built, RLS is enabled, and one row per evaluated project is backfilled. Re-running the file does nothing (idempotent).
28. **Heat Score endpoint** — `curl 'http://localhost:5173/api/projects?sort=heat&limit=10'` returns projects ordered by `heatScore` descending. The default (no `sort` param) still returns by `created_at` desc.
29. **Hot pill renders** — Pick a project, in Supabase Studio insert two `project_dpg_history` rows for it: one with `dpg_score = 2, recorded_at = now() - interval '20 days'` and one with `dpg_score = 5, recorded_at = now()`. Reload `/explore`. The 🔥 Hot chip appears on that card.
30. **Hot pill respects the threshold** — Insert a single `project_dpg_history` row with `dpg_score = 5` for a quiet project. Reload. The Hot pill does NOT appear (delta 0, no recent updates → heatScore well below 3).
31. **Without the migration the system stays stable** — On a fresh checkout where the migration hasn't been applied, the explore feed still loads, no Hot pills render, server logs show one `[projectDpgHistoryRepo:...] table query failed` warning per process. No 500s, no broken UI.
32. **History captures going forward** — Call `updateProjectDpgWithHistory(projectId, newDpgStatus, supabase)` from a server context. Verify a new row appears in `project_dpg_history` with the computed score (count of `overallScore === 1` items in the new jsonb).
