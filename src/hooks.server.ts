import type { Database } from '$types/database';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { UserProfile } from '$domain/users/entities/user-profile';
import { UserProfileQueries } from '$application/users/queries';
import eventStore from '$application/event-store';

let userProfile: UserProfile | undefined;

const supabase = (async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				/**
				 * SvelteKit's cookies API requires `path` to be explicitly set in
				 * the cookie options. Setting `path` to `/` replicates previous/
				 * standard behavior.
				 */
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	if ('suppressGetSessionWarning' in event.locals.supabase.auth) {
		// @ts-expect-error - suppressGetSessionWarning is not part of the official API
		event.locals.supabase.auth.suppressGetSessionWarning = true;
	} else {
		console.warn(
			'SupabaseAuthClient#suppressGetSessionWarning was removed. See https://github.com/supabase/auth-js/issues/888.'
		);
	}

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT Validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
}) satisfies Handle;

const authGuard = (async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	if (!event.url.searchParams.has('/logout')) {
		if (!event.locals.session && !event.url.pathname.includes('/auth')) {
			redirect(303, '/auth');
		}

		if (event.locals.session && event.url.pathname.includes('/auth')) {
			redirect(303, '/');
		}

		if (event.locals.user) {
			if (!userProfile) {
				userProfile = await UserProfileQueries.getCurrentUserProfile(event.locals.supabase);
			}

			if (!userProfile.metadata?.ftuxComplete && !event.url.pathname.includes('/wizard')) {
				redirect(303, '/wizard');
			}
		}
	}

	return resolve(event);
}) satisfies Handle;

const eventStorage = (({ event, resolve }) => {
	event.locals.eventStore = eventStore;

	return resolve(event);
}) satisfies Handle;

export const handle = sequence(supabase, authGuard, eventStorage) satisfies Handle;
