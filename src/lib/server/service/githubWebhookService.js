import { json } from '@sveltejs/kit';
import { getProjectByGithubUrl } from '$lib/server/service/projectService.js';
import { createProjectUpdate } from '$lib/server/service/projectUpdatesService.js';
import { checkDPGStatus, getEmbedding } from '$lib/server/service/aiService.js';
import { saveDPGStstatus } from '$lib/server/service/dpgStatusService.js';
import { parseGithubUrl } from '$lib/server/github.js';
import axios from 'axios';
import { addToEvaluationQueue } from '$lib/server/repo/evaluateQueueRepo.js';

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

    await addToEvaluationQueue(
      {
        project_id: project.id,
        github_url: project.github,
        status: 'pending',
      },
      supabase,
    );
    return { success: true };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { success: false, error: error.message };
  }
}

export async function evaluateProject(url, projectId, supabase) {
  const { owner, repo } = parseGithubUrl(url);

  if (!owner || !repo) {
    return json({ success: false, message: 'Invalid GitHub repository URL' });
  }

  console.log('Fetching project by GitHub URL...', url);

  const dpgStatus = await checkDPGStatus(owner, repo, supabase);

  console.log('Sending project update...');
  await saveDPGStstatus(projectId, dpgStatus, supabase);
}

function cosineSimilarity(vec1, vec2) {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitude1 * magnitude2);
}

export async function getDpgSimilarProjects(projectData, supabase) {
  try {
    // Generate an embedding for the input text
    const inputEmbedding = await getEmbedding(`${projectData.title} ${projectData.description}`);

    // Fetch projects from the Digital Public Goods API
    const { data } = await axios.get('https://app.digitalpublicgoods.net/api/v1/dpgs');

    if (!Array.isArray(data)) {
      return { error: 'Invalid API response format.' };
    }

    // Compute similarity scores for each project
    const projects = await Promise.all(
      data.map(async (project) => {
        const projectText = `${project.name} ${project.description || ''}`;
        const projectEmbedding = await getEmbedding(projectText);
        return {
          name: project.name,
          description: project.description,
          url: project.publicURL || '',
          website: project.websiteURL || '',
          sourceURL: project.sourceURL || '',
          logo: project.logo || '',
          score: cosineSimilarity(inputEmbedding, projectEmbedding),
        };
      }),
    );

    // Sort projects by highest score and return the top 5 matches
    const sortedProjects = projects.sort((a, b) => b.score - a.score).slice(0, 5);

    return { data: sortedProjects };
  } catch (error) {
    console.error(error);
    return { error: 'Internal server error. Please try again later.' };
  }
}
