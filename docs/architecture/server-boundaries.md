# Server Layer Boundaries

All server-side code lives in `src/lib/server/` and follows a strict three-layer architecture. ESLint rules enforce these boundaries at lint time.

## The Three Layers

### Routes (`src/routes/`)

Entry points for HTTP requests. Routes handle request/response concerns (parsing params, returning JSON) and delegate all data access and business logic to the **service layer**.

**Can import:** services (`$lib/server/service/*`), validators (`$lib/server/validator/*`)
**Cannot import:** repos (`$lib/server/repo/*`), the Supabase client (`$lib/server/supabase.js`)

Routes receive the request-scoped Supabase client via `locals.supabase` and pass it to service functions.

### Services (`src/lib/server/service/`)

Business logic layer. Services orchestrate one or more repos, handle data transformation, interact with external APIs (OpenAI, GitHub), and manage job queuing.

**Can import:** repos (`$lib/server/repo/*`), other services, providers (`$lib/server/providers/*`)
**Cannot import:** route files (`src/routes/*`), the Supabase client directly (`$lib/server/supabase.js`)

Services receive the Supabase client as a parameter and pass it through to repos.

### Repos (`src/lib/server/repo/`)

Pure data access layer. Each repo function executes a single Supabase query. Every function takes `supabase` as its **last parameter**.

**Can import:** providers (`$lib/server/providers/*`)
**Cannot import:** other repos, HTTP helpers (`json`, `redirect`, `error` from `@sveltejs/kit`), services

Repos must not contain business logic or return HTTP responses.

## Data Flow

```
Request -> Route -> Service -> Repo -> Supabase
                                  \-> Provider (storage, AI, queue)
```

The Supabase client flows from `locals.supabase` in the route, through the service, and into the repo as a function parameter.

## Lint Check

Run the boundary lint check with:

```bash
npm run lint
```

This executes ESLint with architecture rules defined in `eslint.config.js`. The rules enforce:

1. Routes cannot import from `$lib/server/repo/*`
2. Routes cannot import from `$lib/server/supabase.js`
3. Repos cannot import HTTP helpers (`json`, `redirect`, `error`) from `@sveltejs/kit`
4. Repos cannot import other repos
5. Services cannot import from `$lib/server/supabase.js`
6. Services cannot import route files
