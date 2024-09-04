import { BlockType } from '$lib/block';
import PYTHON_PRELUDE from '$lib/codegen/python/prelude.py?raw';
import { API_MODEL_NAMES, API_PARAMATER_NAMES } from '$lib/models';
import { blocks } from '$lib/stores/blockStore';

export function generateCode(meta: any, viruses: any) {
	meta = {
		Language: 'Python',
		Model: 'Epiworld SEIR',
		Virus: 'E/Asia 973/892/1939/R3'
	};

	viruses = [
		{
			Name: 'E/Asia 973/892/1939/R3',
			'Initial Prevalence': '0.1',
			'Exposure Probability': '0.1',
			'Recovery Probability': '0.14',
			'Contact Rate': '4',
			'Incubation Days': '7'
		},
		{
			Name: 'K/Australia 592/872/1908/L5',
			'Initial Prevalence': '0.1',
			'Exposure Probability': '0.1',
			'Recovery Probability': '0.14',
			'Contact Rate': '4',
			'Incubation Days': '7'
		},
		{
			Name: 'E/South America 847/919/1941/L2',
			'Initial Prevalence': '0.1',
			'Exposure Probability': '0.1',
			'Recovery Probability': '0.14',
			'Contact Rate': '4',
			'Incubation Days': '7'
		},
		{
			Name: 'F/Europe 40/604/1999/R4',
			'Initial Prevalence': '0.1',
			'Exposure Probability': '0.1',
			'Recovery Probability': '0.14',
			'Contact Rate': '4',
			'Incubation Days': '7'
		}
	];

	console.log('Meta', meta);
	console.log('Viruses', viruses);

	let code = PYTHON_PRELUDE;

	/* Model creation. */
	code += `\n\n# Model creation.
model = epiworld.Model${API_MODEL_NAMES[meta['Model']]}()`;

	/* Virus creation. */
	for (let i = 0; i < viruses.length; i++) {
		code += `\n\n# Create virus '${viruses[i]['Name']}'
virus_${i} = epiworld.Virus(
	name = "${viruses[i]['Name']}"\n`;

		for (const [name, parameter] of Object.entries(viruses[i])) {
			console.log(parameter);
			if (name == 'Name') {
				continue;
			}

			code += `	${API_PARAMATER_NAMES[name]} = ${parameter},\n`;
		}

		code += `)\n\nmodel.add_virus(virus_${i})`;
	}

	code += `\n\n# Run the simulation.
model.run(100, 223)`;

	return code;
}

blocks.update((currentBlocks) => [
	...currentBlocks,
	{
		type: BlockType.Code,
		content: generateCode({}, {})
	}
]);
