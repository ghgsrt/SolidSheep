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
})(({ setOptions, runDialogue, queueDialogue, clearPortrait }) => ({
	playerExplainsScroll: {
		text: ['<em>The sheep nods and bleats at you enthusiastically</em>'],
		portraitName: 'Mysterious Sheep',
		onEnd: () => {
			setOptions({
				'Activate the scroll': () => runDialogue('DM', 'playerUsesScroll'),
			});
		},
	},
	sheepSpeaksFirstTime: {
		text: ['Now that you can understand me...'],
		portraitName: 'Mysterious Sheep',
		onEnd: () => queueDialogue('SB', 'sheepIntroducesSelf'),
		beforeNext: async () => {
			await clearPortrait('SB', 'name');
		},
	},
	sheepIntroducesSelf: {
		text: ['I am Finethir Shinebright, a wizard in dire need of aid'],
		onEnd: () => queueDialogue('SB', 'sheepExplainsQuest'),
	},
	sheepExplainsQuest: {
		text: [
			'<em>The sheep explains the quest</em>',
			'<em>blah blah evil wizard...</em>',
		],
		onEnd: () => {
			// toggleFlag('SBExplainedQuest');
			queueDialogue('DM', 'gruzAppears');
		},
		beforeNext: async () => await clearPortrait('SB'),
	},
	playerAskWhoIsMasterNoke: {
		text: ["He's the evil wizard I just told you about!"],
		onEnd: () => queueDialogue('GZ', 'whoIsMasterNoke'),
	},
	gruzKnowsSheep: {
		text: ['I believe he already knows that I am not a sheep...'],
		onEnd: () => queueDialogue('GZ', 'gruzKnowsSheep'),
	},
	sheepNamesGruz: {
		text: [
			"If I recall correctly, his name is Guz and he is Noke's favorite lackey",
		],
		onEnd: () => queueDialogue('GZ', 'guzNamed'),
	},
	gruzThreatensSheep: {
		text: [
			'...',
			'<em>Finethir stifles a bleat before looking at you with pleading eyes</em>',
		],
		onEnd: () => queueDialogue('GZ', 'firstOptionsNode'),
	},
}));
