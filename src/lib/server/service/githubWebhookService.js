//@ts-check
import { getProjectByGithubUrl } from '$lib/server/service/projectService.js';
import { createProjectUpdate } from '$lib/server/service/projectUpdatesService.js';
import { requestEvaluation } from '$lib/server/service/evaluationQueueService.js';

export async function githubWebhook(data, supabase) {
  try {
    console.log('Received webhook:');

    const url = data.repository?.html_url;

    if (!url) throw new Error('Repository URL missing in payload');

    const project = await getProjectByGithubUrl(url, supabase);
    if (!project) {
      console.error(`Project not found for URL: ${url}`);
      return { success: false, message: 'Project not found' };
    }

    console.log('Processing webhook for project:', project.github);

    if (data.action === 'closed' && data.pull_request?.merged) {
      console.log('Pull request merged. Storing update...');
      await createProjectUpdate(
        {
          project_id: project.id,
          title: data.pull_request.title,
          merged_url: data.pull_request.html_url,
          author_association: data.pull_request.author_association,
          commits: data.pull_request.commits,
          commits_url: data.pull_request.commits_url,
          merged: true,
          merged_at: data.pull_request.merged_at,
          user: data.pull_request.user,
          code: true,
        },
        supabase,
      );
    } else {
      console.log(
        `The action is "${data.action}" or the PR was not merged. Skipping update storage.`,
      );
    }

    if (data.action === 'closed' && data.pull_request?.merged) {
      console.log('Requesting project evaluation...');
      await requestEvaluation(project.id, project.github, 'webhook', null, supabase);
    }

    return { success: true };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { success: false, error: error.message };
  }
}
