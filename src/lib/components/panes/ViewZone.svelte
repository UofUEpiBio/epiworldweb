<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Welcome from '$lib/components/panes/content/Welcome.svelte';

	let code = '';

	function listenForCodeBoxSubmitCode(event: any) {
		const textarea = event.target as HTMLTextAreaElement;

		/* Submit? */
		if (event.keyCode == 13 && event.shiftKey) {
			/* Submit! */
			const submit_event = new Event('submit', {
				bubbles: true,
				cancelable: true
			});

			textarea.form!.dispatchEvent(submit_event);

			return false;
		}
	}

	function adjustCodeBoxHeight(event: Event) {
		const textarea = event.target as HTMLTextAreaElement;
		adjustCodeBoxHeightImpl(textarea);
	}

	function adjustCodeBoxHeightImpl(textarea: HTMLTextAreaElement) {
		textarea.style.height = '';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}

	function codeBoxSubmit(event: any) {
		const formData = new FormData(event.target);
		const textarea = event.explicitOriginalTarget;
		const code = formData.get('code');

		/* Send a message saying we've got some code to run. */
		alert(code);

		/* Cleanup. */
		textarea.value = '';
		adjustCodeBoxHeightImpl(textarea);
		event.stopPropagation();
	}
</script>

<!-- flex h-full w-full flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2 -->

<div class="relative col-span-2 h-fit min-h-full flex-col rounded-xl bg-muted/50 p-4">
	<Badge variant="outline" class="absolute right-3 top-3">Output</Badge>

	<div class="prose prose-slate m-4 max-w-none flex-1 dark:prose-invert">
		<Welcome />
	</div>

	<form
		on:submit|preventDefault={codeBoxSubmit}
		class="relative my-8 overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
	>
		<Label for="message" class="sr-only">Message</Label>

		<Textarea
			bind:value={code}
			on:keydown={listenForCodeBoxSubmitCode}
			on:input={adjustCodeBoxHeight}
			id="code"
			name="code"
			placeholder="# Enter a command..."
			class="h-[3.2em] min-h-[3.2em] resize-none border-0 p-3 font-mono shadow-none focus-visible:ring-0"
		/>
	</form>
</div>
