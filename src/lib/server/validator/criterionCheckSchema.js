//@ts-check
import { z } from 'zod';

export const createCriterionIssueSchema = z.object({
  filename: z.string().min(1).max(256),
});
