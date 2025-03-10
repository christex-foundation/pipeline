import { getAllDpgStatuses, createProjectDpgStatus } from '$lib/server/repo/dpgStatusRepo.js';

export async function saveDPGStstatus(projectId, openAIResponse, supabase) {
  const parsedResponse = openAIResponse;

  const dpgStatuses = await getAllDpgStatuses(supabase);

  const explanations = parsedResponse.explanation.split('\n\n');

  const projectDpgStatusData = await Promise.all(
    dpgStatuses.map(async (criteria) => {
      const explanationMatch = explanations.find((explanation) =>
        explanation.toLowerCase().includes(criteria.name.toLowerCase()),
      );

      if (!explanationMatch) {
        console.log(`No matching explanation found for: ${criteria.name}`);
      }

      const scoreMatch = explanationMatch ? explanationMatch.match(/\*\*Score\*\*:\s*(\d+)/) : null;
      const reasonMatch = explanationMatch
        ? explanationMatch.match(/\*\*Reason\*\*:\s*(.+)/)
        : null;

      const score = await scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
      const reason = await Promise.resolve(
        reasonMatch ? reasonMatch[1].trim() : 'No explanation provided.',
      );

      return {
        project_id: projectId,
        name: criteria.name,
        status_id: criteria.id,
        score: score,
        explanation: reason,
      };
    }),
  );

  //console.log(projectDpgStatusData);

  for (const data of projectDpgStatusData) {
    await createProjectDpgStatus(data, supabase);
  }
  console.log('.')

  return projectDpgStatusData;
}
