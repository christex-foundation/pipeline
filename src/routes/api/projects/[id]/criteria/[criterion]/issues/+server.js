import { json } from '@sveltejs/kit';
import { createIssueForMissingFile } from '$lib/server/service/criterionCheckService.js';
import { createCriterionIssueSchema } from '$lib/server/validator/criterionCheckSchema.js';

export async function POST({ request, params, locals }) {
  const user = locals.authUser;
  if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = createCriterionIssueSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const result = await createIssueForMissingFile(
      user.id,
      params.id,
      params.criterion,
      parsed.data.filename,
      locals.supabase,
    );
    return json(result, { status: 201 });
  } catch (err) {
    const status = err.status || 500;
    return json({ error: err.message }, { status });
  }
}
