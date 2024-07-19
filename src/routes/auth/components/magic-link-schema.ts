import { z } from 'zod';

export const magicLinkSchema = z.object({
	email: z.string().email({ message: 'This does not look like an email address' })
});

export type MagicLinkSchema = typeof magicLinkSchema;
