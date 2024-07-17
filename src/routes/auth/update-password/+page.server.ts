import type { Actions } from './$types';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const { error } = await supabase.auth.updateUser({ password: 'I Am A New Password' });
		if (error) {
			console.error(error);
		}
	}
} satisfies Actions;
