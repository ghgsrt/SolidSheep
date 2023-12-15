import { createDialogue } from './dialogue';

// Dungeon Master dialogues

export const DMDialogueNames = [
	'intro',
	'sheepAppears',
	'sheepWavesScroll',
	'playerExaminesScroll',
	'playerUsesScroll',
	'gruzAppears',
	'gruzGrabsSheep',
	'__placeholder',
] as const;
export type DMDialogueName = (typeof DMDialogueNames)[number];

export const [DMDefaultProps, DMDialogues] = createDialogue(
	{
		entity: 'DM',
	},
	{
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

				// setOptions({
				// 	AAAAAAAAAAAAAA: () => {},
				// 	BBBBBBBBBBBBBB: () => {},
				// 	CCCCCCCCCCCCCC: () => {},
				// 	DDDDDDDDDDDDDD: () => {},
				// 	EEEEEEEEEEEEEE: () => {},
				// 	FFFFFFFFFFFFFF: () => {},
				// });
				setOptions({
					"Take the scroll from the sheep's mouth": () =>
						runDialogue('PL', 'takesScroll'),
											AAAAAAAAAAAAAA: () => {},
					BBBBBBBBBBBBBB: () => {},
					CCCCCCCCCCCCCC: () => {},
					DDDDDDDDDDDDDD: () => {},
					EEEEEEEEEEEEEE: () => {},
					FFFFFFFFFFFFFF: () => {},
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
			beforeNext: async ({ clearPortraits }) => await clearPortraits(),
		},
		gruzAppears: {
			text: [
				'A loud howling fills the air, accompanied by the sound of angry yells and the occasional scream that seem to be drawing closer and closer.',
				'The cause quickly becomes apparent as a huge Half-Orc swaggers towards you, pushing his way through the crowd without a care for anybody standing in his way',
				'Walking in front of him appear to be large wolves wearing iron collars, while a hulking figure in a dirty brown cloak travels in his wake with footfalls loud enough to be heard over the ruckus.',
				'The Half-Orc sets his small eyes on you and strides forward with one hand resting on the hilt of a greatsword.',
			],
			onEnd: ({ queueDialogue }) => queueDialogue('GZ', 'intro'),
		},
		gruzGrabsSheep: {
			text: [
				'Before anyone has a chance to react one of the wolves darts forward, grabs the sheep in its jaws, and retreats back to the Half-Orc with its prize.',
				'Gruz grabs the sheep and throws it over his shoulder',
			],
			onEnd: ({ queueDialogue }) => queueDialogue('GZ', 'takingSheep'),
		},
		__placeholder: {
			text: ['🤡 PLACEHOLDER 🤡'],
			onEnd: ({ setOptions }) => setOptions({}),
		},
	}
);
