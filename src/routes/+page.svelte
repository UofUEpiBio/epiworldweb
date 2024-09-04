<script lang="ts">
	import Share from 'lucide-svelte/icons/share';

	import { Button } from '$lib/components/ui/button/index.js';
	import PropertyEditor from '$lib/components/panes/PropertyEditor.svelte';
	import ViewZone from '$lib/components/panes/ViewZone.svelte';
	import Unimplemented from '$lib/components/Unimplemented.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<div class="grid h-screen w-full">
	<div class="flex flex-col">
		<header
			class="sticky top-0 z-10 mx-1 flex h-[57px] items-center gap-1 border-b bg-background px-4"
		>
			<div class="flex items-center gap-3">
				<h1 class="left-1 text-xl font-semibold">
					<a href="https://github.com/UofUEpiBio/epiworld">EpiworldWeb (v0.1.0)</a>
				</h1>
				<Badge variant="outline" class="translate-y-0.5">Beta</Badge>
			</div>
			<div class="ml-auto">
				<Unimplemented>
					<Button variant="outline" size="sm" class="gap-1.5 text-sm" disabled>
						<Share class="size-3.5" />
						Share
					</Button>
				</Unimplemented>
			</div>
		</header>

		<main class="flex h-[calc(100vh-4rem)] gap-4">
			<div class="h-full w-1/3 overflow-y-auto p-4">
				<PropertyEditor />
			</div>

			<div class="h-full w-2/3 overflow-y-auto p-4 py-6">
				<ViewZone />
			</div>
		</main>
	</div>
</div>

<Toaster />

<!-- <div class="grid h-screen w-full">
	<div class="flex flex-col">
		<header
			class="sticky top-0 z-10 mx-1 flex h-[57px] items-center gap-1 border-b bg-background px-4"
		>
			<div class="flex items-center gap-3">
				<h1 class="left-1 text-xl font-semibold">
					<a href="https://github.com/UofUEpiBio/epiworld">EpiworldWeb (v0.1.0)</a>
				</h1>
				<Badge variant="outline" class="translate-y-0.5">Beta</Badge>
			</div>
			<Drawer.Root>
				<Drawer.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" size="icon" class="md:hidden">
						<Settings class="size-4" />
						<span class="sr-only">Settings</span>
					</Button>
				</Drawer.Trigger>
				<Drawer.Content class="max-h-[80vh]">
					<Drawer.Header>
						<Drawer.Title>Configuration</Drawer.Title>
						<Drawer.Description>
							Configure the settings for the model and messages.
						</Drawer.Description>
					</Drawer.Header>
					<form class="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
						<fieldset class="grid gap-6 rounded-lg border p-4">
							<legend class="-ml-1 px-1 text-sm font-medium"> Settings </legend>
							<div class="grid gap-3">
								<Label for="model">Model</Label>
								<Select.Root>
									<Select.Trigger id="model" class="items-start [&_[data-description]]:hidden">
										<Select.Value placeholder="Select a model" />
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="genesis" label="Neural Genesis">
											<div class="flex items-start gap-3 text-muted-foreground">
												<Rabbit class="size-5" />
												<div class="grid gap-0.5">
													<p>
														Neural
														<span class="font-medium text-foreground"> Genesis </span>
													</p>
													<p class="text-xs" data-description>
														Our fastest model for general use cases.
													</p>
												</div>
											</div>
										</Select.Item>
										<Select.Item value="explorer" label="Neural Explorer">
											<div class="flex items-start gap-3 text-muted-foreground">
												<Bird class="size-5" />
												<div class="grid gap-0.5">
													<p>
														Neural
														<span class="font-medium text-foreground"> Explorer </span>
													</p>
													<p class="text-xs" data-description>
														Performance and speed for efficiency.
													</p>
												</div>
											</div>
										</Select.Item>
										<Select.Item value="quantum" label="Neural Quantum">
											<div class="flex items-start gap-3 text-muted-foreground">
												<Turtle class="size-5" />
												<div class="grid gap-0.5">
													<p>
														Neural
														<span class="font-medium text-foreground"> Quantum </span>
													</p>
													<p class="text-xs" data-description>
														The most powerful model for complex computations.
													</p>
												</div>
											</div>
										</Select.Item>
									</Select.Content>
								</Select.Root>
							</div>
							<div class="grid gap-3">
								<Label for="temperature">Temperature</Label>
								<Input id="temperature" type="number" placeholder="0.4" />
							</div>
							<div class="grid gap-3">
								<Label for="top-p">Top P</Label>
								<Input id="top-p" type="number" placeholder="0.7" />
							</div>
							<div class="grid gap-3">
								<Label for="top-k">Top K</Label>
								<Input id="top-k" type="number" placeholder="0.0" />
							</div>
						</fieldset>
						<fieldset class="grid gap-6 rounded-lg border p-4">
							<legend class="-ml-1 px-1 text-sm font-medium"> Messages </legend>
							<div class="grid gap-3">
								<Label for="role">Role</Label>
								<Select.Root selected={{ value: 'system', label: 'System' }}>
									<Select.Trigger>
										<Select.Value placeholder="Select a role" />
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="system">System</Select.Item>
										<Select.Item value="user">User</Select.Item>
										<Select.Item value="assistant">Assistant</Select.Item>
									</Select.Content>
								</Select.Root>
							</div>
							<div class="grid gap-3">
								<Label for="content">Content</Label>
								<Textarea id="content" placeholder="You are a..." />
							</div>
						</fieldset>
					</form>
				</Drawer.Content>
			</Drawer.Root>
			<div class="ml-auto">
				<Unimplemented>
					<Button variant="outline" size="sm" class="gap-1.5 text-sm" disabled>
						<Share class="size-3.5" />
						Share
					</Button>
				</Unimplemented>
			</div>
		</header>
		<main class="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
			<PropertyEditor />
			<ViewZone />
		</main>
	</div>
</div> -->
