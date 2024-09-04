import DiffuseIcon from '$lib/icons/DiffuseIcon.svelte';
import NetworkIcon from '$lib/icons/NetworkIcon.svelte';
import { z } from 'zod';

const zodder = z; // z.coerce;

/* Parameter library. */
const initial_prevalence = {
	type: zodder.number().min(0),
	placeholder: 0.1,
	step: 0.01
};

const exposure_probability = {
	type: zodder.number().min(0),
	placeholder: 0.1,
	step: 0.01
};

const recovery_probability = {
	type: zodder.number().min(0),
	placeholder: 0.14,
	step: 0.01
};

const mortality_probability = {
	type: zodder.number().min(0),
	placeholder: 0.14,
	step: 0.01
};

const contact_rate = {
	type: zodder.number().gte(0).lte(20),
	placeholder: 4,
	step: 1
};

const incubation_days = {
	type: zodder.number().int().safe(),
	placeholder: 7,
	step: 1
};

/* Automatically inserted parameter queries. */
export const DEFAULT_PARAMETERS = {
	'Initial Prevalence': initial_prevalence,
	'Exposure Probability': exposure_probability,
	'Recovery Probability': recovery_probability
};

export const API_MODEL_NAMES: any = {
	'Epiworld SEIR': 'SEIR',
	'Epiworld Connected SEIR': 'SEIRCONN',
	'Epiworld SEIRD': 'SEIRD',
	'Epiworld Connected SEIRD': 'SEIRDCONN',
	'Epiworld SIR': 'SIR',
	'Epiworld Connected SIR': 'SIRCONN',
	'Epiworld SIRD': 'SIRD',
	'Epiworld Connected SIRD': 'SIRDCONN',
	'Epiworld SIS': 'SIS',
	'Epiworld Connected SIS': 'SISCONN',
	'Epiworld SISD': 'SISD',
	'Epiworld Connected SISD': 'SISDCONN'
};

export const API_PARAMATER_NAMES: any = {
	'Contact Rate': 'contact_rate',
	'Incubation Days': 'incubation_days',
	'Mortality Probability': 'prob_death',
	'Initial Prevalence': 'prevalence',
	'Exposure Probability': 'transmission_rate',
	'Recovery Probability': 'recovery_rate'
};

/* Source: https://github.com/UofUEpiBio/epiworld/tree/master/include/epiworld/models */
export default [
	{
		vendor: 'Epiworld',
		name: 'SEIR',
		description: 'Infection does confer immunity.',
		icon: DiffuseIcon,
		parameters: {
			'Contact Rate': contact_rate,
			'Incubation Days': incubation_days
		}
	},

	{
		vendor: 'Epiworld',
		name: 'Connected SEIR',
		description: 'A SEIR model, but modeled in a network.',
		icon: NetworkIcon,
		parameters: {
			'Incubation Days': incubation_days
		}
	},

	{
		vendor: 'Epiworld',
		name: 'SEIRD',
		description: 'Infection does confer immunity, and may cause mortality.',
		icon: DiffuseIcon,
		parameters: {
			'Contact Rate': contact_rate,
			'Mortality Probability': mortality_probability,
			'Incubation Days': incubation_days
		}
	},

	{
		vendor: 'Epiworld',
		name: 'Connected SEIRD',
		description: 'A SEIRD model, but modeled in a network.',
		icon: NetworkIcon,
		parameters: {
			'Mortality Probability': mortality_probability,
			'Incubation Days': incubation_days
		}
	},
	{
		vendor: 'Epiworld',
		name: 'SIR',
		description: 'Infection does confer immunity.',
		icon: DiffuseIcon,
		parameters: {
			'Contact Rate': contact_rate,
			'Incubation Days': incubation_days
		}
	},
	{
		vendor: 'Epiworld',
		name: 'Connected SIR',
		description: 'A SIR model, but modeled in a network.',
		icon: NetworkIcon,
		parameters: {
			'Incubation Days': incubation_days
		}
	},
	{
		vendor: 'Epiworld',
		name: 'SIRD',
		description: 'Infection does confer immunity, and may cause mortality.',
		icon: DiffuseIcon,
		parameters: {
			'Contact Rate': contact_rate,
			'Mortality Probability': mortality_probability
		}
	},
	{
		vendor: 'Epiworld',
		name: 'Connected SIRD',
		description: 'A SIRD model, but modeled in a network.',
		icon: NetworkIcon,
		parameters: {
			'Mortality Probability': mortality_probability
		}
	},
	{
		vendor: 'Epiworld',
		name: 'SIS',
		description: 'Infection does not confer immunity.',
		icon: DiffuseIcon,
		parameters: {
			'Contact Rate': contact_rate
		}
	},
	{
		vendor: 'Epiworld',
		name: 'Connected SIS',
		description: 'A SIS model, but modeled in a network.',
		icon: DiffuseIcon,
		parameters: {}
	},
	{
		vendor: 'Epiworld',
		name: 'SISD',
		description: 'Infection does not confer immunity, and may cause mortality.',
		icon: DiffuseIcon,
		parameters: {
			'Contact Rate': contact_rate,
			'Mortality Probability': mortality_probability
		}
	},
	{
		vendor: 'Epiworld',
		name: 'Connected SISD',
		description: 'A SISD model, but modeled in a network.',
		icon: DiffuseIcon,
		parameters: {
			'Mortality Probability': mortality_probability
		}
	}
];
