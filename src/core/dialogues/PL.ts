import { createDialogue } from './dialogue';

// Player dialogues

export const PLDialogueNames = [
	'takesScroll',
	'explainsScroll',
	'_explainScroll',
	'_cantExplainScroll',
] as const;
export type PLDialogueName = (typeof PLDialogueNames)[number];

export const [PLDefaultProps, PLDialogues] = createDialogue({
	entity: 'PL',
})({
	takesScroll: {
		text: ['<em>You take the scroll</em>'],
		onStart: ({ setBGImage, toggleFlag, pushInventoryItem }) => {
			setBGImage('took_scroll.png');
			toggleFlag('hasSwA', true);
			pushInventoryItem('scrollOfSPA');
		},
		onEnd: ({ queueDialogue }) => queueDialogue('MP1', 'playerTakesScroll'),
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
				'Examine the scroll': () => runDialogue('DM', 'playerExaminesScroll'),
				'Use the scroll': () => runDialogue('DM', 'playerUsesScroll'),
			});
		},
	},
});
