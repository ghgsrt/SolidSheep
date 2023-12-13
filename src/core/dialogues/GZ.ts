import { Dialogue, ReqDialogueProps } from './dialogue';

// Gruz dialogues

const GZDialogue = ['intro'] as const;
export type GZDialogue = (typeof GZDialogue)[number];

export const GZDefaultProps = {
	entity: 'GZ',
} as const satisfies Partial<Dialogue>;

export const GZDialogues: Record<GZDialogue, ReqDialogueProps> = {
	intro: {
		text: ["That sheep is Master Noke's... he desires to have it back."],
		onEnd: ({ queueDialogue }) => queueDialogue('DM', '__placeholder'),
	},
};
