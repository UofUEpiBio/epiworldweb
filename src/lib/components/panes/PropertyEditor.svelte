<script lang="ts">
	// @ts-nocheck

	import { generatePythonCode, interactionLanguages } from '$lib/codegen';
	import { z } from 'zod';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import PropertyError from './PropertyError.svelte';
	import InstancePropertyEditor from './InstancePropertyEditor.svelte';
	import { generateRandomInfluenzaStrainName } from '$lib/virus';
	import Button from '../ui/button/button.svelte';
	import { ListRestart, Play, Plus } from 'lucide-svelte';
	import models from '$lib/models';
	import SuperDebug from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { modelStore } from '$lib/stores/globalPropertyStore';
	import { blocks } from '$lib/stores/blockStore';
	import { BlockType } from '$lib/block';

	/* Form data. */
	let form: any = {};
	const elements: any = {};
	const editors: any = {};

	/* Virus information. */
	const definedViruses: any = {};
	let activeVirus = null;

	const availableModels = models.map((element, index, array) => {
		return {
			vendor: element['vendor'],
			name: element['name'],
			description: element['description'],
			icon: element['icon']
		};
	}, {});

	/* Sanitize the model selector value displayed. It will also display the
	 * description by default, so we need to go and chop that part off. */
	function arrayChange(name: String, virus: any) {
		/* The Bits UI primitive we're using doesn't expose the functionality
		 * we need. We do this because Bits UI will display the description
		 * too, which we don't want. */

		const betterName = virus.label.trim().split('  ')[0].trim();
		elements[name]['$$']['ctx'][0].innerHTML = betterName;
		form[name] = betterName;
	}

	function setVirusName(old: string, not_old: string) {
		setActiveVirus(not_old);

		definedViruses[not_old] = Object.create(definedViruses[old]);
		editors[old] = undefined;
		delete definedViruses[old];
	}

	function addRandomVirus() {
		setActiveVirus(generateRandomInfluenzaStrainName());
		definedViruses[activeVirus] = {};
	}

	function setActiveVirus(name: string) {
		activeVirus = name;
		elements['Virus']['$$']['ctx'][0].innerHTML = activeVirus;
		elements['Virus']['$$']['ctx'][0].removeAttribute('data-placeholder');
	}

	function handleReset() {
		form = {};
	}

	function handleSubmit() {
		let okayToSubmit = true;
		let virusData = [];

		if (form['Model'] == undefined) {
			toast.error('Input error', {
				description: 'Please specify a simulation model.'
			});

			return;
		} else if (form['Language'] == undefined) {
			toast.error('Input error', {
				description: 'Please specify an output language.'
			});

			return;
		}

		for (const [name, editor] of Object.entries(editors)) {
			if (editor == undefined) {
				continue;
			}

			let okayToSubmitEditor = editor.validateParameters();

			if (!okayToSubmitEditor) {
				toast.error('Input error', {
					description: 'Some data is missing or invalid in the data panel for virus ' + name + '.'
				});

				okayToSubmit = false;
			}

			virusData.push(editor.getData());
		}

		if (!okayToSubmit) {
			return;
		}

		toast.info('Job submitted', {
			description: 'Results will be available for processing and downloading shortly.'
		});

		console.debug('Submitting data', form, virusData);

		if (form['Language'] == 'Python') {
			blocks.update((currentBlocks) => [
				...currentBlocks,
				{
					type: BlockType.Code,
					content: generatePythonCode(form, virusData)
				}
			]);
		} else if (form['Language'] == 'R') {
			alert('R support unimplemented.');
		}
	}
</script>

<div class="flex flex-col items-start gap-8 pb-6">
	<div class="grid w-full items-start gap-6">
		<div class="grid gap-3">
			<Label for="Language">Language</Label>

			<Select.Root
				onSelectedChange={(language) => {
					arrayChange('Language', language);
				}}
			>
				<Select.Trigger class="items-start [&_[data-description]]:hidden">
					<Select.Value bind:this={elements['Language']} placeholder="Select a Language" />
				</Select.Trigger>
				<Select.Content>
					{#each interactionLanguages as variant}
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

									{#if variant.description}
										<p class="text-xs" data-description>{variant.description}</p>
									{/if}
								</div>
							</div>
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="grid gap-3">
			<Label for="Model">Model</Label>

			<Select.Root
				onSelectedChange={(model) => {
					arrayChange('Model', model);
					modelStore.set(model.value);
				}}
			>
				<Select.Trigger class="items-start [&_[data-description]]:hidden">
					<Select.Value bind:this={elements['Model']} placeholder="Select a Model" />
				</Select.Trigger>
				<Select.Content>
					{#each availableModels as model}
						<Select.Item value={model.name}>
							<div class="flex items-start gap-3 text-muted-foreground">
								<div class="grid gap-0.5">
									<p class="flex items-center gap-1.5">
										{#if model.vendor}
											{model.vendor}
										{/if}

										<span class="font-medium text-foreground"> {model.name} </span>

										{#if model.icon}
											<svelte:component this={model.icon} />
										{/if}
									</p>

									{#if model.description}
										<p class="text-xs" data-description>{model.description}</p>
									{/if}
								</div>
							</div>
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="grid gap-3">
			<Label for="Virus">Virus</Label>

			<div class="flex content-center gap-2">
				<Select.Root
					onSelectedChange={(virus) => {
						arrayChange('Virus', virus);
						activeVirus = virus.value;
					}}
					selected={activeVirus}
					disabled={activeVirus == null}
				>
					<Select.Trigger class="items-start [&_[data-description]]:hidden">
						<Select.Value bind:this={elements['Virus']} placeholder="Add a Virus" />
					</Select.Trigger>
					<Select.Content>
						{#each Object.keys(definedViruses) as variant}
							<Select.Item value={variant}>
								<div class="flex items-start gap-3 text-muted-foreground">
									<div class="grid gap-0.5">
										<p class="flex items-center gap-1.5">
											<span class="font-medium text-foreground">{variant}</span>
										</p>
									</div>
								</div>
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>

				<Button variant="ghost" on:click={addRandomVirus}><Plus /></Button>
			</div>
		</div>
	</div>
</div>

<hr class="pb-4" />

{#each Object.entries(definedViruses) as [name, virus]}
	<div class={activeVirus == name ? '' : 'hidden'}>
		<InstancePropertyEditor bind:this={editors[name]} form={virus} {name} {setVirusName} />
	</div>
{/each}

{#if activeVirus == null}
	<div class="flex items-center justify-center text-sm text-slate-500">
		<p>Add a virus to continue.</p>
	</div>
{:else}
	<div class="flex gap-4">
		<Button
			class="mx-auto w-1/2 gap-1"
			variant="destructive"
			id="reset-button"
			on:click={handleReset}
		>
			<ListRestart class="h-4 w-4" />
			Reset
		</Button>

		<Button class="mx-auto w-1/2 gap-1" id="run-button" on:click={handleSubmit}>
			<Play class="h-4 w-4" />
			Run
		</Button>
	</div>
{/if}

<div class="mt-4 space-y-4 rounded bg-slate-100 px-3 py-4">
	<p>Form</p>
	<SuperDebug data={form} />

	<p>Viruses</p>
	<SuperDebug data={definedViruses} />

	<!-- <p>Editors</p>
	<SuperDebug data={Object.values(editors)} /> -->
</div>
