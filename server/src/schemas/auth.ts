import { z } from 'zod';

export const signupSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/[a-z]/, 'Must include a lowercase letter').regex(/[A-Z]/, 'Must include an uppercase letter').regex(/[0-9]/, 'Must include a digit').regex(/[^A-Za-z0-9]/, 'Must include a special character')
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
