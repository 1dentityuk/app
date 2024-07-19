import type { EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as EmailOtpType | null;
	const next = url.searchParams.get('next') ?? '/';

	/**
	 * Clean up the redirect url by deleting the Auth flow parameters.
	 *
	 * `next` is preserved for now, because it's needed in the error case
	 */
	const redirectTo = new URL(url);
	redirectTo.pathname = next;
	redirectTo.searchParams.delete('token_hash');
	redirectTo.searchParams.delete('type');

	if (token_hash && type) {
		console.log('CONFIRMING OTP');
		console.log(type);
		const { error, data } = await supabase.auth.verifyOtp({ type, token_hash });

		console.log('OTP SESSION EXPIRES_N?');
		console.log(data.session?.expires_in);

		if (!error) {
			redirectTo.searchParams.delete('next');
			return redirect(303, redirectTo);
		}

		console.error(error);
	}

	redirectTo.pathname = '/auth/error';
	return redirect(303, redirectTo);
};
