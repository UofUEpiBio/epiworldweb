<script lang="ts">
	export let errors: string[] | undefined = [];
</script>

{#if errors && errors.length}
	<div class="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
		{#each errors as err}
			<p class="text-sm">{err}.</p>
		{/each}
	</div>
{/if}
