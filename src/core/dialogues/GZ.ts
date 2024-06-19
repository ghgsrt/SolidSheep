import { StoryOptions } from '../../contexts/SessionState';
import { roll } from '../../utils/utils';
import { createDialogue } from './dialogue';

// Gruz dialogues

export const GZDialogueNames = [
	'intro',
	'firstOptionsNode',
	'whoAreYou',
	'guzNamed',
	'gruzThreatensSheep',
	'notASheep',
	'whatDoWithSheep',
	'whoIsMasterNoke',
	'attemptIntimidate',
	'failIntimidate',
	'notLetTakeSheep',
	'gruzKnowsSheep',
	'gruzFedUp',
	'beginFirstCombat',
	'gruzLeaves',
] as const;
export type GZDialogueName = (typeof GZDialogueNames)[number];

export const [GZDefaultProps, GZDialogues] = createDialogue({
	entity: 'GZ',
})(({ hasRan, setOptions, runDialogue, queueDialogue, clearPortrait }) => ({
	intro: {
		text: [
			"That sheep is Master Noke's... he desires to have it back, and I'll be the one deliverin' to him",
		],
		onEnd: () => runDialogue('GZ', 'firstOptionsNode'),
	},
	firstOptionsNode: {
		text: [], //? preserve last dialogue's text
		onStart: () => {
			const options: StoryOptions = {
				'I will not let you take this sheep! (draw weapons)': () =>
					runDialogue('GZ', 'notLetTakeSheep'),
			};

			const sheepRan = hasRan(
				'SB',
				['playerAskWhoIsMasterNoke', 'gruzKnowsSheep', 'sheepNamesGruz'],
				{ atLeast: 2 }
			);
			if (sheepRan.result && !hasRan('GZ', 'gruzThreatensSheep'))
				return queueDialogue('GZ', 'gruzThreatensSheep');

			const guzRan = hasRan('GZ', [
				'whoAreYou',
				'notASheep',
				'whatDoWithSheep',
				'whoIsMasterNoke',
			]);
			if (guzRan.result) return queueDialogue('GZ', 'gruzFedUp');

			if (!guzRan.whoAreYou)
				options['Who are you?'] = () => runDialogue('GZ', 'whoAreYou');
			if (!guzRan.notASheep)
				options["But he isn't actually a sheep"] = () =>
					runDialogue('GZ', 'notASheep');
			if (!guzRan.whoIsMasterNoke)
				options['Who is "Master Noke"?'] = () =>
					sheepRan.result
						? runDialogue('GZ', 'whoIsMasterNoke')
						: runDialogue('SB', 'playerAskWhoIsMasterNoke');
			if (!guzRan.whatDoWithSheep)
				options['What are you going to do with him?'] = () =>
					runDialogue('GZ', 'whatDoWithSheep');
			if (!hasRan('GZ', 'attemptIntimidate'))
				options['<em>Attempt to intimidate Guz</em>'] = () =>
					runDialogue('GZ', 'attemptIntimidate');

			setOptions(options);
		},
	},
	whoAreYou: {
		text: ["Wouldn't you like to know?", '<em>The half-orc smirks</em>'],
		onEnd: () => {
			if (
				hasRan(
					'SB',
					['playerAskWhoIsMasterNoke', 'gruzKnowsSheep', 'sheepNamesGruz'],
					{ atLeast: 2 }
				).result
			)
				setTimeout(() => runDialogue('GZ', 'firstOptionsNode'), 0);
			else queueDialogue('SB', 'sheepNamesGruz');
		},
	},
	guzNamed: {
		text: ["<em>Guz's smirk quickly turns to a frown</em>"],
		onEnd: () => runDialogue('GZ', 'firstOptionsNode'),
	},
	gruzThreatensSheep: {
		text: [
			"Tiny sheep man, Guz <em>really</em> doesn't like how much you talk",
			'<em>Guz glares intensely at Finethir</em>',
		],
		onEnd: () => queueDialogue('SB', 'gruzThreatensSheep'),
	},
	whatDoWithSheep: {
		text: ["I'm afraid that's none of your business"],
		onEnd: () =>
			setTimeout(
				() => runDialogue('GZ', 'firstOptionsNode'),
				0
			) as unknown as void,
	},
	notASheep: {
		text: [
			'<em>The half-orc meets your response with hollow, mirthless laughter</em>',
		],
		onEnd: () => {
			if (
				hasRan(
					'SB',
					['playerAskWhoIsMasterNoke', 'gruzKnowsSheep', 'sheepNamesGruz'],
					{ atLeast: 2 }
				).result
			)
				setTimeout(() => runDialogue('GZ', 'firstOptionsNode'), 0);
			else queueDialogue('SB', 'gruzKnowsSheep');
		},
	},
	whoIsMasterNoke: {
		text: [
			"Master Noke? He's the... the grandiose... uh, supremo of intellectuality and the stratagem... strata...",
			'<em>Guz appears to be straining quite hard</em>',
			"Bah! He's the brains, and I'm the... brawn, yeah. We're like a well-oiled... thingy, working to do... important stuff",
			"And right now you're in the way of that stuff, so scram or I'll have to introduce you to my way of 'negotiating'!",
		],
		onEnd: () => runDialogue('GZ', 'firstOptionsNode'),
	},
	attemptIntimidate: {
		text: ["Negotiations are always my favorite part of Master Noke's jobs"],
		onEnd: () => {
			if (roll(1, 'd20') >= 10) queueDialogue('GZ', 'beginFirstCombat');
			else queueDialogue('GZ', 'failIntimidate');
		},
	},
	failIntimidate: {
		text: ['<em>The half-orc laughs at your attempt to intimidate him</em>'],
		onEnd: () => runDialogue('GZ', 'firstOptionsNode'),
	},
	notLetTakeSheep: {
		text: ['Have it your way'],
		onEnd: () => queueDialogue('GZ', 'beginFirstCombat'),
	},
	gruzKnowsSheep: {
		text: ['Heh, Guz knows lots of things'],
		onEnd: () => runDialogue('GZ', 'firstOptionsNode'),
	},
	gruzFedUp: {
		text: ['<em>You notice Guz is beginning look quite impatient</em>'],
		onEnd: () => queueDialogue('GZ', 'beginFirstCombat'),
	},
	beginFirstCombat: {
		text: ['<em>The half-orc and his wolves prepare to attack</em>'],
		onEnd: () =>
			setOptions({
				'COMBAT NOT IMPL': undefined!,
				'<em>Flee</em>': () => runDialogue('DM', 'playerAbandonsSheep'),
				'<em>Guz captures the sheep and retreats</em>': () =>
					runDialogue('DM', 'gruzGrabsSheep'),
				'<em>Defeat Guz (not impl)</em>': undefined!,
			}),
		beforeNext: async () => await clearPortrait('GZ'),
	},
	gruzLeaves: {
		text: [
			'Now, was that so hard?',
			'<em>Suddenly, Guz and his wolves begin sprinting away, disappearing from sight unnaturally fast</em>',
		],
		onEnd: () => queueDialogue('MP1', 'shouldWeFollow'),
		beforeNext: async () => await clearPortrait('GZ'),
	},
}));
