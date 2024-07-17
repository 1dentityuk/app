import { z } from 'zod';

export const resetPasswordSchema = z.object({
	email: z.string().email({ message: 'This does not look like an email address' })
});

export type ResetPasswordSchema = typeof resetPasswordSchema;
