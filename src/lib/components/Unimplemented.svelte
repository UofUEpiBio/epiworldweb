<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
</script>

<Tooltip.Root openDelay={100}>
	<Tooltip.Trigger>
		<slot />
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>This feature is not yet implemented.</p>
	</Tooltip.Content>
</Tooltip.Root>
