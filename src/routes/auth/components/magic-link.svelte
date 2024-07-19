<script lang="ts">
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Field, Control, Label, FieldErrors } from 'formsnap';
	import { type MagicLinkSchema, magicLinkSchema } from './magic-link-schema';
	import Loader from '$lib/components/loader.svelte';

	export let back: () => void;
	export let data: SuperValidated<Infer<MagicLinkSchema>>;

	const form = superForm(data, { validators: zodClient(magicLinkSchema), delayMs: 150 });
	const { form: formData, enhance, delayed, message } = form;
</script>

<div class="form">
	<h4>Sign In</h4>
	<h1>Welcome to 1dentity!</h1>

	{#if $message}
		<p class="message">{$message}</p>
	{/if}

	<form method="POST" action="?/magicLink" use:enhance>
		<Field {form} name="email">
			<div class="input-group">
				<Control let:attrs>
					<Label>Email Address</Label>
					<input {...attrs} type="email" bind:value={$formData.email} placeholder="Email Address" />
				</Control>
				<FieldErrors />
			</div>
		</Field>
		<section id="buttons">
			<button class="primary">
				{#if $delayed}
					<Loader />
				{:else}
					Send Link
				{/if}
			</button>

			<button class="tertiary" type="button" on:click={back} disabled={$delayed}>Cancel</button>
		</section>
	</form>
</div>
