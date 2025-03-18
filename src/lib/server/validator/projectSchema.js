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
  github: z
    .string()
    .url('Invalid GitHub URL')
    .regex(
      new RegExp(/^https?:\/\/(?:www\.)?github\.com\/([\w-]+)\/([\w.-]+)(?:\/.*)?$/),
      'Invalid GitHub URL',
    )
    .optional(),
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
  country: z.enum(
    Object.values(countries).map((country) => country.name),
    { required_error: 'country is required' },
  ),
  details: z
    .string({ required_error: 'details is required' })
    .trim()
    .min(5, { message: 'details is too short' }),
  email: z.string().optional(),
  github: z
    .string()
    .regex(
      new RegExp(/^https?:\/\/(?:www\.)?github\.com\/([\w-]+)\/([\w.-]+)(?:\/.*)?$/),
      'This is not a real github url',
    )
    .optional(),
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
  // banner_image: z
  //   .instanceof(File)
  //   .optional()
  //   .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
  //     message: "Only JPEG and PNG images are allowed for the banner.",
  //   })
  //   .refine((file) => file.size <= 10 * 1024 * 1024, { // 10 MB
  //     message: "Banner image size should not exceed 10MB.",
  //   }),
  // image: z
  //   .instanceof(File)
  //   .optional()
  //   .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
  //     message: "Only JPEG and PNG images are allowed for the profile.",
  //   })
  //   .refine((file) => file.size <= 5 * 1024 * 1024, { // 5 MB
  //     message: " image size should not exceed 5MB.",
  //   }),
});
