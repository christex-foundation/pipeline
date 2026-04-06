# ADR 0001: Keep Vendor Clients Out of Routes

## Status

Proposed

## Date

2026-04-06

## Context

Pipeline currently exposes a request-scoped Supabase client as `event.locals.supabase`.
Many routes either use that client directly or pass it through service and repository call sites.

That has three practical problems:

- route handlers know about a vendor-specific persistence client
- replacing Supabase would require changing many route-level call sites
- services and repositories do not have a single clear dependency flow

This ADR is primarily about software design:

- routes should depend on application behavior, not persistence details
- services should coordinate business logic
- repositories should isolate database access
- vendor clients should stay behind those boundaries

This also supports testing and reduces migration surface area.
It is related to DPG Criterion 4, but that is a secondary benefit, not the main reason for the decision.

## Decision

Pipeline will use this request flow:

- routes import service functions directly
- services import repositories directly
- repositories receive the database dependency
- routes pass a small request context object into services when request-scoped dependencies are needed
- services must not accept raw SvelteKit `locals`

The target boundary shape is:

```js
// route
import { getMembers } from '$lib/server/service/projectService.js';

export async function GET({ params, locals }) {
  const members = await getMembers(params.id, {
    db: locals.db,
    authUser: locals.authUser
  });

  return Response.json({ members });
}

// service
import { listByProject } from '$lib/server/repo/memberRepo.js';

export async function getMembers(projectId, ctx) {
  return listByProject(projectId, ctx.db);
}
```

This decision does not require a service container or per-request service factory in `hooks.server.js`.

## Repository Contract

Repositories remain the persistence boundary.

Repository functions should:

- expose application-oriented operations such as `listByProject(projectId, db)`
- accept the database dependency explicitly
- return plain values or throw errors
- avoid framework-specific HTTP concerns

Repository functions should not:

- return SvelteKit response helpers
- depend on route context
- expose vendor-specific behavior above the repository layer

This keeps the current repository style mostly intact while tightening how it is used.

## Before and After

### Before

```js
import { json } from '@sveltejs/kit';
import { createProjectUpdate } from '$lib/server/service/projectUpdatesService.js';

export async function POST({ params, request, locals }) {
  const { title, body } = await request.json();

  await createProjectUpdate(
    {
      project_id: params.id,
      title,
      body,
      user_id: locals.authUser.id
    },
    locals.supabase
  );

  return json({ ok: true });
}
```

### After

```js
import { json } from '@sveltejs/kit';
import { createProjectUpdate } from '$lib/server/service/projectUpdatesService.js';

export async function POST({ params, request, locals }) {
  const { title, body } = await request.json();

  await createProjectUpdate(
    {
      projectId: params.id,
      title,
      body,
      userId: locals.authUser.id
    },
    {
      db: locals.db,
      authUser: locals.authUser
    }
  );

  return json({ ok: true });
}
```

```js
import { storeProjectUpdate } from '$lib/server/repo/projectUpdatesRepo.js';

export async function createProjectUpdate(input, ctx) {
  return storeProjectUpdate(
    {
      project_id: input.projectId,
      title: input.title,
      body: input.body,
      user_id: input.userId
    },
    ctx.db
  );
}
```

## Alternatives Considered

### 1. Keep `locals.supabase` as the route-level dependency

Rejected.

This keeps routes coupled to a vendor client and makes migration noisier than it needs to be.

### 2. Pass raw `locals` into services

Rejected.

This makes services depend on SvelteKit request objects and weakens testability.

### 3. Build request-scoped service factories in `hooks.server.js`

Rejected for now.

This keeps routes very clean, but it adds per-request wiring and indirection that is not justified for the current codebase.

### 4. Let repositories import a global Supabase client internally

Rejected.

This reduces ceremony, but it introduces hidden dependencies and weakens request scoping, testability, and portability.

## Consequences

### Positive

- routes depend on service functions instead of vendor clients
- services stay framework-agnostic
- repositories stay the persistence boundary
- replacing Supabase later touches fewer files
- route and service tests can inject a fake `db` without mocking global clients

### Negative

- routes still construct a small dependency object
- repository functions continue to take an explicit dependency parameter
- the codebase may temporarily contain both old and new patterns during migration

## Testing Impact

This decision makes tests simpler.

Route tests can stub a small request context object.
Service tests can call service functions with a fake `db`.
Repository tests can focus on query behavior without mocking route or framework state.

## Standard Request Context

The current standard request context is:

```js
/**
 * @typedef {object} RequestContext
 * @property {any} db
 * @property {any | null | undefined} authUser
 */
```

This matches current usage in the codebase.
If future services need more request-scoped data, the context can be extended deliberately.

Each service should document the subset it relies on with JSDoc.

## Adoption Notes

This ADR is not implemented yet.

The intended migration path is:

1. stop adding new route-level uses of `locals.supabase`
2. introduce a neutral request context shape
3. update routes to call services with that context
4. keep repository functions as the explicit boundary for database access
