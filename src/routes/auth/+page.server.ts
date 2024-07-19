import type { Actions, PageServerLoad } from './$types';
import type { Provider } from '@supabase/supabase-js';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect, fail } from '@sveltejs/kit';
import { loginSchema } from './components/login-schema';
import { registerSchema } from './components/register-schema';
import { confirmationSchema } from './components/confirm-schema';
import { resetPasswordSchema } from './components/reset-password-schema';
import { magicLinkSchema } from './components/magic-link-schema';
import { PUBLIC_ENVIRONMENT_URI } from '$env/static/public';

export const load = (async () => {
	const loginForm = await superValidate(zod(loginSchema), { id: 'login' });
	const registrationForm = await superValidate(zod(registerSchema), { id: 'register' });
	const confirmationForm = await superValidate(zod(confirmationSchema), { id: 'confirm' });
	const resetPasswordForm = await superValidate(zod(resetPasswordSchema), { id: 'reset-password' });
	const magicLinkForm = await superValidate(zod(magicLinkSchema), { id: 'magic-link' });

	return { loginForm, registrationForm, confirmationForm, resetPasswordForm, magicLinkForm };
}) satisfies PageServerLoad;

export const actions = {
	login: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { loginForm: form });
		}

		const email = form.data.email;
		const password = form.data.password;
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			console.error(error);
			return redirect(303, `/auth/error?source=login&reason=${error.message}`);
		} else {
			return redirect(303, '/');
		}
	},

	register: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(registerSchema));

		if (!form.valid) {
			return fail(400, { registrationForm: form });
		}

		const email = form.data.email;
		const password = form.data.password;
		const { error } = await supabase.auth.signUp({ email, password });

		if (error) {
			console.error(error);
			return redirect(303, `/auth/error?source=registration&reason=${error.message}`);
		} else {
			return { registrationForm: form, confirm: email };
		}
	},

	confirm: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(confirmationSchema));

		if (!form.valid) {
			return fail(400, { confirmationForm: form });
		}

		const email = form.data.email;
		const token = form.data.code;
		const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });

		if (error) {
			console.error(error);
			return redirect(303, `auth/error?source=confirmation&reason=${error.message}`);
		} else {
			return redirect(303, '/');
		}
	},

	resetPassword: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(resetPasswordSchema));

		if (!form.valid) {
			return fail(400, { resetPasswordForm: form });
		}

		const email = form.data.email;
		const { error } = await supabase.auth.resetPasswordForEmail(email);

		if (error) {
			console.error(error);
			return redirect(303, `auth/error?source=reset+password&reason=${error.message}`);
		} else {
			return message(form, 'Request Successful');
		}
	},

	magicLink: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(magicLinkSchema));

		if (!form.valid) {
			return fail(400, { magicLinkForm: form });
		}

		const email = form.data.email;
		const { error } = await supabase.auth.signInWithOtp({ email });

		if (error) {
			console.error(error);
			return redirect(303, `auth/error?source=magic+link&reason=${error.message}`);
		} else {
			return message(form, 'Magic Link Request Successful');
		}
	},

	socials: async ({ request, locals: { supabase } }) => {
		const provider = (await request.formData()).get('provider') as Provider;
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${PUBLIC_ENVIRONMENT_URI}/auth/callback`
			}
		});

		if (error) {
			console.error(error);
			return redirect(303, `auth/error?source=socials&reason=${error.message}`);
		} else {
			return redirect(303, data.url);
		}
	}
} satisfies Actions;
