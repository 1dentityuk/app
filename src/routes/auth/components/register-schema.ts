import { z } from 'zod';

export const registerSchema = z
	.object({
		email: z.string().email({ message: 'This does not look like an email address' }),
		password: z.string().min(1, { message: 'Password is required' }),
		confirmPassword: z.string().min(1, { message: 'You need to confirm your chosen password' }),
		passwordStrength: z.coerce.number().min(2.9, { message: 'Password is not strong enough' })
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Your password did not confirm correctly',
				path: ['confirmPassword']
			});
		}
	});

export type RegisterSchema = typeof registerSchema;
