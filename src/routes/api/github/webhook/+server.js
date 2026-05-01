//@ts-check

import { json } from '@sveltejs/kit';
import { githubWebhook } from '$lib/server/service/githubWebhookService.js';
import { verifyGithubSignature } from '$lib/server/security/githubWebhookSignature.js';

/**
 * GitHub webhook receiver. Verifies the `X-Hub-Signature-256` header against
 * `GITHUB_WEBHOOK_SECRET` before doing any work, so anonymous callers cannot
 * trigger evaluations on arbitrary projects.
 *
 * If `GITHUB_WEBHOOK_SECRET` is not configured (e.g. in local dev without a
 * tunnel), we accept the request but log a warning. Production must set it.
 */
export async function POST({ request, locals }) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-hub-signature-256');
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (secret) {
    if (!verifyGithubSignature(rawBody, signature, secret)) {
      return json({ error: 'invalid signature' }, { status: 401 });
    }
  } else {
    console.warn(
      '[github webhook] GITHUB_WEBHOOK_SECRET is not set — accepting unverified webhook. ' +
        'Set the env var in production.',
    );
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch (_) {
    return json({ error: 'invalid JSON body' }, { status: 400 });
  }

  await githubWebhook(body, locals.supabase);

  return json({ success: true }, { status: 200 });
}
