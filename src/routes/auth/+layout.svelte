<script lang="ts">
	import Logo from '$lib/components/logo.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

<main>
	<section class="left">
		<header>
			<Logo />
		</header>

		<section id="content">
			<div>
				<slot />
			</div>

			<Footer />
		</section>
	</section>

	<section class="right"></section>
</main>

<style>
	main {
		display: flex;
		min-height: 100%;
	}

	section.left {
		padding-top: var(--spacing-4);
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-grow: 1;
	}

	section.right {
		display: none;
	}

	section#content {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		max-width: 45rem;
	}

	section#content > div {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	header {
		padding-bottom: var(--spacing-3);
	}

	@media (--lg) {
		main {
			display: grid;
			grid-template-columns: 1.35fr 2fr;
			height: 100%;
		}

		section.right {
			display: block;
			background-image: url('$lib/assets/images/hero-image.webp');
			background-repeat: no-repeat;
			background-position: center;
		}
	}
</style>
