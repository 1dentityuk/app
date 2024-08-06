import type { Command } from '@event-driven-io/emmett';

export type SetWizardLoadedForUser = Command<
	'SetWizardLoadedForUser',
	{
		userId: string;
	}
>;

export type UserProfileCommand = SetWizardLoadedForUser;
