//@ts-check

import { json } from '@sveltejs/kit';
import { githubWebhook } from '$lib/server/service/githubWebhookService.js';

// @ts-ignore
export async function POST({ request, locals }) {
  const body = await request.json();

  // @ts-ignore
  let supabase = locals.supabase;

  await githubWebhook(body, supabase);

  return json({ success: 'true' }, { status: 200 });
}
