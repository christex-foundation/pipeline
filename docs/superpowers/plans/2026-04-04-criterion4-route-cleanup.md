# Criterion 4 Route Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove remaining route-level Supabase bypasses that weaken platform independence (DPG Criterion 4).

**Architecture:** Six targeted fixes across 8 files. All changes enforce the existing Routes -> Services -> Repos layered architecture. No new abstractions are introduced — the fixes align existing code with the documented patterns in `src/lib/server/repo/README.md` and `src/lib/server/providers/README.md`.

**Tech Stack:** SvelteKit, Supabase JS client (request-scoped via `locals.supabase`)

---

### Task 1: Remove dead global imports from user-project routes

**Files:**
- Modify: `src/routes/api/projects/user/bookmarks/+server.js`
- Modify: `src/routes/api/projects/user/projects/+server.js`
- Modify: `src/routes/api/projects/user/contributed/+server.js`

These three files import the global `supabase` from `$lib/server/supabase.js` but already use `locals.supabase`. The `contributed` route also imports `getUserBookmarkedProjects` but only calls `getUserContributedProjects`.

- [ ] **Step 1: Fix `bookmarks/+server.js`**

Remove the unused global import on line 1:

```javascript
// REMOVE: import { supabase } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';
import { getUserBookmarkedProjects } from '$lib/server/service/projectService.js';
```

- [ ] **Step 2: Fix `projects/+server.js`**

Remove the unused global import on line 1:

```javascript
// REMOVE: import { supabase } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';
import { getUserProjects } from '$lib/server/service/projectService.js';
```

- [ ] **Step 3: Fix `contributed/+server.js`**

Remove the unused global import on line 1 and the unused `getUserBookmarkedProjects` import:

```javascript
// REMOVE: import { supabase } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';
// REMOVE getUserBookmarkedProjects — only getUserContributedProjects is used
import { getUserContributedProjects } from '$lib/server/service/projectService.js';
```

- [ ] **Step 4: Run type check**

Run: `npm run check`
Expected: No new errors.

- [ ] **Step 5: Commit**

```bash
git add src/routes/api/projects/user/bookmarks/+server.js \
  src/routes/api/projects/user/projects/+server.js \
  src/routes/api/projects/user/contributed/+server.js
git commit -m "refactor: remove dead global supabase imports from user-project routes"
```

---

### Task 2: Fix wrong client in `projectUpdates/store`

**Files:**
- Modify: `src/routes/api/projects/singleProject/[id]/projectUpdates/store/+server.js`

This route imports the global `supabase` client and passes it to `createProjectUpdate()` instead of the request-scoped `locals.supabase`.

- [ ] **Step 1: Replace global import with `locals.supabase`**

The full file becomes:

```javascript
import { createProjectUpdate } from '$lib/server/service/projectUpdatesService.js';
import { json } from '@sveltejs/kit';

export async function POST({ params, request, locals }) {
  const { id } = params;
  const { title, body } = await request.json();

  let user = locals.authUser;
  let supabase = locals.supabase;

  try {
    await createProjectUpdate({ project_id: id, title, body, user_id: user.id }, supabase);

    return json({ success: true }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Run type check**

Run: `npm run check`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/routes/api/projects/singleProject/[id]/projectUpdates/store/+server.js
git commit -m "fix: use request-scoped supabase client in projectUpdates/store"
```

---

### Task 3: Fix `imageUploadRepo.js` — throw Error instead of returning HTTP response

**Files:**
- Modify: `src/lib/server/repo/imageUploadRepo.js`
- Modify: `src/lib/server/service/imageUploadService.js` (verify caller handles thrown error)

The repo currently catches the `uploadFile` error and returns `json({ error }, { status: 500 })` — an HTTP response object. Per the repo contract, it should throw an `Error`.

The caller `imageUploadService.js` calls `uploadImage()` and returns the result directly as a URL string. The callers of the service (`+page.server.js` files) already wrap calls in try/catch. So changing the repo to throw will propagate correctly.

- [ ] **Step 1: Fix `imageUploadRepo.js` to throw on error**

Remove the `json` import and throw instead of returning an HTTP response:

```javascript
import { uploadFile, getPublicUrl, deleteFiles } from '$lib/server/providers/storageProvider.js';

const BUCKET = 'pipeline-images';

export async function uploadImage(file, supabase) {
  const timestamp = Date.now();
  const originalFileName = file.name;
  const fileExtension = originalFileName.split('.').pop();
  const fileNameWithoutExtension =
    originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
  const newFileName = `${fileNameWithoutExtension}-${timestamp}.${fileExtension}`;
  const path = `uploads/${newFileName}`;

  await uploadFile(BUCKET, path, file, supabase);

  return getPublicUrl(BUCKET, path, supabase);
}

export async function deleteImage(fileName, supabase) {
  return deleteFiles(BUCKET, [`uploads/${fileName}`], supabase);
}
```

The `uploadFile` provider already throws on failure, so removing the try/catch lets the error propagate naturally. The service layer caller (`imageUploadService.js`) doesn't need changes — it returns the URL directly, and its callers already handle errors.

- [ ] **Step 2: Run type check**

Run: `npm run check`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/server/repo/imageUploadRepo.js
git commit -m "fix: imageUploadRepo throws Error instead of returning HTTP response"
```

---

### Task 4: Remove dead `POST` handler from `/api/projects/+server.js`

**Files:**
- Modify: `src/routes/api/projects/+server.js`

The `POST` handler uses the global Supabase client for a direct insert into `projects`. The real project creation flow uses `/api/projects/store` -> `storeProject()` service. No callers of this `POST` endpoint were found. The `GET` handler is still needed (used by the explore page).

- [ ] **Step 1: Remove the dead `POST` and the global import**

The `GET` handler already uses `locals.supabase` via a local variable. Remove the global import (line 3) and the entire `POST` handler:

```javascript
//@ts-check

import { getProjectsWithDetails } from '$lib/server/service/projectService.js';

import { json } from '@sveltejs/kit';

export async function GET({ url, locals, setHeaders }) {
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '6', 10);
  const term = url.searchParams.get('term') || '';
  let supabase = locals.supabase;

  try {
    const projects = await getProjectsWithDetails(term, page, limit, supabase);

    return json({ projects: projects }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Run type check**

Run: `npm run check`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/routes/api/projects/+server.js
git commit -m "refactor: remove dead direct-write POST from /api/projects"
```

---

### Task 5: Refactor `projectMembers` to use service layer

**Files:**
- Modify: `src/routes/api/projects/singleProject/[id]/projectMembers/+server.js`

The route currently imports the global Supabase client and performs inline multi-table orchestration (query `project_members`, query `profile`, join them). This exact logic already exists in `projectService.getTeamMembers()`. Replace the inline code with a service call using `locals.supabase`.

- [ ] **Step 1: Rewrite `projectMembers/+server.js` to use the service**

```javascript
//@ts-check
import { getTeamMembers } from '$lib/server/service/projectService.js';
import { json } from '@sveltejs/kit';

export async function GET({ params, locals }) {
  const { id } = params;
  const supabase = locals.supabase;

  try {
    const members = await getTeamMembers(id, supabase);
    return json({ members }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Run type check**

Run: `npm run check`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/routes/api/projects/singleProject/[id]/projectMembers/+server.js
git commit -m "refactor: projectMembers route delegates to service layer"
```

---

### Task 6: Remove incomplete `invitemember` endpoint

**Files:**
- Delete: `src/routes/api/projects/singleProject/[id]/invitemember/+server.js`

The endpoint imports the global client, queries `project_members`, and returns nothing. No callers exist. The `ProjectMembers.svelte` component has an invite form but it is not wired to this endpoint (no `fetch` call). Removing it eliminates dead code that implies functionality that does not exist.

- [ ] **Step 1: Delete the file**

```bash
rm src/routes/api/projects/singleProject/[id]/invitemember/+server.js
```

- [ ] **Step 2: Run type check**

Run: `npm run check`
Expected: No new errors (no callers reference this endpoint).

- [ ] **Step 3: Commit**

```bash
git add src/routes/api/projects/singleProject/[id]/invitemember/+server.js
git commit -m "refactor: remove incomplete invitemember endpoint (no callers)"
```

---

### Task 7: Verification

- [ ] **Step 1: Run full type check**

Run: `npm run check`
Expected: Clean pass.

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 3: Verify no remaining global Supabase imports in target files**

Run: `grep -r "from '\$lib/server/supabase" src/routes/api/projects/`
Expected: No matches.

- [ ] **Step 4: Run formatter**

Run: `npm run format`
Expected: Clean pass (CI requires this).

- [ ] **Step 5: Update CHANGELOG**

Add a new entry under `[0.9.1]` or create `[0.9.2]` with the changes made.

- [ ] **Step 6: Final commit**

```bash
git add CHANGELOG.md
git commit -m "docs: update CHANGELOG for criterion 4 route cleanup"
```
