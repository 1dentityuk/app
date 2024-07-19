<script lang="ts">
	import { enhance } from '$app/forms';
	import Google from '$lib/assets/svg/google.svg?component';

	export let back: () => void;
</script>

<div class="form">
	<h4>Sign In</h4>
	<h1>Welcome to 1dentity!</h1>

	<form method="POST" action="?/socials" use:enhance>
		<input type="hidden" id="provider" name="provider" value="google" />
		<button class="secondary"><i class="google"><Google /></i> Sign in with Google</button>
	</form>

	<button class="tertiary" type="button" on:click={back}>Cancel</button>
</div>

<style>
	form {
		padding: var(--spacing-2) 0;
	}

	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	i.google {
		width: 2.4rem;
	}

	button.tertiary {
		width: 90%;
	}
</style>
