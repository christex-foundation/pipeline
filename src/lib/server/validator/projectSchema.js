import { countries } from 'countries-list';
import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1),
  bio: z.string().min(1),
  country: z.string().min(1),
  details: z.string(),
  email: z.string().email(),
  portfolio: z.string().url('Invalid portfolio URL').optional(),
  tags: z.string().array().nonempty(),
  github: z.string().url('Invalid GitHub URL').optional(),
  linkedin: z.string().url('Invalid LinkedIn URL').optional(),
  twitter: z.string().url('Invalid Twitter URL').optional(),
  website: z.string().url('Invalid Website URL').optional(),
  other: z.string().optional(),
  wallet: z.string().min(1).optional(),
  funding_goal: z.number().min(1),
  image: z.string().url('Invalid image URL').optional(),
  banner_image: z.string().url('Invalid banner image URL').optional(),
});

export const createProjectSchema = z.object({
  title: z
    .string({ required_error: 'title is required' })
    .trim()
    .min(5, { message: 'title is too short' }),
  bio: z
    .string({ required_error: 'project bio is required' })
    .trim()
    .min(5, { message: 'bio is too short' }),
  tags: z.array(z.string()).default([]),
  country: z.enum(
    Object.values(countries).map((country) => country.name),
    { required_error: 'country is required' },
  ),
  details: z
    .string({ required_error: 'details is required' })
    .trim()
    .min(5, { message: 'details is too short' }),
  email: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
  other: z.string().optional(),
  funding_goal: z
    .number({ coerce: true, required_error: 'funding_goal is required' })
    .min(0, { message: 'number is low' })
    .default(0),
  bank_acct: z.string().trim().optional(),
  wallet_address: z.string().trim().optional(),
  // TODO: add the banner and profile image checks here
});
