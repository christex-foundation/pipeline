import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1),
  image: z.string().url('Invalid image URL').optional(),
  banner: z.string().url('Invalid banner image URL').optional(),
  bio: z.string().min(1),
  country: z.string().min(1),
  // github: z.string().url('Invalid GitHub URL').optional(),
  // discord: z.string().url('Invalid LinkedIn URL').optional(),
  // twitter: z.string().url('Invalid Twitter URL').optional(),
  // web: z.string().url('Invalid Website URL').optional(),
  // linkedin: z.string().optional(),
});
