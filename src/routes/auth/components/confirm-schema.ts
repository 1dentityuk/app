import { z } from 'zod';

export const confirmationSchema = z.object({
	email: z.string().email(),
	code: z.string().min(1, { message: 'Confirmation Code is required' })
});

export type ConfirmationSchema = typeof confirmationSchema;
