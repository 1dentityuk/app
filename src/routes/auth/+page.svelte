<script lang="ts">
	import UsernamePassword from './components/username-password.svelte';
	import MagicLink from './components/magic-link.svelte';
	import Socials from './components/socials.svelte';

	let selection: 'none' | 'magic-link' | 'socials' | 'email' = 'none';
	$: selection;

	export let data;
	export let form;
</script>

{#if selection === 'none'}
	<h1>Revolutionize Your Online Identity</h1>
	<section id="options">
		<button class="primary" on:click={() => (selection = 'magic-link')}
			>Login With Magic Link</button
		>
		<button class="secondary" on:click={() => (selection = 'socials')}>Login With Socials</button>
		<button class="tertiary" on:click={() => (selection = 'email')}>Login With Password</button>
	</section>
{/if}

{#if selection === 'email'}
	<UsernamePassword
		loginData={data.loginForm}
		registerData={data.registrationForm}
		confirmationData={data.confirmationForm}
		resetPasswordData={data.resetPasswordForm}
		confirm={form?.confirm ?? ''}
		back={() => (selection = 'none')}
	/>
{/if}

{#if selection === 'magic-link'}
	<MagicLink data={data.magicLinkForm} back={() => (selection = 'none')} />
{/if}

{#if selection === 'socials'}
	<Socials back={() => (selection = 'none')} />
{/if}

<style>
	h1 {
		font-family: Prompt, sans-serif;
		font-size: 3.8rem;
		font-weight: 700;
		line-height: 4.275rem;
		color: var(--color-headline);
		text-align: center;
		width: 75%;
	}

	section#options {
		padding-top: var(--spacing-4);
		display: flex;
		flex-direction: column;
	}

	section#options button {
		margin: var(--spacing-2);
		justify-content: center;
	}

	@media (--lg) {
		h1 {
			font-size: 3rem;
			width: 80%;
		}
	}
</style>
