import { Dialogue, ReqDialogueProps } from './dialogue';

// Finethir Shinebright dialogues

const sbDialogue = [
	'playerExplainsScroll',
	'sheepSpeaksFirstTime',
	'sheepIntroducesSelf',
	'sheepExplainsQuest',
] as const;
export type SBDialogue = (typeof sbDialogue)[number];

export const SBDefaultProps = {
	entity: 'SB',
} as const satisfies Partial<Dialogue>;

export const SBDialogues: Record<SBDialogue, ReqDialogueProps> = {
	playerExplainsScroll: {
		text: ['*Nods and bleats enthusiastically*'],
		portraitName: 'Mysterious Sheep',
		speaker: 'Mysterious Sheep',
		onEnd: ({ setOptions, runDialogue }) => {
			setOptions({
				use: { scroll: () => runDialogue('DM', 'playerUsesScroll') },
			});
		},
	},
	sheepSpeaksFirstTime: {
		text: ['Now that you can understand me...'],
		portraitName: 'Mysterious Sheep',
		speaker: 'Mysterious Sheep',
		onEnd: ({ queueDialogue }) => queueDialogue('SB', 'sheepIntroducesSelf'),
		beforeNext: ({ clearPortraitName }) =>
			clearPortraitName('SB', 'sheepSpeaksFirstTime'),
	},
	sheepIntroducesSelf: {
		text: ['I am Finethir Shinebright, a wizard in dire need of aid'],
		onEnd: ({ queueDialogue }) => queueDialogue('SB', 'sheepExplainsQuest'),
	},
	sheepExplainsQuest: {
		text: ['The sheep explains the quest', 'blah blah evil wizard...'],
		onEnd: ({ toggleFlag, queueDialogue }) => {
			toggleFlag('SBExplainedQuest');
			queueDialogue('DM', 'gruzAppears');
		},
		beforeNext: ({ clearPortrait }) =>
			clearPortrait('SB', 'sheepExplainsQuest'),
	},
};
