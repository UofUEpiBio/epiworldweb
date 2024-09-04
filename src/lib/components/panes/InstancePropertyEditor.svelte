<script lang="ts">
	// @ts-nocheck

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Unimplemented from '$lib/components/Unimplemented.svelte';
	import HelpCircle from '$lib/components/HelpCircle.svelte';
	import models, { DEFAULT_PARAMETERS } from '$lib/models';
	import { Play, ListRestart } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import SuperDebug from 'sveltekit-superforms';
	import DiffuseIcon from '$lib/icons/DiffuseIcon.svelte';
	import { interactionLanguages } from '$lib/codegen';
	import { z } from 'zod';
	import PropertyError from './PropertyError.svelte';
	import { modelStore } from '$lib/stores/globalPropertyStore';

	const allModels = Object.values(models.map((model) => `${model.provider} ${model.name}`));
	const allowableModels: readonly [string, ...string[]] = [allModels[0], ...allModels.slice(1)];

	const allowableLanguages: readonly [string, ...string[]] = [
		'Python (via Pyodide & EpiworldPy)',
		'R (via WebR & EpiworldR)',
		'None (just let me export)'
	];

	/* Form data. */
	export let form: any = {};
	export let name: string;
	const formErrors: any = {};
	const elements: any = {};

	form['Name'] = name;

	export let setVirusName: any;

	/* Sanitize the model selector value displayed. It will also display the
	 * description by default, so we need to go and chop that part off. */
	function arrayChange(name: String, newModel: any) {
		/* The Bits UI primitive we're using doesn't expose the functionality
		 * we need. We do this because Bits UI will display the description
		 * too, which we don't want. */

		const betterName = newModel.label.trim().split('  ')[0].trim();
		elements[name]['$$']['ctx'][0].innerHTML = betterName;
		form[name] = betterName;
	}

	export function validateParameters() {
		let failed = false;
		for (const [groupName, group] of Object.entries(schema)) {
			for (const [name, parameter] of Object.entries(group)) {
				if (validateParameter(groupName, name) === false) {
					failed = true;
				}
			}
		}

		return !failed;
	}

	export function getData() {
		return form;
	}

	function validateParameter(groupName: string, paramName: string) {
		if (name != form['Name'] && groupName == 'General' && paramName == 'Name') {
			setVirusName(name, form['Name']);
		}

		const parameter = schema[groupName][paramName];
		const type = parameter['type'];
		const typeName = type['_def']['typeName'];

		const value = typeName == 'ZodNumber' ? parseInt(form[paramName]) : form[paramName];
		const validation = type.safeParse(value);

		if (validation.success === false) {
			console.error('Validation of', paramName, validation.error.format());
			formErrors[paramName] = validation.error.format()['_errors'];

			return false;
		} else {
			formErrors[paramName] = [];

			return true;
		}
	}

	function populateModelSchema(modelName: string) {
		/* Prelude. */
		schema['Model'] = {};

		/* TODO: Ugh... */
		const model = models.filter((model) => model.name == modelName)[0];
		console.assert(model, 'Unable to find model', modelName, '.');
		console.debug('Found details', model);

		/* Insert the things we need to insert. */
		for (const [name, data] of Object.entries(model['parameters'])) {
			schema['Model'][name] = data;
		}

		console.debug('Updated schema', schema);
	}

	const schema: any = {
		General: {
			Name: {
				type: z.string().min(1),
				value: String(name)
			},

			Description: {
				type: z.coerce.string(),
				placeholder: 'An optional description'
			}
		},

		Baseline: DEFAULT_PARAMETERS,

		Model: {}
	};

	modelStore.subscribe((value) => {
		if (value) {
			populateModelSchema(value);
		}
	});
</script>

<div class="flex flex-col items-start gap-8 pb-6">
	<div class="grid w-full items-start gap-6">
		{#each Object.entries(schema) as [groupName, group]}
			{#if Object.entries(group).length != 0}
				<fieldset class="grid gap-6 rounded-lg border p-4">
					<legend class="-ml-1 px-1 text-sm font-medium">{groupName}</legend>

					{#each Object.entries(group) as [name, item]}
						{@const typeInfo = item['type']['_def']}
						{@const typeName = typeInfo['typeName']}
						{@const typeChecks = typeInfo['checks']}

						{#if typeName == 'ZodString'}
							<div class="grid gap-3">
								<Label for={name}>{name}</Label>
								<Input
									{name}
									placeholder={item['placeholder']}
									bind:value={form[name]}
									on:change={validateParameter(groupName, name)}
								/>

								<PropertyError errors={formErrors[name]} />
							</div>
						{:else if typeName == 'ZodNumber'}
							<div class="grid gap-3">
								<Label for={name}>{name}</Label>
								<Input
									{name}
									type="number"
									placeholder={item['placeholder']}
									step={item['step']}
									required
									bind:value={form[name]}
									on:change={validateParameter(groupName, name)}
								/>

								<PropertyError errors={formErrors[name]} />
							</div>
						{:else if typeName == 'ZodEnum'}
							<div class="grid gap-3">
								<Label for={name}>{name}</Label>

								<Select.Root
									onSelectedChange={(newModel) => {
										arrayChange(name, newModel);
										validateParameter(groupName, name);

										if (item['run']) {
											item['run'].forEach((x, i) => x());
										}
									}}
								>
									<Select.Trigger class="items-start [&_[data-description]]:hidden">
										<Select.Value bind:this={elements[name]} placeholder={item['placeholder']} />
									</Select.Trigger>
									<Select.Content>
										{#each item['variants'] as variant}
											<Select.Item value={variant.name}>
												<div class="flex items-start gap-3 text-muted-foreground">
													<div class="grid gap-0.5">
														<p class="flex items-center gap-1.5">
															{#if variant.vendor}
																{variant.vendor}
															{/if}

															<span class="font-medium text-foreground"> {variant.name} </span>

															{#if variant.icon}
																<svelte:component this={variant.icon} />
															{/if}
														</p>
														<p class="text-xs" data-description>{variant.description}</p>
													</div>
												</div>
											</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>

								<PropertyError errors={formErrors[name]} />
							</div>
						{:else}
							<p>Bad type <code>{typeName}</code>.</p>
						{/if}
					{/each}
				</fieldset>
			{/if}
		{/each}
	</div>
</div>
