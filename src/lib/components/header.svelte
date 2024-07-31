<script>
	import { fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import Logo from '$lib/components/logo.svelte';
	import Burger from '$lib/components/burger.svelte';

	let open = false;
	let onClick = () => {
		open = !open;
	};
</script>

<header>
	<Logo />
	<Burger {open} {onClick} />

	{#if open}
		<nav transition:fly={{ y: -200, duration: 400 }}>
			<ul>
				<li><a href="/">My Profile</a></li>
				<li><a href="/">My Identities</a></li>
				<li><a href="/">Help &amp; Support</a></li>
				<li>
					<form action="/?/logout" method="POST" use:enhance>
						<button class="text">Logout</button>
					</form>
				</li>
			</ul>
		</nav>
	{/if}
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		background-color: var(--color-secondary);
	}

	nav {
		position: absolute;
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
</style>
