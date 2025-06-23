import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_KEY, supabaseUrl, cronSecret } from '$lib/server/config.js';
import { processEvaluationQueue } from '$lib/server/service/evaluateQueueService.js';

/**
 * This endpoint is called by Vercel Cron every 2 minutes
 * It processes the evaluation queue and evaluates projects against DPG criteria
 * @type {import('./$types').RequestHandler}
 */
export async function GET(event) {
  // Verify this is a legitimate cron job request from Vercel
  const authHeader = event.request.headers.get('authorization');

  // If CRON_SECRET is set, verify the authorization header
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.log('Unauthorized cron job attempt');
    return new Response('Unauthorized', { status: 401 });
  }

  // Create a Supabase client with service role key for admin access
  const supabase = createClient(supabaseUrl, SUPABASE_SERVICE_KEY);

  try {
    // Process up to 3 tasks from the evaluation queue
    const result = await processEvaluationQueue(3, supabase);
    return json(result);
  } catch (error) {
    console.error('Error in cron job:', error);
    return json({ success: false, error: error.message });
  }
}
