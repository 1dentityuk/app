import type { UserProfileCommand, SetWizardLoadedForUser } from '../commands/user-profile';
import type { UserProfile } from '$domain/users/entities/user-profile';
import type { WizardLoaded } from '$domain/users/events/user-profile';
import { EmmettError, DeciderCommandHandler } from '@event-driven-io/emmett';
import { reduce } from '../reducers/user-profile';

const initialState = (): UserProfile => {
	return {};
};

const decide = (command: UserProfileCommand, state: UserProfile) => {
	const { type } = command;

	switch (type) {
		case 'SetWizardLoadedForUser':
			return setWizardLoaded(command);
		default: {
			const _unknownCommandType: never = type;
			throw new EmmettError('Unknown Command Type');
		}
	}
};

const setWizardLoaded = (command: SetWizardLoadedForUser): WizardLoaded => {
	const {
		data: { userId },
		metadata
	} = command;

	return {
		type: 'WizardLoaded',
		data: {
			userId,
			dateLoaded: metadata?.now ?? new Date()
		}
	};
};

export const handle = DeciderCommandHandler({ decide, evolve: reduce, initialState });
