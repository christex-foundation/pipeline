import { json } from '@sveltejs/kit';
import { getProjectByGithubUrl } from '$lib/server/service/projectService.js';
import { createProjectUpdate } from '$lib/server/service/projectUpdatesService.js';

export async function githubWebhook(data, supabase) {
  //get the project that matches the data.url
  const url = data.repository.html_url;

  const project = await getProjectByGithubUrl(url, supabase);

  if (!project) {
    return json({ success: false, message: 'Project not found' });
  }

  //store the project update
  const update = await createProjectUpdate(
    {
      project_id: project.id,
      title: data.pull_request.title,
      merged_url: data.pull_request.html_url,
      author_association: data.pull_request.author_association,
      commits: data.pull_request.commits,
      commits_url: data.pull_request.commits_url,
      merged: data.pull_request.merged,
      merged_at: data.pull_request.merged_at,
      user: data.pull_request.user,
      code: true,
    },
    supabase,
  );
}
