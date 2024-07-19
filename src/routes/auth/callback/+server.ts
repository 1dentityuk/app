import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const code = url.searchParams.get('code') as string;
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			redirect(303, `/${next.slice(1)}`);
		} else {
			console.error(error);
			redirect(303, `auth/error?source=socials&reason=${error.message}`);
		}
	}

	redirect(303, `auth/error?source=socials&reason=An+unknown+error+occurred`);
};