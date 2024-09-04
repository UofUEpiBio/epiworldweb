import { writable } from 'svelte/store';
import { BlockType } from '$lib/block';
import welcome from '$lib/components/panes/content/welcome.md?raw';

const initialBlocks = [
	{
		type: BlockType.Markdown,
		content: welcome
	}
];

export const blocks = writable(initialBlocks);
