import { createDialogue } from './dialogue';

// Miscellaneous party diaglogues
// i.e., spoken by party member 1

export const MP1DialogueNames = ['playerTakesScroll'] as const;
export type MP1DialogueName = (typeof MP1DialogueNames)[number];

export const [MP1DefaultProps, MP1Dialogues] = createDialogue(
	{
		entity: 'MP1',
	},
	{
		playerTakesScroll: {
			text: ['What is that? Can you <strong>explain</strong> it to us?'],
			onEnd: ({ runDialogue, setOptions }) => {
				console.log('huh')
				setOptions({
					"I'm not sure": () => runDialogue('PL', 'explainsScroll'),
					'Examine the scroll': () => runDialogue('DM', 'playerExaminesScroll'),
					'Attempt to use the scroll': () =>
						runDialogue('DM', 'playerUsesScroll'),
				});
			},
		},
	}
);
