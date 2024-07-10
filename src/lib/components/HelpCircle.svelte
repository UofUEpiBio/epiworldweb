<script>
	import { CircleHelp } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
</script>

<Dialog.Root>
	<Dialog.Trigger><CircleHelp class="size-4" /></Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>What does this do?</Dialog.Title>
		</Dialog.Header>
		<div class="prose dark:prose-invert">
			<slot />
		</div>
	</Dialog.Content>
</Dialog.Root>
