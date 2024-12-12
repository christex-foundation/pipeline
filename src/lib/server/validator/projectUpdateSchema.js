import { z } from 'zod';

export const updateSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export const commentScheme = z.object({
  body: z.string().min(1),
});
