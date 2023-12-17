import { createDialogue } from './dialogue';

// Dungeon Master dialogues

export const DMDialogueNames = [
	'intro',
	'sheepAppears',
	'sheepWavesScroll',
	'playerExaminesScroll',
	'playerUsesScroll',
	'gruzAppears_1',
	'gruzAppears_2',
	'gruzGrabsSheep',
	// 'gruzLeaves',
	'playerAbandonsSheep',
	'playerAbandonsSheep_recheck',
	'chaseGuz',
	'playerLeavesGuzAlone',
	'onForestPath',
	'__placeholder',
] as const;
export type DMDialogueName = (typeof DMDialogueNames)[number];

export const [DMDefaultProps, DMDialogues] = createDialogue({
	entity: 'DM',
})({
	intro: {
		text: [
			'Player in party chilling in town',
			'Something odd seems to be happening',
		],
		bgImage: 'intro.png',
		onEnd: ({ queueDialogue }) => queueDialogue('DM', 'sheepAppears'),
	},
	sheepAppears: {
		text: ['A sheep appears', "There's a scroll in its mouth"],
		bgImage: 'sheep_appears.png',
		onEnd: ({ queueDialogue }) => queueDialogue('DM', 'sheepWavesScroll'),
	},
	sheepWavesScroll: {
		text: [
			'The sheep waves the scroll at the party',
			'It seems to want them to <strong>take</strong> it',
		],
		onEnd: ({ toggleFlag, setOptions, runDialogue }) => {
			toggleFlag('canGetSwA');

			setOptions({
				"Take the scroll from the sheep's mouth": () =>
					runDialogue('PL', 'takesScroll'),
			});
		},
	},
	playerExaminesScroll: {
		text: [
			'A wax seal purports that it is a Scroll of Speak with Animals. It seems you might be able to <strong>use</strong> it.',
		],
		onEnd: ({ toggleFlag, setOptions, runDialogue }) => {
			toggleFlag('hasExaminedScroll');

			setOptions({
				'Explain the scroll to your party': () =>
					runDialogue('PL', 'explainsScroll'),
				'Use the scroll': () => runDialogue('DM', 'playerUsesScroll'),
			});
		},
	},
	playerUsesScroll: {
		text: [
			"The sheep's baaing instantly morphs into cultured, elven-accented Common, albeit with a slight hint of a beat",
		],
		onEnd: ({ toggleFlag, queueDialogue, useInventoryItem }) => {
			toggleFlag('hasUsedScroll');
			toggleFlag('SwAIsActive');
			useInventoryItem('scrollOfSPA');
			queueDialogue('SB', 'sheepSpeaksFirstTime');
		},
		beforeNext: async ({ clearPortrait }) => await clearPortrait('MP1'),
	},
	gruzAppears_1: {
		text: [
			'A loud howling fills the air, accompanied by the sound of angry yells and the occasional scream that seem to be drawing closer and closer.',
		],
		onEnd: ({ queueDialogue }) => queueDialogue('DM', 'gruzAppears_2'),
	},
	gruzAppears_2: {
		text: [
			'The cause quickly becomes apparent as a huge Half-Orc swaggers towards you, pushing his way through the crowd without a care for anybody standing in his way',
			'Walking in front of him appear to be large wolves wearing iron collars, while a hulking figure in a dirty brown cloak travels in his wake with footfalls loud enough to be heard over the ruckus.',
			'The Half-Orc sets his small eyes on you and strides forward with one hand resting on the hilt of a greatsword.',
		],
		bgImage: 'gruz_appears.png',
		onEnd: ({ queueDialogue }) => queueDialogue('GZ', 'intro'),
	},
	gruzGrabsSheep: {
		text: [
			'Before anyone has a chance to react one of the wolves darts forward, grabs the sheep in its jaws, and retreats back to the Half-Orc with its prize.',
			'Gruz grabs the sheep and throws it over his shoulder',
		],
		onEnd: ({ queueDialogue }) => queueDialogue('GZ', 'gruzLeaves'),
	},
	playerAbandonsSheep: {
		text: ['You flee the area, leaving behind the sheep and the Half-Orc'],
		onEnd: ({ setOptions, runDialogue }) => {
			setOptions({
				'Go back to where you left the sheep': () =>
					runDialogue('DM', 'playerAbandonsSheep_recheck'),
				'Abandon Finethir Shinebright to his fate': () =>
					runDialogue('DM', 'playerLeavesGuzAlone'),
			});
		},
	},
	playerAbandonsSheep_recheck: {
		text: [
			'You return to the area, but the sheep and the Half-Orc are nowhere to be found',
		],
		onEnd: ({ queueDialogue }) => queueDialogue('MP2', 'iSeeTracks'),
	},
	chaseGuz: {
		text: [
			'You try chase after Guz, but he is too fast and you soon lose sight of him',
			'You noticed he was following a path heading towards the forest, and you decide see where it leads',
		],
		onEnd: ({ queueDialogue }) => queueDialogue('DM', 'onForestPath'),
	},
	playerLeavesGuzAlone: {
		text: [
			'You choose to abandon Finethir Shinebright to his fate, and return to adventuring as you had been',
			'You never see him again',
		],
		onEnd: async ({ endGame }) => await endGame(),
	},
	onForestPath: {
		text: ['Boobies'],
		onEnd: async ({ endGame }) => await endGame(),
	},
	__placeholder: {
		text: ['🤡 To be continued... 🤡'],
		onEnd: async ({ endGame }) => await endGame(),
	},
});
