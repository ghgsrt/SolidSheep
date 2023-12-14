import { createDialogue } from './dialogue';

// Player dialogues

export const PLDialogueNames = [
	'takesScroll',
	'explainsScroll',
	'_explainScroll',
	'_cantExplainScroll',
] as const;
export type PLDialogueName = (typeof PLDialogueNames)[number];

export const [PLDefaultProps, PLDialogues] = createDialogue(
	{
		entity: 'PL',
	},
	{
		takesScroll: {
			text: ['<em>You take the scroll</em>'],
			onStart: ({ toggleFlag, pushInventoryItem }) => {
				toggleFlag('hasSwA', true);
				pushInventoryItem('scrollOfSPA');
			},
			onEnd: ({ queueDialogue }) => queueDialogue('MP', 'playerTakesScroll'),
		},
		explainsScroll: {
			text: [''], // branches
			onStart: ({ state, toggleFlag, runDialogue }) => {
				if (state.hasExaminedScroll) {
					toggleFlag('hasSaidScrollName');
					runDialogue('PL', '_explainScroll');
				} else runDialogue('PL', '_cantExplainScroll');
			},
		},
		_explainScroll: {
			text: ['<em>You explain the scroll to the party</em>'],
			onEnd: ({ queueDialogue }) => queueDialogue('SB', 'playerExplainsScroll'),
		},
		_cantExplainScroll: {
			text: [
				"Just some scroll or something, I don't know",
				'Perhaps we should try <strong>examining</strong> it?',
			],
			onEnd: ({ setOptions, runDialogue }) => {
				setOptions({
					examine: { scroll: () => runDialogue('DM', 'playerExaminesScroll') },
					use: { scroll: () => runDialogue('DM', 'playerUsesScroll') },
				});
			},
		},
	}
);
