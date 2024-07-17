<script lang="ts">
	import { page } from '$app/stores';

	const { url } = $page;
	const source = url.searchParams.get('source');
	const reason = url.searchParams.get('reason');
</script>

<h1>{source} Error</h1>
<p>{reason}</p>
<button on:click={() => history.back()}>Try Again</button>

<style>
	h1 {
		text-transform: capitalize;
		padding-bottom: var(--spacing-2);
	}

	p {
		padding-bottom: var(--spacing-2);
		font-weight: 700;
	}

	button {
		margin: var(--spacing-2) 0;
	}
</style>
