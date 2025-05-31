import { updateProjectDpg } from '$lib/server/repo/projectRepo.js';

export async function saveDPGStstatus(projectId, openAIResponse, supabase) {
  const parsedResponse = openAIResponse;

  await updateProjectDpg(projectId, parsedResponse, supabase);

  return parsedResponse;
}
