## Project Overview

DPG Pipeline is a SvelteKit web platform by the Christex Foundation for managing Digital Public Goods (DPGs). It connects contributors, funders, and open-source projects aligned with UN Sustainable Development Goals.

**CHANGELOG**: Only update `CHANGELOG.md` for actual releases, not internal refactors or cleanup. Versions in the changelog must match `package.json` version. Bump `package.json` version when cutting a release, and add the corresponding changelog entry at that point.

## Commands

```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run check        # TypeScript/Svelte type checking
npm run format       # Prettier formatting (required to pass CI)
npm run test         # Run Vitest tests
npx vitest run src/lib/server/service/exportService.test.js  # Run a single test file
```

CI runs `npm run format` on PRs. Tests are not yet enforced in CI but exist under `src/lib/server/service/`.

## Architecture

### Three-Layer Server Pattern

All server-side code lives in `src/lib/server/` and follows a strict layered architecture:

1. **Repo Layer** (`src/lib/server/repo/`) — Direct Supabase database queries. Pure data access, no business logic. Every function takes `supabase` as its last parameter.
2. **Service Layer** (`src/lib/server/service/`) — Business logic that orchestrates repos. Handles data transformation, external API calls (OpenAI, GitHub), and job queuing. Services never call the database directly.
3. **Validator Layer** (`src/lib/server/validator/`) — Zod schemas for input validation. Used in form actions and API endpoints via `.safeParse()`.

### Routing & Data Flow

- **API routes** (`src/routes/api/`) — RESTful `+server.js` files with GET/POST/PUT/DELETE handlers. Access Supabase via `locals.supabase`.
- **Page server loads** (`+page.server.js`, `+layout.server.js`) — Server-side data fetching. The root `+layout.server.js` loads auth state and user profile for all pages.
- **Form actions** — Project creation and profile editing use SvelteKit form actions with Zod validation and Svelte Superforms.
- **Client loads** (`+page.js`) — Some pages (explore, contribute, edit) use client-side fetch to `/api/` endpoints.

### Auth & Middleware (`src/hooks.server.js`)

Three hooks run via `sequence()`:
1. **supabase** — Creates request-scoped Supabase client, attaches to `locals.supabase`
2. **authGuard** — Validates JWT, sets `locals.session` and `locals.authUser`, redirects unauthenticated users from protected routes (`/profile`, `/project/create`)
3. **apiProtection** — Origin validation and auth checks for API routes

### Async Job Processing

Project evaluation runs **out-of-process**. When a project is created or re-evaluated, a row is inserted into `public.evaluation_queue` (see `db/migrations/001_evaluation_queue.sql`). A separate service (`~/Github/dpg-evaluator`) polls the queue with `service_role` credentials, fetches GitHub repo files, evaluates against the 9 DPG criteria, and writes results back to `projects.dpgStatus`. This app does not run AI or hold the OpenAI key.

Per-criterion results are stored in the `projects.dpgStatus` JSONB column as `{ status: [{ name, overallScore, explanation }, ...], final_recommendation }`. A failed criterion has `overallScore !== 1`.

### State Management

- `src/lib/stores/authStore.js` — Svelte writable stores for `isAuthenticated` and `user`
- `src/lib/utils.js` — Exports `cn()` (clsx + tailwind-merge), `clickOutside` action, `flyAndScale` transition, `searchBarOpen` store

## Key Conventions

- **Component library**: Shadcn/ui for Svelte (`src/lib/components/ui/`). Custom components live alongside in `src/lib/`.
- **Styling**: TailwindCSS with custom theme — primary purple (`#ad89fd`), accent lime (`#bde35b`), font Space Grotesk. Dark mode is class-based.
- **Formatting**: Prettier with svelte + tailwindcss plugins. 100 char width, single quotes, trailing commas, 2-space indent.
- **Env vars**: `VITE_` prefix for client-accessible, `PRIVATE_` prefix for server-only. Note: the anon key var has a typo (`VITE_SUPERBASE_ANON_KEY`) that must be preserved.
- **Database**: Supabase (PostgreSQL). Schema in `db/schema/schema.sql`. Two clients: request-scoped SSR client and `adminAuthClient` for admin operations.
- **Testing**: Vitest. Test files live next to the code they test (e.g., `exportService.test.js`).
