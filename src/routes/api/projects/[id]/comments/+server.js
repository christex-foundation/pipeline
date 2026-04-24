import { json } from '@sveltejs/kit';
import {
  COMMENT_RATE_LIMIT_MAX,
  consumeCommentRateLimit,
  createProjectComment,
  getProjectComments,
} from '$lib/server/service/projectCommentService.js';
import { createCommentSchema } from '$lib/server/validator/projectCommentSchema.js';

export async function GET({ params, locals }) {
  const { id } = params;
  const supabase = locals.supabase;

  try {
    const comments = await getProjectComments(id, supabase);
    return json({ comments }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ params, request, locals }) {
  const { id } = params;
  const user = locals.authUser;
  const supabase = locals.supabase;

  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateCheck = consumeCommentRateLimit(user.id);
  if (!rateCheck.allowed) {
    return json(
      { error: 'Rate limit exceeded. Please retry later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateCheck.retryAfterSeconds),
          'X-RateLimit-Limit': String(COMMENT_RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': String(rateCheck.remaining),
        },
      },
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createCommentSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      { error: 'Invalid input', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const comment = await createProjectComment(
      { projectId: id, userId: user.id, body: parsed.data.body },
      supabase,
    );
    return json({ comment }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
