import { json } from '@sveltejs/kit';
import { getProjectByGithubUrl } from '$lib/server/service/projectService.js';
import { createProjectUpdate } from '$lib/server/service/projectUpdatesService.js';
import { checkDPGStatus } from '$lib/server/service/aiService.js';
import { saveDPGStstatus } from '$lib/server/service/dpgStatusService.js';
import { parseGithubUrl } from '$lib/server/github.js';
import { Queue } from 'bullmq';

import {
  supabaseAnonKey,
  supabaseUrl,
  redisHost,
  redisPort,
  redisPassword,
} from '$lib/server/config.js';

const projectEvaluationQueue = new Queue('projectEvaluation', {
  connection: {
    host: redisHost,
    // @ts-ignore
    port: redisPort,
    password: redisPassword,
  },
});


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

    console.log('Adding project to evaluation queue...');
    await projectEvaluationQueue
      .add('evaluateProject', {
        github: project.github,
        projectId: project.id,
        supabaseUrl,
        supabaseAnonKey,
      })
      .catch((err) => {
        console.error('Failed to enqueue project evaluation:', err);
      });

    return { success: true };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { success: false, error: error.message };
  }
}

export async function evaluateProject(url, projectId, supabase) {
  console.log('Evaluating project:', url);
  console.log('Evaluating project ID:', projectId);
  const { owner, repo } = parseGithubUrl(url);
  console.log('Owner:', owner, 'Repo:', repo);

  if (!owner || !repo) {
    return json({ success: false, message: 'Invalid GitHub repository URL' });
  }

  console.log('Fetching project by GitHub URL...', url);

  const dpgStatus = await checkDPGStatus(owner, repo, supabase);

  console.log('..');

  console.log('Sending project update...');
  await saveDPGStstatus(projectId, dpgStatus, supabase);
  console.log('..');
}
