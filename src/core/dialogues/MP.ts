import { createDialogue } from './dialogue';

// Miscellaneous party diaglogues
// i.e., spoken by a random party member

export const MPDialogueNames = ['playerTakesScroll'] as const;
export type MPDialogueName = (typeof MPDialogueNames)[number];

export const [MPDefaultProps, MPDialogues] = createDialogue(
	{
		entity: 'MP',
	},
	{
		playerTakesScroll: {
			text: ['What is that? Can you <strong>explain</strong> it to us?'],
			portrait: 'mage_party.png',
			onEnd: ({ runDialogue, setOptions }) => {
				setOptions({
					examine: { scroll: () => runDialogue('DM', 'playerExaminesScroll') },
					explain: { scroll: () => runDialogue('PL', 'explainsScroll') },
					use: { scroll: () => runDialogue('DM', 'playerUsesScroll') },
				});
			},
			beforeNext: async ({ clearPortrait }) =>
				await clearPortrait('MP', 'playerTakesScroll'),
		},
	}
);
