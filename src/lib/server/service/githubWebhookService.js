import { json } from '@sveltejs/kit';
import { getProjectByGithubUrl } from '$lib/server/service/projectService.js';
import { createProjectUpdate } from '$lib/server/service/projectUpdatesService.js';
import { checkDPGStatus } from '$lib/server/service/aiService.js';
import { saveDPGStstatus } from '$lib/server/service/dpgStatusService.js';
import { parseGithubUrl } from '$lib/server/github.js';

export async function githubWebhook(data, supabase) {
  //get the project that matches the data.url
  const url = data.repository.html_url;
  const githubOwner = data.repository.owner.login;
  const repo = data.repository.name;
  //console.log('Evaluating:', data);

  const project = await getProjectByGithubUrl(url, supabase);

  if (!project) {
    return json({ success: false, message: 'Project not found' });
  }

  if (data.action === 'closed' && data.pull_request?.merged === true) {
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
  } else {
    console.log(
      `The action is "${data.action}" or the pull request was not merged. No specific handler for this case.`,
    );
  }

  //check DPG status
  const dpgStatus = await checkDPGStatus(githubOwner, repo, supabase);

  return saveDPGStstatus(project.id, dpgStatus, supabase);

  //return json({ success: true, status: 200 });
}

// export async function evaluateProject(url, supabase) {

//   const { owner, repo } = parseGithubUrl(url);

//   if (!owner || !repo) {
//     return json({ success: false, message: 'Invalid GitHub repository URL' });
//   }

//   const project = await getProjectByGithubUrl(url, supabase);

//   if (!project) {
//     return json({ success: false, message: 'Project not found' });
//   }

//   //check DPG status
//    const dpgStatus = await checkDPGStatus(owner, repo, supabase);

//    return await saveDPGStstatus(project.id, dpgStatus, supabase);
// }

export async function evaluateProject(url, supabase) {
  const { owner, repo } = parseGithubUrl(url);

  if (!owner || !repo) {
    return json({ success: false, message: 'Invalid GitHub repository URL' });
  }

  // Fetch project and check DPG status in parallel
  const [project, dpgStatus] = await Promise.all([
    getProjectByGithubUrl(url, supabase),
    checkDPGStatus(owner, repo, supabase),
  ]);

  if (!project) {
    return json({ success: false, message: 'Project not found' });
  }

  return await saveDPGStstatus(project.id, dpgStatus, supabase);
}

