import type { UserProfileEvent } from '$domain/users/events/user-profile';
import type { UserProfile } from '$domain/users/entities/user-profile';

export const reduce = (state: UserProfile, event: UserProfileEvent): UserProfile => {
	const { type } = event;

	switch (type) {
		case 'WizardLoaded':
			return wizardLoaded(state);
		default:
			return noOp(state);
	}
};

const wizardLoaded = (state: UserProfile): UserProfile => {
	return {
		...state,
		metadata: {
			ftuxComplete: true
		}
	};
};

const noOp = (state: UserProfile): UserProfile => {
	return state;
};
