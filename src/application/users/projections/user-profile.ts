import { inlineProjection } from '@event-driven-io/emmett-postgresql';
import { type WizardLoaded, UserProfileEventTypes } from '$domain/users/events/user-profile';

const updateWizardLoaded = inlineProjection<WizardLoaded>({
	name: 'updateWizardLoaded',
	canHandle: [UserProfileEventTypes.WizardLoaded],
	handle: (events, { client }) => {
		events.forEach(async (event) => {
			const command = {
				name: 'update-wizard-loaded',
				text: `UPDATE public.userprofiles SET metadata = jsonb_set(coalesce(metadata, '{}'), '{ftuxComplete}', 'true'::jsonb, true) WHERE id = $1`,
				values: [event.data.userId]
			};

			await client.query(command);
		});
	}
});

export default [updateWizardLoaded];
