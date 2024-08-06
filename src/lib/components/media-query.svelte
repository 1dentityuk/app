<script lang="ts">
	import { MediaQueryManager } from '$lib/stores';

	const mq = MediaQueryManager.mediaQueryStore;
	export let is: string = '';
</script>

{#if $mq.is(is)}
	<slot></slot>
{/if}
