import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email().transform((e) => e.trim().toLowerCase()),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
