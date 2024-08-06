<script>
	import { fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { MediaQueryManager } from '$lib/stores';
	import Logo from '$lib/components/logo.svelte';
	import Burger from '$lib/components/burger.svelte';

	const mq = MediaQueryManager.mediaQueryStore;

	let open = false;
	$: open = $mq.is('lg+');

	let onClick = () => {
		open = !open;
	};
</script>

<header>
	<section>
		<Logo />
		<div class="burger">
			<Burger {open} {onClick} />
		</div>

		{#if open}
			<nav transition:fly={{ y: -200, duration: 400 }}>
				<ul>
					<li><a href="/">My Profile</a></li>
					<li><a href="/">My Avatars</a></li>
					<li><a href="/">Help &amp; Support</a></li>
					<li>
						<form action="/?/logout" method="POST" use:enhance>
							<button class="text">Logout</button>
						</form>
					</li>
				</ul>
			</nav>
		{/if}

		<form action="/?/logout" method="POST" class="logout" use:enhance>
			<button class="primary small">Logout</button>
		</form>
	</section>
</header>

<style>
	header {
		width: 100%;
		background-color: var(--color-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	section {
		width: 90%;
		display: flex;
		justify-content: space-between;
	}

	nav {
		position: absolute;
		left: 0;
		width: 100%;
		background-color: var(--color-secondary);
		margin-top: var(--spacing-5);
		padding-bottom: var(--spacing-1);
	}

	nav ul {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	nav ul li {
		display: inline-block;
		min-width: 13rem;
	}

	nav ul li a {
		text-decoration: none;
		cursor: pointer;
	}

	nav ul li a:hover {
		text-decoration: underline;
	}

	nav ul li form {
		padding: 0;
		margin: 0;
		display: inline-block;
	}

	nav ul li form button {
		font-size: 1.6rem;
		text-decoration: none;
		cursor: pointer;
	}

	nav ul li form button:hover {
		text-decoration: underline;
	}

	form.logout {
		display: none;
	}

	@media (--lg) {
		header {
			padding: var(--spacing-1) 0;
		}

		.burger {
			display: none;
		}

		nav {
			position: unset;
			margin-top: 0;
			padding-bottom: 0;
			padding-left: var(--spacing-5);
			width: auto;
			display: flex;
			align-items: center;
			flex: 1;
		}

		nav ul {
			flex-direction: row;
			font-size: 1.4rem;
		}

		nav ul li {
			min-width: 15rem;
		}

		nav ul li:last-child {
			display: none;
		}

		form.logout {
			display: flex;
			align-items: center;
		}

		form.logout button {
			font-size: 1.6rem;
		}
	}
</style>
