import { createDialogue } from './dialogue';

// Miscellaneous party diaglogues
// i.e., spoken by party member 2

export const MP2DialogueNames = [] as const;
export type MP2DialogueName = (typeof MP2DialogueNames)[number];

export const [MP2DefaultProps, MP2Dialogues] = createDialogue(
	{
		entity: 'MP2',
	},
	{}
);
