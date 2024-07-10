<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Unimplemented from '$lib/components/Unimplemented.svelte';
	import HelpCircle from '$lib/components/HelpCircle.svelte';
	import models from '$lib/models';
	// import { generate_python_code } from '$lib/codegen';
	import { Play, ListRestart } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { z } from 'zod';
	import SuperDebug from 'sveltekit-superforms';

	const allModels = Object.values(models.map((model) => `${model.provider} ${model.name}`));
	const allowableModels: readonly [string, ...string[]] = [allModels[0], ...allModels.slice(1)];

	const allowableLanguages: readonly [string, ...string[]] = [
		'Python (via Pyodide & EpiworldPy)',
		'R (via WebR & EpiworldR)',
		'None (just let me export)'
	];

	/* Form data. */
	const form: any = {};
	$: extraParameters = [];
	let schema = z.object({});

	updateFormBasedOnModel(undefined);

	/* The value of the model selector, so we can change how it looks later. */
	let modelSelector: any;

	/* Since the form changes for the different types of models we can run, we
	 * need to dynamically create schemas. */
	function updateFormBasedOnModel(modelData: any | undefined) {
		const baseSchema = {
			/* General. */
			name: z.string().min(1, 'Disease name must not be empty.'),
			model: z.enum(allowableModels),
			language: z.enum(allowableLanguages),
			prevalence: z.number().gte(0).lte(1),

			/* Shared. */
			'exposure-prob': z.number().gte(0).lte(1),

			/* Interventions. */
			'masking-prevalence': z.number().gte(0).lte(1),
			'masking-transmission-reduction': z.number().gte(0).lte(1),
			'closure-prevalence': z.number().gte(0).lte(1),
			'closure-transmission-reduction': z.number().gte(0).lte(1),
			'closure-implementation-day': z.number().int().safe()
		};

		if (modelData == null) {
			schema = z.object(baseSchema);
		} else {
			extraParameters = Object.keys(modelData['parameters']);

			schema = z.object({
				...baseSchema,
				...modelData['parameters']
			});
		}
	}

	/* Sanitize the model selector value displayed. It will also display the
	 * description by default, so we need to go and chop that part off. */
	function modelChange(newModel: any) {
		// The Bits UI primitive we're using doesn't expose the functionality
		// we need. We do this because Bits UI will display the description
		// too, which we don't want.
		const betterName = newModel.label.split('  ')[0].trim();
		modelSelector['$$']['ctx'][0].innerHTML = betterName;
		form['model'] = betterName;

		updateFormBasedOnModel(form['model']);
	}

	/* Handle parameter form submission. */
	const handleSubmit = async (event: any) => {
		const result = schema.safeParse(form);

		console.log(result);
		console.log(form);

		if (result.success) {
			console.log(result.data);
			toast.info('Job submitted', {
				description: 'Results will be available for processing and downloading shortly.'
			});
		} else {
			console.log(result.error.errors);
			toast.error('Input error', {
				description: 'Some data is missing from the data panel.'
			});
		}

		event.preventDefault();
	};

	/* function propertySubmit(event: any) {
		const formData = new FormData(event.target);

		if (event.submitter.id === 'run-button') {
			const spec = [['model', model], ['language', language], ...formData].reduce(
				(acc: any, [key, value]) => {
					acc[key] = value;
					return acc;
				},
				{}
			);

			console.log(generate_python_code(spec));
		} else if (event.submitter.id === 'reset-button') {
			toast.error('Unimplemented', {
				description: 'This functionality has yet to be implemented.'
			});
		}
	} */
</script>

<div class="flex flex-col items-start gap-8">
	<form on:submit|preventDefault={handleSubmit} class="grid w-full items-start gap-6">
		<fieldset class="grid gap-6 rounded-lg border p-4">
			<legend class="-ml-1 px-1 text-sm font-medium">General</legend>
			<div class="grid gap-3">
				<Label for="name">Name</Label>
				<Input name="name" placeholder="Disease name" bind:value={form['name']} />
			</div>

			<div class="grid gap-3">
				<Label for="model">Model</Label>
				<Select.Root onSelectedChange={modelChange}>
					<Select.Trigger class="items-start [&_[data-description]]:hidden">
						<Select.Value bind:this={modelSelector} placeholder="Select a model" />
					</Select.Trigger>
					<Select.Content>
						{#each models as model}
							<Select.Item value={model.name}>
								<div class="flex items-start gap-3 text-muted-foreground">
									<div class="grid gap-0.5">
										<p class="flex items-center gap-1.5">
											{model.provider}
											<span class="font-medium text-foreground"> {model.name} </span>
											<svelte:component this={model.icon} />
										</p>
										<p class="text-xs" data-description>{model.description}</p>
									</div>
								</div>
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="grid gap-3">
				<div class="flex gap-1">
					<Label for="language">Interaction Language</Label>
					<HelpCircle>
						<p>
							This is the programming language you'll use to explore the data, if you choose to. You
							may also choose to export the data no matter which option you choose. The following
							languages are supported:
						</p>

						<ol>
							{#each allowableLanguages as language}
								<li>{language}</li>
							{/each}
						</ol>

						<p>
							Don't worry if you don't have these installed on your device; EpiworldWeb will run
							them locally inside the browser for you.
						</p>
					</HelpCircle>
				</div>
				<Select.Root
					onSelectedChange={(v) => {
						// @ts-expect-error Because.
						form['language'] = v.value;
					}}
				>
					<Select.Trigger>
						<Select.Value id="language" placeholder="Select a language" />
					</Select.Trigger>
					<Select.Content>
						{#each allowableLanguages as language}
							<Select.Item value={language}>{language}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</fieldset>

		{#if form['model'] != undefined}
			<fieldset class="grid gap-6 rounded-lg border p-4">
				<legend class="-ml-1 px-1 text-sm font-medium">Baseline</legend>

				{#each extraParameters as parameter}
					<Label for={parameter}>{parameter}</Label>
					<Input
						name="prevalence"
						type="number"
						placeholder="0.1"
						value="0.1"
						min="0"
						step="0.01"
						required
					/>
				{/each}
				<!-- <div class="grid gap-3">
				<Label for="prevalence">Initial Prevalence</Label>
				<Input
					name="prevalence"
					type="number"
					placeholder="0.1"
					value="0.1"
					min="0"
					step="0.01"
					required
				/>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div class="grid gap-3">
					<Label for="exposure-prob">Probability of Exposure (Daily)</Label>
					<Input
						name="exposure-prob"
						type="number"
						placeholder="0.1"
						value="0.1"
						min="0"
						step="0.01"
						required
					/>
				</div>
				<div class="grid gap-3">
					<Label for="recovery-prob">Probability of Recovery (Daily)</Label>
					<Input
						name="recovery-prob"
						type="number"
						placeholder="0.14"
						value="0.14"
						min="0"
						step="0.01"
						required
					/>
				</div>
			</div> -->
			</fieldset>
		{/if}

		<fieldset class="grid gap-6 rounded-lg border p-4">
			<legend class="-ml-1 px-1 text-sm font-medium">Interventions</legend>
			<fieldset class="grid gap-6 rounded-lg border p-4">
				<legend class="-ml-1 px-1 text-sm font-medium">Vaccination</legend>

				<div class="grid gap-3">
					<Label for="vaccination-prevalence">Prevalence</Label>
					<Input
						name="vaccination-prevalence"
						type="number"
						placeholder="0.0"
						value="0.0"
						min="0"
						step="0.01"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-3">
						<Label for="mortality-reduction">Reduction of Mortality</Label>
						<Input
							name="mortality-reduction"
							type="number"
							placeholder="0.67"
							value="0.67"
							min="0"
							step="0.01"
						/>
					</div>
					<div class="grid gap-3">
						<Label for="susceptibility-reduction">Reduction of Susceptibility</Label>
						<Input
							name="susceptibility-reduction"
							type="number"
							placeholder="0.73"
							value="0.73"
							min="0"
							step="0.01"
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-3">
						<Label for="transmission-reduction">Reduction of Transmission</Label>
						<Input
							name="transmission-reduction"
							type="number"
							placeholder="0.71"
							value="0.71"
							min="0"
							step="0.01"
						/>
					</div>
					<div class="grid gap-3">
						<Label for="recovery-increase">Increase of Recovery</Label>
						<Input
							name="recovery-increase"
							type="number"
							placeholder="0.81"
							value="0.81"
							min="0"
							step="0.01"
						/>
					</div>
				</div>
			</fieldset>

			<fieldset class="grid gap-6 rounded-lg border p-4">
				<legend class="-ml-1 px-1 text-sm font-medium">Masking</legend>

				<div class="grid gap-3">
					<Label for="masking-prevalence">Prevalence</Label>
					<Input
						name="masking-prevalence"
						type="number"
						placeholder="0.12"
						value="0.12"
						min="0"
						step="0.01"
					/>
				</div>

				<div class="grid gap-3">
					<Label for="masking-transmission-reduction">Reduction of Transmission</Label>
					<Input
						name="masking-transmission-reduction"
						type="number"
						placeholder="0.44"
						value="0.44"
						min="0"
						step="0.01"
					/>
				</div>

				<div class="grid gap-3">
					<Label for="masking-implementation-day">Implementation Day</Label>
					<Unimplemented>
						<Input
							name="masking-implementation-day"
							type="number"
							placeholder="0"
							value="0"
							min="0"
							step="1"
							disabled
						/>
					</Unimplemented>
				</div>
			</fieldset>

			<fieldset class="grid gap-6 rounded-lg border p-4">
				<legend class="-ml-1 px-1 text-sm font-medium">School Closure</legend>

				<div class="grid gap-3">
					<Label for="closure-prevalence">Prevalence</Label>
					<Input
						name="closure-prevalence"
						type="number"
						placeholder="0.12"
						value="0.12"
						min="0"
						step="0.01"
					/>
				</div>

				<div class="grid gap-3">
					<Label for="closure-transmission-reduction">Reduction of Transmission</Label>
					<Input
						name="closure-transmission-reduction"
						type="number"
						placeholder="0.44"
						value="0.44"
						min="0"
						step="0.01"
					/>
				</div>

				<div class="grid gap-3">
					<Label for="closure-implementation-day">Implementation Day</Label>
					<Input
						name="closure-implementation-day"
						type="number"
						placeholder="0"
						value="0"
						min="0"
						step="1"
					/>
				</div>
			</fieldset>
		</fieldset>

		<div class="flex gap-4">
			<Button class="mx-auto w-1/2 gap-1" type="submit" variant="destructive" id="reset-button">
				<ListRestart class="h-4 w-4" />
				Reset
			</Button>
			<Button class="mx-auto w-1/2 gap-1" type="submit" id="run-button"
				><Play class="h-4 w-4" />Run</Button
			>
		</div>
	</form>
</div>

<SuperDebug data={form} />
