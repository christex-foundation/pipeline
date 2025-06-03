import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { checkDPGStatus } from '$lib/server/service/aiService.js';
import { saveDPGStstatus } from '$lib/server/service/dpgStatusService.js';
import { parseGithubUrl } from '$lib/server/github.js';
import { SUPABASE_SERVICE_KEY, supabaseUrl, cronSecret } from '$lib/server/config.js';
import { getEvaluateQueue, updateEvaluateQueue } from '$lib/server/service/evaluateQueueService.js';

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

  console.log('Processing evaluation queue...');

  // Create a Supabase client with service role key for admin access
  const supabase = createClient(supabaseUrl, SUPABASE_SERVICE_KEY);

  try {
    const tasks = await getEvaluateQueue(3, supabase);

    if (!tasks || tasks.length === 0) {
      console.log('No pending tasks found');
      return json({ success: true, message: 'No pending tasks' });
    }

    console.log(`Found ${tasks.length} pending tasks`);

    // Process each task
    const results = [];
    for (const task of tasks) {
      try {
        // Update task status to processing
        await updateEvaluateQueue(
          task.id,
          { status: 'processing', started_at: new Date().toISOString() },
          supabase,
        );

        // Process the task
        const result = await processTask(task, supabase);
        results.push(result);

        // Update task status to completed
        await updateEvaluateQueue(
          task.id,
          {
            status: 'completed',
            completed_at: new Date().toISOString(),
            result: result,
          },
          supabase,
        );
      } catch (error) {
        console.error(`Error processing task ${task.id}:`, error);

        // Increment retry count and update status
        const retryCount = (task.retry_count || 0) + 1;
        const newStatus = retryCount >= 3 ? 'failed' : 'pending';

        await updateEvaluateQueue(
          task.id,
          {
            status: newStatus,
            retry_count: retryCount,
            error: error.message,
            updated_at: new Date().toISOString(),
          },
          supabase,
        );

        results.push({ taskId: task.id, success: false, error: error.message });
      }
    }

    return json({ success: true, processed: results.length, results });
  } catch (error) {
    console.error('Error in cron job:', error);
    return json({ success: false, error: error.message });
  }
}

/**
 * Process a single evaluation task
 */
async function processTask(task, supabase) {
  const { project_id, github_url } = task;

  if (!project_id || !github_url) {
    throw new Error('Missing required task data: project_id or github_url');
  }

  console.log(`Processing evaluation for project ${project_id} with URL ${github_url}`);

  const { owner, repo } = parseGithubUrl(github_url);

  if (!owner || !repo) {
    throw new Error('Invalid GitHub repository URL');
  }

  // Evaluate the project against DPG criteria
  const dpgStatus = await checkDPGStatus(owner, repo, supabase);

  // Save the evaluation results
  await saveDPGStstatus(project_id, dpgStatus, supabase);

  return {
    taskId: task.id,
    projectId: project_id,
    success: true,
    message: 'Project evaluated successfully',
  };
}
