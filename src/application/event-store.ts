import { PRIVATE_DATABASE_URL } from '$env/static/private';
import { getPostgreSQLEventStore } from '@event-driven-io/emmett-postgresql';
import userProfileProjections from './users/projections/user-profile';

export default getPostgreSQLEventStore(PRIVATE_DATABASE_URL, {
	projections: userProfileProjections
});
