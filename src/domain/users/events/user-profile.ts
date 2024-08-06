import type { Event } from '@event-driven-io/emmett';

export const UserProfileEventTypes = {
	WizardLoaded: 'WizardLoaded'
};

export type WizardLoaded = Event<
	typeof UserProfileEventTypes.WizardLoaded,
	{
		userId: string;
		dateLoaded: Date;
	}
>;

export type UserProfileEvent = WizardLoaded;
