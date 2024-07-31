import type { SupabaseClient } from '@supabase/supabase-js';

const tableName: string = 'userprofiles';
export type UserProfile = {
	firstName?: string;
	lastName?: string;
	knownBy?: string;
	dateOfBirth?: Date;
	telephoneNumber?: string;
	metadata?: {
		ftuxComplete: boolean;
	} | null;
};

export const userProfileQuery = async (client: SupabaseClient) =>
	await client
		.from(tableName)
		.select(
			`first_name,
			last_name,
			known_by,
			date_of_birth,
			telephone_number,
			metadata`
		)
		.returns<UserProfile>()
		.single();
