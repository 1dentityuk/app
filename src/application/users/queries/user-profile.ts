import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserProfile } from '$domain/users/entities/user-profile';

const tableName = 'userprofiles';
const columns = 'first_name, last_name, known_by, date_of_birth, telephone_number, metadata';

const getCurrentUserProfile = async (client: SupabaseClient) => {
	const { data, error } = await client.from(tableName).select(columns).single<UserProfile>();

	if (error) {
		console.error(error);
		throw error;
	}

	return data;
};

export { getCurrentUserProfile };
