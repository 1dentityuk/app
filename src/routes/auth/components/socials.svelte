<script lang="ts">
	import type { Provider } from '@supabase/supabase-js';
	import { enhance } from '$app/forms';
	import Google from '$lib/assets/svg/google.svg?component';
	import Facebook from '$lib/assets/svg/facebook.svg?component';
	import LinkedIn from '$lib/assets/svg/linkedin.svg?component';
	import Slack from '$lib/assets/svg/slack.svg?component';
	import Azure from '$lib/assets/svg/azure.svg?component';

	export let back: () => void;
	let provider: Provider;
	$: provider;
</script>

<div class="form">
	<h4>Sign In</h4>
	<h1>Welcome to 1dentity!</h1>

	<p>Choose your Social Provider</p>

	<form method="POST" action="?/socials" use:enhance>
		<input type="hidden" id="provider" name="provider" bind:value={provider} />
		<ul>
			<li><button on:click={() => (provider = 'google')}><Google /></button></li>
			<li><button on:click={() => (provider = 'facebook')}><Facebook /></button></li>
			<li><button on:click={() => (provider = 'linkedin_oidc')}><LinkedIn /></button></li>
			<li><button on:click={() => (provider = 'slack_oidc')}><Slack /></button></li>
			<li><button on:click={() => (provider = 'azure')}><Azure /></button></li>
		</ul>
	</form>

	<button class="tertiary" type="button" on:click={back}>Cancel</button>
</div>

<style>
	form {
		padding: var(--spacing-4) 0;
	}

	ul {
		display: flex;
	}

	ul li {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	ul li button {
		width: 4.5rem;
		background-color: var(--color-secondary);
		padding: calc(var(--spacing-1) / 2);
		border: none;
		border-radius: 50%;
		margin-right: var(--spacing-1);
		cursor: pointer;
	}

	ul li button:hover {
		background-color: var(--color-primary);
	}

	button.tertiary {
		width: 90%;
	}
</style>
