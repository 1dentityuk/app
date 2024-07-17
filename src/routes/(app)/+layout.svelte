<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<main>
	<form action="/?/logout" method="POST" use:enhance>
		<button>Logout</button>
	</form>
	<slot />
</main>
