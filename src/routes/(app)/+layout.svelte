<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

<main class="content-wrapper">
	<div class="content">
		<Header />
		<slot />
	</div>
	<Footer />
</main>

<style>
	.content-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100%;
	}

	.content {
		flex: 1;
	}
</style>
