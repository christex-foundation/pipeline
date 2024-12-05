import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string({ required_error: 'email is required' }).email(),
  password: z
    .string({ required_error: 'password is required' })
    .min(4, { message: 'password is too short' }),
});

export const signupSchema = z.object({
  name: z
    .string({ required_error: 'name is required' })
    .trim()
    .min(2, { message: 'name is too short' }),
  email: z.string({ required_error: 'email is required' }).email(),
  password: z
    .string({ required_error: 'password is required' })
    .min(4, { message: 'password is too short' }),
});
