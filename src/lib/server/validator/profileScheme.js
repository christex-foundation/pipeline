import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1),
  image: z.string().url('Invalid image URL').optional(),
  banner: z.string().url('Invalid banner image URL').optional(),
  bio: z.string().min(1),
  // country: z.string().min(1),
  github: z.string().optional(),
  discord: z.string().optional(),
  twitter: z.string().optional(),
  web: z.string().url('Invalid Website URL').or(z.literal('')).optional(),
  // linkedin: z.string().optional(),
});
