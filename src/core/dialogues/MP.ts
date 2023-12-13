import { Dialogue, ReqDialogueProps } from './dialogue';

// Miscellaneous party diaglogues
// i.e., spoken by a random party member

const mpDialogue = ['playerTakesScroll'] as const;
export type MPDialogue = (typeof mpDialogue)[number];

export const MPDefaultProps = {
	entity: 'MP',
} as const satisfies Partial<Dialogue>;

export const MPDialogues: Record<MPDialogue, ReqDialogueProps> = {
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
		beforeNext: async ({ clearPortrait }) => await clearPortrait('MP', 'playerTakesScroll'),
	},
};
