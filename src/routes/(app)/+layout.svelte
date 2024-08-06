<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

<main class="content-wrapper">
	<Header />
	<div class="content">
		<slot />
	</div>
	<Footer />
</main>

<style>
	.content-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100%;
	}

	.content {
		width: 90%;
		flex: 1;
	}
</style>
