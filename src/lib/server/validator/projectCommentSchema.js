import { z } from 'zod';

// Server-side hard ceiling. UI enforces a tighter soft cap (e.g. 2000) with
// a visible counter; this just stops anyone bypassing the form from dumping
// megabytes into the table.
export const createCommentSchema = z.object({
  body: z.string().trim().min(1).max(10000),
});
