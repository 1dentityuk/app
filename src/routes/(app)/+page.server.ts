import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals: { session } }) => {
	return { session };
}) satisfies PageServerLoad;

export const actions = {
	logout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}

		redirect(303, '/');
	}
} satisfies Actions;
