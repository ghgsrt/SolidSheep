import { createDialogue } from './dialogue';

// Finethir Shinebright dialogues

export const SBDialogueNames = [
	'playerExplainsScroll',
	'sheepSpeaksFirstTime',
	'sheepIntroducesSelf',
	'sheepExplainsQuest',
] as const;
export type SBDialogueName = (typeof SBDialogueNames)[number];

export const [SBDefaultProps, SBDialogues] = createDialogue(
	{
		entity: 'SB',
	},
	{
		playerExplainsScroll: {
			text: ['*Nods and bleats enthusiastically*'],
			portraitName: 'Mysterious Sheep',
			onEnd: ({ setOptions, runDialogue }) => {
				setOptions({
					'Activate the scroll': () => runDialogue('DM', 'playerUsesScroll'),
				});
			},
		},
		sheepSpeaksFirstTime: {
			text: ['Now that you can understand me...'],
			portraitName: 'Mysterious Sheep',
			onEnd: ({ queueDialogue }) => queueDialogue('SB', 'sheepIntroducesSelf'),
			beforeNext: async ({ clearPortrait }) => {
				await clearPortrait('SB', 'name');
			},
		},
		sheepIntroducesSelf: {
			text: ['I am Finethir Shinebright, a wizard in dire need of aid'],
			onEnd: ({ queueDialogue }) => queueDialogue('SB', 'sheepExplainsQuest'),
		},
		sheepExplainsQuest: {
			text: ['The sheep explains the quest', 'blah blah evil wizard...'],
			onEnd: ({ toggleFlag, queueDialogue }) => {
				toggleFlag('SBExplainedQuest');
				queueDialogue('DM', 'gruzAppears_1');
			},
			beforeNext: async ({ clearPortrait }) => await clearPortrait('SB'),
		},
	}
);
