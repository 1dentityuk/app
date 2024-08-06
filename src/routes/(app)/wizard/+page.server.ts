import type { PageServerLoad } from './$types';
import type { SetWizardLoadedForUser } from '$application/users/commands/user-profile';
import { handle } from '$application/users/handlers/user-profile';

export const load = (async ({ locals: { eventStore, user } }) => {
	if (!user) return;

	const { id: userId } = user;
	const command: SetWizardLoadedForUser = {
		type: 'SetWizardLoadedForUser',
		data: {
			userId
		},
		metadata: { now: new Date() }
	};

	await handle(eventStore, userId, command);
}) satisfies PageServerLoad;
