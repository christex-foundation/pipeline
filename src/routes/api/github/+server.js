//@ts-check

import { json } from '@sveltejs/kit';
import { getRepoContributors, parseGithubUrl } from '$lib/server/github.js';
import { evaluateProject } from '$lib/server/service/githubWebhookService.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
  const { url } = await request.json();
  let supabase = locals.supabase;

  try {
    const evaluations = await evaluateProject(url, supabase);

    return json({ success: true, evaluations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    //return json({ success: false, message: 'Error fetching GitHub data' });
  }
}
