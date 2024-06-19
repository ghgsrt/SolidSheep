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
})(({ queueDialogue, runDialogue, setOptions }) => ({
	takesScroll: {
		text: ['<em>You take the scroll</em>'],
		onStart: () => {
			// setBGImage('took_scroll.png');
			// toggleFlag('hasSwA', true);
			// pushInventoryItem('scrollOfSPA');
		},
		onEnd: () => queueDialogue('MP1', 'playerTakesScroll'),
	},
	explainsScroll: {
		text: [''], // branches
		onStart: () => {
			// if (hasExamined('scrollOfSPA')) {
			// 	toggleFlag('hasSaidScrollName');
			// 	runDialogue('PL', '_explainScroll');
			// } else runDialogue('PL', '_cantExplainScroll');
		},
	},
	_explainScroll: {
		text: ['<em>You explain the scroll to the party</em>'],
		onEnd: () => queueDialogue('SB', 'playerExplainsScroll'),
	},
	_cantExplainScroll: {
		text: [
			"Just some scroll or something, I don't know",
			'Perhaps we should try <strong>examining</strong> it?',
		],
		onEnd: () => {
			setOptions({
				'Examine the scroll': () => runDialogue('DM', 'playerExaminesScroll'),
				'Use the scroll': () => runDialogue('DM', 'playerUsesScroll'),
			});
		},
	},
}));
