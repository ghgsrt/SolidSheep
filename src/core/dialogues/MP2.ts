import { createDialogue } from './dialogue';

// Miscellaneous party diaglogues
// i.e., spoken by party member 2

export const MP2DialogueNames = ['iSeeTracks', '__placeholder'] as const;
export type MP2DialogueName = (typeof MP2DialogueNames)[number];

export const [MP2DefaultProps, MP2Dialogues] = createDialogue({
	entity: 'MP2',
})({
	iSeeTracks: {
		text: [
			'I see tracks leading off to the east. They look to be following a path heading towards the forest.',
			'Should we pursue them?',
		],
		onEnd: ({ setOptions, runDialogue }) => {
			setOptions({
				'Chase after Guz': () => runDialogue('DM', 'onForestPath'),
				'Allow Guz to take Finethir': () =>
					runDialogue('DM', 'playerLeavesGuzAlone'),
			});
		},
	},
	__placeholder: {
		text: [''],
	},
});
