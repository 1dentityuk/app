<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { type LoginSchema, loginSchema } from './login-schema';
	import { type RegisterSchema, registerSchema } from './register-schema';
	import { type ConfirmationSchema, confirmationSchema } from './confirm-schema';
	import { type ResetPasswordSchema, resetPasswordSchema } from './reset-password-schema';
	import { type FeedbackType, zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
	import { adjacencyGraphs, dictionary as commonDictionary } from '@zxcvbn-ts/language-common';
	import { translations, dictionary as englishDictionary } from '@zxcvbn-ts/language-en';
	import Loader from '$lib/components/loader.svelte';

	import { superForm } from 'sveltekit-superforms';
	import { Field, Control, Label, FieldErrors } from 'formsnap';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let loginData: SuperValidated<Infer<LoginSchema>>;
	export let registerData: SuperValidated<Infer<RegisterSchema>>;
	export let confirmationData: SuperValidated<Infer<ConfirmationSchema>>;
	export let resetPasswordData: SuperValidated<Infer<ResetPasswordSchema>>;
	export let back: () => void;
	export let confirm: string;

	const loginForm = superForm(loginData, { validators: zodClient(loginSchema), delayMs: 150 });
	const { form: loginFormData, enhance: loginEnhance, delayed: loginDelayed } = loginForm;

	const registrationForm = superForm(registerData, {
		validators: zodClient(registerSchema),
		delayMs: 150
	});
	const {
		form: registrationFormData,
		enhance: registrationEnhance,
		delayed: registrationDelayed
	} = registrationForm;

	const confirmationForm = superForm(confirmationData, {
		validators: zodClient(confirmationSchema),
		delayMs: 150
	});
	const {
		form: confirmationFormData,
		enhance: confirmationEnhance,
		delayed: confirmationDelayed
	} = confirmationForm;

	const resetPasswordForm = superForm(resetPasswordData, {
		validators: zodClient(resetPasswordSchema),
		delayMs: 150
	});
	const {
		form: resetPasswordFormData,
		enhance: resetPasswordEnhance,
		message: resetPasswordMessage,
		delayed: resetPasswordDelayed
	} = resetPasswordForm;

	zxcvbnOptions.setOptions({
		translations,
		graphs: adjacencyGraphs,
		dictionary: { ...commonDictionary, ...englishDictionary }
	});

	let passwordStrengthFeedback: FeedbackType;
	$: ({ score: $registrationFormData.passwordStrength, feedback: passwordStrengthFeedback } =
		zxcvbn($registrationFormData.password));

	let mode: 'login' | 'register' | 'confirm' | 'reset-password' = 'login';
	let strengthDescription: string;
	$: switch ($registrationFormData.passwordStrength) {
		case 3:
			strengthDescription = 'OK';
			break;
		case 4:
			strengthDescription = 'Strong';
			break;
		default:
			strengthDescription = 'Low';
			break;
	}
	$: if (confirm) {
		mode = 'confirm';
		$confirmationFormData.email = confirm;
	}
</script>

<div class="form">
	{#if mode === 'login'}
		<h4>Sign In</h4>
		<h1>Welcome to 1dentity!</h1>
		<form method="POST" action="?/login" use:loginEnhance>
			<Field form={loginForm} name="email">
				<div class="input-group">
					<Control let:attrs>
						<Label>Email Address</Label>
						<input
							{...attrs}
							type="email"
							bind:value={$loginFormData.email}
							placeholder="Email Address"
						/>
					</Control>
					<FieldErrors />
				</div>
			</Field>
			<Field form={loginForm} name="password">
				<div class="input-group">
					<Control let:attrs>
						<Label>Password</Label>
						<input
							{...attrs}
							type="password"
							bind:value={$loginFormData.password}
							placeholder="Password"
						/>
					</Control>
					<FieldErrors />
				</div>
			</Field>
			<section id="buttons">
				<button class="primary">
					{#if $loginDelayed}
						<Loader />
					{:else}
						Login
					{/if}
				</button>

				<button class="tertiary" type="button" on:click={back} disabled={$loginDelayed}
					>Cancel</button
				>
			</section>
			<section id="actions">
				<span
					>Need to <button class="text" on:click={() => (mode = 'register')}>Register?</button
					></span
				>
				<button class="text" on:click={() => (mode = 'reset-password')}>Forgotten Password?</button>
			</section>
		</form>
	{/if}

	{#if mode === 'reset-password'}
		<h4>Reset Password</h4>
		<p>
			Forgotten your password? No worries, we all do it from time to time. Tell us your email and if
			you have an account, we will send you an email with further details
		</p>

		{#if $resetPasswordMessage}
			<p class="message">{$resetPasswordMessage}</p>
		{/if}

		<form method="POST" action="?/resetPassword" use:resetPasswordEnhance>
			<Field form={resetPasswordForm} name="email">
				<div class="input-group">
					<Control let:attrs>
						<Label>Email Address</Label>
						<input
							{...attrs}
							type="text"
							bind:value={$resetPasswordFormData.email}
							placeholder="Email Address"
						/>
					</Control>
					<FieldErrors />
				</div>
			</Field>
			<section id="buttons">
				<button class="primary">
					{#if $resetPasswordDelayed}
						<Loader />
					{:else}
						Submit
					{/if}
				</button>
				<button class="tertiary" type="button" on:click={back} disabled={$resetPasswordDelayed}
					>Cancel</button
				>
			</section>
		</form>
	{/if}

	{#if mode === 'register'}
		<h4>Register</h4>
		<h1>Welcome to 1dentity!</h1>

		<form method="POST" action="?/register" use:registrationEnhance>
			<Field form={registrationForm} name="email">
				<div class="input-group">
					<Control let:attrs>
						<Label>Email Address</Label>
						<input
							{...attrs}
							type="text"
							bind:value={$registrationFormData.email}
							placeholder="Email Address"
						/>
					</Control>
					<FieldErrors />
				</div>
			</Field>
			<Field form={registrationForm} name="password">
				<div class="input-group">
					<Control let:attrs>
						<Label>Password</Label>
						<input
							{...attrs}
							type="password"
							bind:value={$registrationFormData.password}
							placeholder="Password"
						/>
					</Control>
					<FieldErrors />
				</div>
			</Field>
			<Field form={registrationForm} name="confirmPassword">
				<div class="input-group">
					<Control let:attrs>
						<Label>Confirm Password</Label>
						<input
							{...attrs}
							type="password"
							bind:value={$registrationFormData.confirmPassword}
							placeholder="Confirm Password"
						/>
					</Control>
					<FieldErrors />
				</div>
			</Field>
			<Field form={registrationForm} name="passwordStrength">
				<Control let:attrs>
					<label for="password-strength">Password Strength: {strengthDescription}</label>
					<meter
						id="password-strength"
						value={$registrationFormData.passwordStrength}
						low="1.9"
						high="2.9"
						optimum="4"
						max="4"
					/>
					<input {...attrs} type="hidden" bind:value={$registrationFormData.passwordStrength} />
					{#if passwordStrengthFeedback?.suggestions && $registrationFormData.password.length > 0}
						<ul>
							{#each passwordStrengthFeedback.suggestions as suggestion}
								<li class="alert">{suggestion}</li>
							{/each}
						</ul>
					{/if}
				</Control>
				<FieldErrors />
			</Field>
			<section id="buttons">
				<button class="primary">
					{#if $registrationDelayed}
						<Loader />
					{:else}
						Register
					{/if}
				</button>

				<button
					class="tertiary"
					type="button"
					on:click={() => (mode = 'login')}
					disabled={$registrationDelayed}>Cancel</button
				>
			</section>
		</form>
	{/if}

	{#if mode === 'confirm'}
		<h4>Confirmation</h4>
		<h1>Confirm Your New Account</h1>
		<p>Enter the Confirmation Code here - or click the link within your confirmation email</p>

		<form method="POST" action="?/confirm" use:confirmationEnhance>
			<Field form={confirmationForm} name="email">
				<div class="input-group">
					<Control let:attrs>
						<input {...attrs} type="hidden" bind:value={$confirmationFormData.email} />
					</Control>
					<FieldErrors />
				</div>
			</Field>
			<Field form={confirmationForm} name="code">
				<div class="input-group">
					<Control let:attrs>
						<Label>Confirmation Code</Label>
						<input
							{...attrs}
							type="text"
							bind:value={$confirmationFormData.code}
							placeholder="Code"
						/>
					</Control>
					<FieldErrors />
				</div>
			</Field>
			<section id="buttons">
				<button class="primary">
					{#if $confirmationDelayed}
						<Loader />
					{:else}
						Submit
					{/if}
				</button>
			</section>
		</form>
	{/if}
</div>

<style>
	li.alert,
	label[for='password-strength'] {
		font-size: 1.35rem;
	}

	li.alert {
		list-style-type: disc;
		margin-left: var(--spacing-2);
	}

	meter {
		width: 100%;
	}
</style>
