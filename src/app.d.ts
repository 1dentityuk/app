import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import '@poppanator/sveltekit-svg/dist/svg';

declare global {
	namespace App {
		// interface Error {}
		// interface PageState {}
		// interface Platform {}

		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}

		interface PageData {
			session: Session | null;
		}
	}
}

export {};
