<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	import '../app.postcss';
	import '../theme/theme.css';

	export let data;
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
				invalidateAll();
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<slot />
