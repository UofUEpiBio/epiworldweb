<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import Highlight from 'svelte-highlight';
	import python from 'svelte-highlight/languages/python';
	import r from 'svelte-highlight/languages/r';
	import { BlockType } from '$lib/block';

	export let type: BlockType;
	export let content: string;
</script>

<div class="m-4 rounded">
	{#if type == BlockType.Code}
		<div class="rounded-lg bg-white">
			<Highlight language={python} code={content} />
		</div>
	{:else if type == BlockType.Graph}
		<div class="rounded-lg bg-white"><p>Graph</p></div>
	{:else if type == BlockType.Markdown}
		<div class="prose prose-slate max-w-none flex-1 dark:prose-invert">
			<SvelteMarkdown source={content} />
		</div>
	{/if}
</div>
