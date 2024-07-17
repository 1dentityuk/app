import type { Actions, PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect, fail } from '@sveltejs/kit';
import { loginSchema } from './components/login-schema';
import { registerSchema } from './components/register-schema';
import { confirmationSchema } from './components/confirm-schema';
import { resetPasswordSchema } from './components/reset-password-schema';

export const load = (async () => {
	const loginForm = await superValidate(zod(loginSchema), { id: 'login' });
	const registrationForm = await superValidate(zod(registerSchema), { id: 'register' });
	const confirmationForm = await superValidate(zod(confirmationSchema), { id: 'confirm' });
	const resetPasswordForm = await superValidate(zod(resetPasswordSchema), { id: 'reset-password' });

	return { loginForm, registrationForm, confirmationForm, resetPasswordForm };
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
	}
} satisfies Actions;
