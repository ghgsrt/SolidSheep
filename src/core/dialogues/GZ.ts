import { createDialogue } from './dialogue';

// Gruz dialogues

export const GZDialogueNames = ['intro', 'takingSheep'] as const;
export type GZDialogueName = (typeof GZDialogueNames)[number];

export const [GZDefaultProps, GZDialogues] = createDialogue(
	{
		entity: 'GZ',
	},
	{
		intro: {
			text: ["That sheep is Master Noke's... he desires to have it back."],
			onEnd: ({ queueDialogue }) => queueDialogue('DM', '__placeholder'),
		},
		takingSheep: {
			text: ["I am Guz, and I am taking this sheep."],
			onEnd: ({ setOptions }) => {
				setOptions({
					
				});
			},
		}
	}
);
