<script lang="ts">
	import Logo from '$lib/components/logo.svelte';

	import { browser } from '$app/environment';

	let screenWidth: number = (browser && window.innerWidth) || 0,
		screenHeight: number = (browser && window.innerHeight) || 0;
	$: screenWidth;
	$: screenHeight;

	const year = new Date().getFullYear();

	function onResize() {
		if (browser) {
			screenWidth = window.innerWidth;
			screenHeight = window.innerHeight;
		}
	}
</script>

<svelte:window on:resize={onResize} />

<footer>
	<p>
		&copy; {year} 1dentity | <a href="/">Privacy Policy</a> | <a href="/">Terms of Service</a>
		{#if browser}
			| {screenWidth} x {screenHeight}
		{/if}
	</p>
	<Logo />
</footer>

<style>
	footer {
		text-align: center;
		margin: 0 auto;
		padding-top: var(--spacing-3);
		padding-bottom: var(--spacing-1);
	}

	footer > p {
		font-size: 1.2rem;
		color: var(--color-gray);
		padding-bottom: var(--spacing-2);
	}

	footer > p a {
		color: var(--color-gray);
	}
</style>
