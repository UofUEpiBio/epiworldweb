<script>
	import '$lib/style/app.css';
	import { ModeWatcher } from 'mode-watcher';
	import github from 'svelte-highlight/styles/github';
</script>

<svelte:head>
	{@html github}
</svelte:head>

<ModeWatcher />
<slot />
