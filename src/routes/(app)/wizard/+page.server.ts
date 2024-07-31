import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { userProfile } }) => {
	return { userProfile };
}) satisfies PageServerLoad;
