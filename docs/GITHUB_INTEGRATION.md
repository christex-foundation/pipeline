
# GitHub Integration Setup

This guide covers everything needed to enable the **Connect GitHub** button on `/profile/settings`. It links a user's GitHub account to their DPG Pipeline account through Supabase and stores a GitHub OAuth token so the app can act on the user's behalf (create issues, list PRs, etc.).

> Scope: the user-facing Connect GitHub flow only. The project-level webhook (`/api/github/webhook`) is a separate feature — see the README.

## Prerequisites

- A Supabase project with admin access to the Dashboard
- This app running locally (for the dev OAuth App) and/or deployed (for the prod OAuth App)
- A GitHub account that can create OAuth Apps (personal or org)

## How the flow works

1. User clicks **Connect GitHub** on `/profile/settings`
2. Our server action calls `supabase.auth.linkIdentity({ provider: 'github', redirectTo })` and redirects the browser to GitHub
3. User authorizes on GitHub → GitHub redirects to Supabase's `/auth/v1/callback`
4. Supabase validates and redirects to our `/auth/github/callback?code=…`
5. Our callback exchanges the code, reads `session.provider_token`, and upserts the `github_connections` row via a service-role client
6. Redirect to `/profile/settings?github=linked`

If Supabase already has the GitHub identity linked (leftover from an earlier aborted attempt), the callback detects `identity_already_exists` and bounces through `/auth/github/relink`, which unlinks and re-links to obtain a fresh provider token. A `retried=1` guard prevents an infinite loop.

## Step 1 — Apply the database migration

The feature stores linked connections in `public.github_connections`. Run the migration once per Supabase project:

1. Open Supabase Dashboard → **SQL Editor** → **New query**
2. Paste the full contents of `db/migrations/003_github_connections.sql`
3. Click **Run**

The migration is idempotent (uses `CREATE TABLE IF NOT EXISTS` and `DROP POLICY IF EXISTS`), so re-running it is safe.

## Step 2 — Get Supabase's callback URL

You'll paste this into GitHub in the next step.

Supabase Dashboard → **Authentication** → **Providers** → **GitHub**. The **Callback URL** is shown at the top of the panel and looks like:

```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

Copy it.

## Step 3 — Create GitHub OAuth App(s)

GitHub OAuth Apps allow exactly one callback URL per app. All environments that share a single Supabase project can share one OAuth App, since the **Authorization callback URL** always points at Supabase, not at your app's domain. If you use separate Supabase projects for dev and prod, create one OAuth App per Supabase project.

### Create the OAuth App

1. Go to <https://github.com/settings/developers> → **OAuth Apps** → **New OAuth App**
2. Fill in:
   - **Application name**: e.g. `DPG Pipeline` (or `DPG Pipeline (Dev)` if you're making separate dev/prod apps)
   - **Homepage URL**: your app's public URL (`http://localhost:5173` for dev, `https://pipeline-tau.vercel.app` for prod — informational only)
   - **Authorization callback URL**: the Supabase callback URL from Step 2
3. Click **Register application**
4. Copy the **Client ID**
5. Click **Generate a new client secret** → copy it immediately (it's only shown once)

## Step 4 — Configure the GitHub provider in Supabase

Supabase Dashboard → **Authentication** → **Providers** → **GitHub**:

1. Toggle **Enable Sign in with GitHub** → **on**
2. Paste **Client ID** and **Client Secret** from Step 3
3. Save

## Step 5 — Enable Manual Linking

By default, Supabase refuses to link identities to an existing account — `linkIdentity()` will fail with `"Manual linking is disabled"`. You have to turn it on:

Supabase Dashboard → **Authentication** → **Sign In / Providers** → scroll to **Manual Linking** → **Enable**

For self-hosted Supabase or CLI setups, set the env var instead:

```
GOTRUE_SECURITY_MANUAL_LINKING_ENABLED=true
```

## Step 6 — Add redirect URLs to Supabase's allow-list

Supabase only redirects back to URLs explicitly allow-listed.

Supabase Dashboard → **Authentication** → **URL Configuration** → **Redirect URLs** → add both:

```
http://localhost:5173/auth/github/callback
https://<your-prod-domain>/auth/github/callback
```

While you're there, set **Site URL** to your production origin (e.g. `https://pipeline-tau.vercel.app`).

## Step 7 — App environment variables

The Connect GitHub flow runs entirely through Supabase — no GitHub credentials live in the app itself. The only env vars needed are the standard Supabase ones already in `.env.example`:

```
VITE_SUPABASE_URL="..."
VITE_SUPABASE_ANON_KEY="..."
PRIVATE_SUPABASE_SERVICE_KEY="..."
```

`PRIVATE_SUPABASE_SERVICE_KEY` is required — the callback writes to `github_connections` using a service-role client (the table's RLS policies intentionally don't cover the server-verified OAuth write path).

## Verifying it works

1. Start the app (`npm run dev`)
2. Sign in with email/password
3. Go to `/profile/settings` → click **Connect GitHub**
4. Authorize on GitHub
5. You should land on `/profile/settings?github=linked` with the UI showing your GitHub username and a green "Connected" state

You can confirm the database row was written in Supabase Dashboard → **Table Editor** → `github_connections`.

## Troubleshooting

### Connect button bounces straight to `?error=github_link_failed`, never reaching GitHub

`linkIdentity()` threw before returning a URL. Most common cause: **Manual Linking is disabled** (Step 5). Other possibilities: the GitHub provider isn't enabled in Supabase (Step 4), or the user session is invalid.

### GitHub OAuth works but you return with `?error=...#error_code=identity_already_exists`

The user's Supabase account already has a GitHub identity linked but the `github_connections` row is missing (from an earlier failed attempt). The callback handles this automatically by redirecting through `/auth/github/relink` to unlink and re-link. If you still see this *with* `retried=1` in the URL, the unlink itself failed — usually because the user's **only** identity is GitHub (Supabase refuses to unlink the last identity). Temporary fix: unlink the identity manually in Supabase Dashboard → Authentication → Users → *user* → Identities.

### `new row violates row-level security policy for table "github_connections"`

The migration ran with RLS enabled but the write is going through a user-scoped client. Verify `linkGitHub` in `src/lib/server/service/githubConnectionService.js` passes `supabaseAdmin` (not the request-scoped `supabase`) to `upsertConnection`.

### OAuth completes but the UI still shows "Connect"

The callback wrote the row but the page-load read is being filtered by RLS. Ensure `getConnectionStatus` reads via `supabaseAdmin`.

### `session.provider_token` is empty after code exchange

The Supabase GitHub provider settings may have provider-token storage disabled, or GitHub declined to return a token for the requested scopes. The app requests `read:user`; make sure nothing else is stripping that scope.

### Callback never logs anything after receiving the code

SvelteKit sometimes caches `+server.js` modules across Vite HMR edits. Kill and restart `npm run dev`.
