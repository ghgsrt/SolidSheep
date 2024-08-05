import { createDialogue } from './dialogue';

// Finethir Shinebright dialogues

export const SBDialogueNames = [
	'playerExplainsScroll',
	'sheepSpeaksFirstTime',
	'sheepIntroducesSelf',
	'sheepExplainsQuest',
	'playerAskWhoIsMasterNoke',
	'gruzKnowsSheep',
	'sheepNamesGruz',
	'gruzThreatensSheep',
] as const;
export type SBDialogueName = (typeof SBDialogueNames)[number];

export const [SBDefaultProps, SBDialogues] = createDialogue({
	entity: 'SB',
})({
	playerExplainsScroll: {
		text: ['<em>The sheep nods and bleats at you enthusiastically</em>'],
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
		text: [
			'<em>The sheep explains the quest</em>',
			'<em>blah blah evil wizard...</em>',
		],
		onEnd: ({ toggleFlag, queueDialogue }) => {
			toggleFlag('SBExplainedQuest');
			queueDialogue('DM', 'gruzAppears_1');
		},
		beforeNext: async ({ clearPortrait }) => await clearPortrait('SB'),
	},
	playerAskWhoIsMasterNoke: {
		text: ["He's the evil wizard I just told you about!"],
		onEnd: ({ queueDialogue }) => queueDialogue('GZ', 'whoIsMasterNoke'),
	},
	gruzKnowsSheep: {
		text: ['I believe he already knows that I am not a sheep...'],
		onEnd: ({ queueDialogue }) => queueDialogue('GZ', 'gruzKnowsSheep'),
	},
	sheepNamesGruz: {
		text: [
			"If I recall correctly, his name is Guz and he is Noke's favorite lackey",
		],
		onEnd: ({ queueDialogue }) => queueDialogue('GZ', 'guzNamed'),
	},
	gruzThreatensSheep: {
		text: [
			'...',
			'<em>Finethir stifles a bleat before looking at you with pleading eyes</em>',
		],
		onEnd: ({ queueDialogue }) => queueDialogue('GZ', 'firstOptionsNode'),
	},
});
