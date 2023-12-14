import { createDialogue } from './dialogue';

// Dungeon Master dialogues

export const DMDialogueNames = [
	'intro',
	'sheepAppears',
	'sheepWavesScroll',
	'playerExaminesScroll',
	'playerUsesScroll',
	'gruzAppears',
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

				setOptions({
					take: {
						scroll: () => runDialogue('PL', 'takesScroll'),
					},
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
					explain: { scroll: () => runDialogue('PL', 'explainsScroll') },
					use: { scroll: () => runDialogue('DM', 'playerUsesScroll') },
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
		__placeholder: {
			text: ['🤡 PLACEHOLDER 🤡'],
			onEnd: ({ setOptions }) => setOptions({}),
		},
	}
);
