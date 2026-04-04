# Criterion 4 Repo Cleanup Spec

This document defines how to address [issue #444](https://github.com/christex-foundation/pipeline/issues/444).

It is intentionally narrow.

The goal is to fix the currently verified architecture violations that weaken:

- DPG Criterion 4: Platform Independence
- the repository pattern documented in `src/lib/server/repo/README.md`
- the provider abstraction pattern documented in `src/lib/server/providers/README.md`
- the Dependency Inversion Principle in SOLID

---

## Problem

Several route files still bypass the intended architecture by:

- importing the global Supabase client directly
- doing data orchestration in route handlers
- returning HTTP response objects from the repo layer
- using the wrong client where request-scoped injection is expected

This matters because platform independence depends on keeping vendor-specific client usage behind stable abstraction boundaries.

If route handlers own those details, migration away from Supabase becomes harder and the codebase becomes less trustworthy as a DPG-ready product.

---

## Scope

This spec covers only the verified issue surface for `#444`.

### In Scope

- `src/routes/api/projects/+server.js`
- `src/routes/api/projects/singleProject/[id]/projectMembers/+server.js`
- `src/routes/api/projects/singleProject/[id]/invitemember/+server.js`
- `src/routes/api/projects/singleProject/[id]/projectUpdates/store/+server.js`
- `src/routes/api/projects/user/bookmarks/+server.js`
- `src/routes/api/projects/user/projects/+server.js`
- `src/routes/api/projects/user/contributed/+server.js`
- `src/lib/server/repo/imageUploadRepo.js`

### Out of Scope

- evaluator workflow changes
- project-page comment redesign
- broader service-layer refactors unrelated to these files
- changing product behavior unless required to correct a broken endpoint

---

## Architectural Target

The intended flow is:

`Routes -> Services -> Repos`

and separately:

`Services -> Providers`

### Rules

#### Routes

- parse input
- read auth and request-scoped dependencies from `locals`
- call a service
- convert success and failure into HTTP responses

Routes should not:

- import the global Supabase client
- perform multi-step data orchestration when a service can own it
- know storage/database implementation details beyond passing injected clients

#### Services

- coordinate business logic
- compose repo calls
- compose provider calls
- return plain values or throw errors

#### Repos

- encapsulate database access
- take injected client as last parameter
- return plain values
- throw `Error` on failure

Repos should not:

- return SvelteKit `json()` responses
- create HTTP semantics

---

## File-by-File Plan

## 1. `src/routes/api/projects/+server.js`

### Current Problem

- `GET` uses the service path correctly
- `POST` performs a direct insert with the global Supabase client
- this creates a second write path outside the main project creation flow

### Plan

- remove the dead `POST` handler entirely if no product path depends on it
- keep `GET` using `getProjectsWithDetails()`
- remove the global `supabase` import

### Expected Outcome

- project writes only happen through the intended service-backed creation path
- no route-level direct database write remains in this file

---

## 2. `src/routes/api/projects/singleProject/[id]/projectMembers/+server.js`

### Current Problem

- imports global Supabase client
- performs route-level member query plus profile query plus merge

### Plan

- create a service wrapper if needed, or reuse the existing `getTeamMembers()` service from `projectService.js`
- refactor the route to:
  - read `id`
  - call service with `locals.supabase`
  - return JSON

### Expected Outcome

- route no longer owns member/profile merge logic
- route no longer imports the global client

---

## 3. `src/routes/api/projects/singleProject/[id]/invitemember/+server.js`

### Current Problem

- imports global Supabase client
- incomplete endpoint
- unclear whether this route should exist as-is

### Plan

Decide one of two paths:

#### Option A: Remove

Use this if the endpoint is obsolete and unused.

#### Option B: Complete

If the endpoint is needed:

- define its actual contract
- move data access into service/repo helpers
- use `locals.supabase`
- return a real response

### Expected Outcome

- no incomplete API surface remains

### Recommendation

Prefer removal unless current UI or product flow still needs this route.

---

## 4. `src/routes/api/projects/singleProject/[id]/projectUpdates/store/+server.js`

### Current Problem

- imports global Supabase client
- passes global client into `createProjectUpdate()`

### Plan

- remove the global import
- pass `locals.supabase` to the service

### Expected Outcome

- request-scoped dependency injection is restored

---

## 5. User Project Routes

Files:

- `src/routes/api/projects/user/bookmarks/+server.js`
- `src/routes/api/projects/user/projects/+server.js`
- `src/routes/api/projects/user/contributed/+server.js`

### Current Problem

- each file imports the global Supabase client
- each file already uses `locals.supabase`
- the import is dead and misleading

### Plan

- remove the unused import from each route

### Expected Outcome

- route files no longer imply hidden global coupling

---

## 6. `src/lib/server/repo/imageUploadRepo.js`

### Current Problem

- repo function returns `json(...)` on error
- that violates the documented repo contract

### Plan

- replace `return json(...)` with `throw new Error(error.message)`
- let the calling service/route shape the HTTP response

### Expected Outcome

- repo returns plain values only
- repo errors are handled by upper layers

---

## Implementation Order

Recommended order:

1. remove dead imports and wrong client usage
2. fix `imageUploadRepo.js`
3. remove or refactor dead `POST` in `/api/projects/+server.js`
4. refactor `projectMembers`
5. decide remove vs complete for `invitemember`

This order reduces risk because it starts with the lowest-behavior-change fixes.

---

## Verification Plan

### Static Verification

- run `npm run check`
- run `npm run build`
- grep for the remaining relevant route imports of `$lib/server/supabase.js`

### Behavioral Verification

- verify project listing still works
- verify project members endpoint still returns the same shape
- verify project update creation still works
- verify profile user-project tabs still work
- verify image upload errors still surface correctly

---

## Risks

### 1. Hidden Consumer Risk

The dead `POST` in `/api/projects/+server.js` may still be used outside the main frontend flow.

Mitigation:

- search for internal callers before removal
- if uncertain, convert instead of delete

### 2. `invitemember` Ambiguity

The route is incomplete, so there is no trustworthy current contract.

Mitigation:

- prefer removal if unused
- only complete it if a real caller exists

### 3. Shape Drift in `projectMembers`

Refactoring through a service could accidentally change response shape.

Mitigation:

- preserve existing `{ members: [...] }` response shape

---

## Definition of Done

- verified files no longer violate the intended repo/provider boundary
- route handlers no longer rely on the global Supabase client in the targeted cases
- repos return plain values or throw errors
- no incomplete endpoint remains in the targeted set
- the code still passes build/type checks

---

## Notes

This issue should be treated as an architecture correction with DPG impact, not generic cleanup.

The practical outcome is a smaller lock-in surface and a clearer migration path, which supports Criterion 4 directly.
