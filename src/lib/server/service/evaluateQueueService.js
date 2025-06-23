import { getEvaluationQueue, updateEvaluationQueue } from '$lib/server/repo/evaluateQueueRepo.js';
import { checkDPGStatus } from '$lib/server/service/aiService.js';
import { saveDPGStstatus } from '$lib/server/service/dpgStatusService.js';
import { parseGithubUrl } from '$lib/server/github.js';

/**
 * Process the evaluation queue - main business logic for cron job
 * @param {number} limit - Maximum number of tasks to process
 * @param {Object} supabase - Supabase client
 * @returns {Promise<Object>} Processing results
 */
export async function processEvaluationQueue(limit, supabase) {
  console.log('Processing evaluation queue...');

  const tasks = await getEvaluationQueue(limit, supabase);

  if (!tasks || tasks.length === 0) {
    console.log('No pending tasks found');
    return { success: true, message: 'No pending tasks', processed: 0, results: [] };
  }

  // Process each task
  const results = [];
  for (const task of tasks) {
    try {
      // Update task status to processing
      await updateEvaluationQueue(
        task.id,
        { status: 'processing', started_at: new Date().toISOString() },
        supabase,
      );

      // Process the task
      const result = await processEvaluationTask(task, supabase);
      results.push(result);

      // Update task status to completed
      await updateEvaluationQueue(
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

      await updateEvaluationQueue(
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

  return { success: true, processed: results.length, results };
}

/**
 * Process a single evaluation task
 * @param {Object} task - The evaluation task
 * @param {Object} supabase - Supabase client
 * @returns {Promise<Object>} Task processing result
 */
export async function processEvaluationTask(task, supabase) {
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
