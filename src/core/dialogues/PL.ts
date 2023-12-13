import { Dialogue, ReqDialogueProps } from './dialogue';

// Player dialogues

const plDialogue = [
	'takesScroll',
	'explainsScroll',
	'_explainScroll',
	'_cantExplainScroll',
] as const;
export type PLDialogue = (typeof plDialogue)[number];

export const PLDefaultProps = {
	entity: 'PL',
} as const satisfies Partial<Dialogue>;

export const PLDialogues: Record<PLDialogue, ReqDialogueProps> = {
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
};
