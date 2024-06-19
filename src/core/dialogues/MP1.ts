import { createDialogue } from './dialogue';

// Miscellaneous party diaglogues
// i.e., spoken by party member 1

export const MP1DialogueNames = [
	'playerTakesScroll',
	'shouldWeFollow',
] as const;
export type MP1DialogueName = (typeof MP1DialogueNames)[number];

export const [MP1DefaultProps, MP1Dialogues] = createDialogue({
	entity: 'MP1',
})(({ setOptions, runDialogue }) => ({
	playerTakesScroll: {
		text: ['What is that? Can you <strong>explain</strong> it to us?'],
		onEnd: () => {
			setOptions({
				"I'm not sure": () => runDialogue('PL', 'explainsScroll'),
				'Examine the scroll': () => runDialogue('DM', 'playerExaminesScroll'),
				'Attempt to use the scroll': () =>
					runDialogue('DM', 'playerUsesScroll'),
			});
		},
	},
	shouldWeFollow: {
		text: ['Should we follow them?'],
		onEnd: () => {
			setOptions({
				'Chase after Guz': () => runDialogue('DM', 'chaseGuz'),
				'Allow Guz to take Finethir': () =>
					runDialogue('DM', 'playerLeavesGuzAlone'),
			});
		},
	},
}));
