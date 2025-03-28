//@ts-check
import { json } from '@sveltejs/kit';
import { getDpgSimilarProjects } from '$lib/server/service/githubWebhookService.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    const { title, description } = await request.json();
    let supabase = locals.supabase;
  
    try {
      const matchProjects = await getDpgSimilarProjects({ title, description }, supabase);
  
      return json({ success: true, matchProjects }, { status: 200 });
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      return json({ success: false, message: 'Error fetching matching projects' });
    }
  }