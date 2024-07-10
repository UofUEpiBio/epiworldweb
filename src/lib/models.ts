import DiffuseIcon from '$lib/icons/DiffuseIcon.svelte';
import NetworkIcon from '$lib/icons/NetworkIcon.svelte';
import { z } from 'zod';

/* Source: https://github.com/UofUEpiBio/epiworld/tree/master/include/epiworld/models */
export default [
	{
		provider: 'Epiworld',
		name: 'SEIR',
		description: 'Infection does confer immunity.',
		icon: DiffuseIcon,
		parameters: {
			'contact-rate': z.number().gte(0).lte(20),
			'recovery-prob': z.number().gte(0).lte(1),
			'incubation-days': z.number().int().safe()
		}
	},
	{
		provider: 'Epiworld',
		name: 'Connected SEIR',
		description: 'A SEIR model, but modeled in a network.',
		icon: NetworkIcon,
		parameters: {
			'recovery-prob': z.number().gte(0).lte(1),
			'incubation-days': z.number().int().safe()
		}
	},
	{
		provider: 'Epiworld',
		name: 'SEIRD',
		description: 'Infection does confer immunity, and may cause mortality.',
		icon: DiffuseIcon,
		parameters: {
			'contact-rate': z.number().gte(0).lte(20),
			'recovery-prob': z.number().gte(0).lte(1),
			'mort-prob': z.number().gte(0).lte(1),
			'incubation-days': z.number().int().safe()
		}
	},
	{
		provider: 'Epiworld',
		name: 'Connected SEIRD',
		description: 'A SEIRD model, but modeled in a network.',
		icon: NetworkIcon,
		parameters: {
			'recovery-prob': z.number().gte(0).lte(1),
			'mort-prob': z.number().gte(0).lte(1),
			'incubation-days': z.number().int().safe()
		}
	},
	{
		provider: 'Epiworld',
		name: 'SIR',
		description: 'Infection does confer immunity.',
		icon: DiffuseIcon,
		parameters: {
			'contact-rate': z.number().gte(0).lte(20),
			'recovery-prob': z.number().gte(0).lte(1),
			'incubation-days': z.number().int().safe()
		}
	},
	{
		provider: 'Epiworld',
		name: 'Connected SIR',
		description: 'A SIR model, but modeled in a network.',
		icon: NetworkIcon,
		parameters: {
			'recovery-prob': z.number().gte(0).lte(1),
			'incubation-days': z.number().int().safe()
		}
	},
	{
		provider: 'Epiworld',
		name: 'SIRD',
		description: 'Infection does confer immunity, and may cause mortality.',
		icon: DiffuseIcon,
		parameters: {
			'contact-rate': z.number().gte(0).lte(20),
			'recovery-prob': z.number().gte(0).lte(1),
			'mort-prob': z.number().gte(0).lte(1)
		}
	},
	{
		provider: 'Epiworld',
		name: 'Connected SIRD',
		description: 'A SIRD model, but modeled in a network.',
		icon: NetworkIcon,
		parameters: {
			'recovery-prob': z.number().gte(0).lte(1),
			'mort-prob': z.number().gte(0).lte(1)
		}
	},
	{
		provider: 'Epiworld',
		name: 'SIS',
		description: 'Infection does not confer immunity.',
		icon: DiffuseIcon,
		parameters: {
			'contact-rate': z.number().gte(0).lte(20),
			'recovery-prob': z.number().gte(0).lte(1)
		}
	},
	{
		provider: 'Epiworld',
		name: 'Connected SIS',
		description: 'A SIS model, but modeled in a network.',
		icon: DiffuseIcon,
		parameters: {
			'recovery-prob': z.number().gte(0).lte(1)
		}
	},
	{
		provider: 'Epiworld',
		name: 'SISD',
		description: 'Infection does not confer immunity, and may cause mortality.',
		icon: DiffuseIcon,
		parameters: {
			'contact-rate': z.number().gte(0).lte(20),
			'recovery-prob': z.number().gte(0).lte(1),
			'mort-prob': z.number().gte(0).lte(1)
		}
	},
	{
		provider: 'Epiworld',
		name: 'Connected SISD',
		description: 'A SISD model, but modeled in a network.',
		icon: DiffuseIcon,
		parameters: {
			'recovery-prob': z.number().gte(0).lte(1),
			'mort-prob': z.number().gte(0).lte(1)
		}
	},
	{
		provider: 'Epiworld',
		name: 'Surveillance',
		description: 'Agents can be isolated, even if asyptomatic.',
		icon: NetworkIcon,
		parameters: {}
	}
];
