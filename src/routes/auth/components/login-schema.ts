import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email({ message: 'This does not look like an email address' }),
	password: z.string().min(1, { message: 'Password is required' })
});

export type LoginSchema = typeof loginSchema;
