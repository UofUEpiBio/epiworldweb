import { generateCode as generatePythonCode } from './python';
import { generateCode as generateRCode } from './r';

export { generatePythonCode, generateRCode };

export const interactionLanguages = [
	{
		name: 'Python',
		description: 'Via Pyodide & EpiworldPy.'
	},
	{
		name: 'R',
		description: 'Via WebR & EpiworldR.'
	},
	{
		name: 'None',
		description: 'Just let me export.'
	}
];
