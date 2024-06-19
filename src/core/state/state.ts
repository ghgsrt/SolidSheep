import { Dialogue } from "../dialogues/dialogue";

export type StoryOption = () => void;
export type StoryOptions = Record<string, StoryOption>;

export type Flag =
	| 'canGetSwA'
	| 'hasSwA'
	| 'hasUsedScroll'
	| 'hasExaminedScroll'
	| 'hasSaidScrollName'
	| 'SwAIsActive'
	| 'SBExplainedQuest'
	| 'SBCaptured'
	| 'gruzAtCompound'
	| 'gruzIsDefeated'
	| 'pathExamined'
	| 'apesAreAsleep'
	| 'apesAreDefeated'
	| 'bearInOuthouse'
	| 'bearIsDefeated'
	| 'partyWantsComp'
	| 'partyIsHostile'
	| 'nokeIsAlerted'
	| 'nokeRetreated'
	| 'wyrmDead'
	| 'nokeDefeated'
	| 'nokeDead';

export type State = {
	// flags
	canGetSwA: boolean;
	hasSwA: boolean;
	hasUsedScroll: boolean;
	hasExaminedScroll: boolean;
	hasSaidScrollName: boolean;
	SwAIsActive: boolean;
	SBExplainedQuest: boolean;
	SBCaptured: boolean;
	gruzAtCompound: boolean;
	gruzIsDefeated: boolean;
	pathExamined: boolean;
	apesAreAsleep: boolean;
	apesAreDefeated: boolean;
	bearInOuthouse: boolean;
	bearIsDefeated: boolean;
	partyWantsComp: boolean;
	partyIsHostile: boolean;
	nokeIsAlerted: boolean;
	nokeRetreated: boolean;
	wyrmDead: boolean;
	nokeDefeated: boolean;
	nokeDead: boolean;

	DMDialogue?: Dialogue;
	// active portraits
	leftDialogue?: Dialogue;
	rightDialogue?: Dialogue;

	dialogueIdx: number;

	// images/portrait overrides
	bgImage: string;
	_leftPortraitImage: string;
	_rightPortraitImage: string;

	// text/portrait overrides
	dialogue: string;
	_leftPortraitName: string;
	_rightPortraitName: string;

	// story
	// activeSpeaker?: EntityID;
	options: StoryOptions | undefined;

	// containers
	history: { name: string; text: string }[];
	journal: string[];
	notebook: string[];
	// inventory: (Item | undefined)[];

	// player
	playerName: string;

	// ranDialogues: Set<GetDialogue<EntityID>>;

	// // context?: ControllerFns;
	// getPortrait: (side: 'left' | 'right', key: 'Image' | 'Name') => string;
	// // provideContext: (context: ControllerFns) => void;
	// // activeDialogue?: Dialogue;
	// // functions
	// leftPortraitImage: Accessor<string>;
	// rightPortraitImage: Accessor<string>;
	// leftPortraitName: Accessor<string>;
	// rightPortraitName: Accessor<string>;
	// // activeDialogue: Accessor<Dialogue | undefined>;
	// // setDialogue: (dialogue: Dialogue, side?: 'left' | 'right') => void;
	// // updateDialogueIdx: (idx: number) => void;
	// // continueDialogue: () => void;
	// updatePortrait: (
	// 	side: 'left' | 'right',
	// 	key: 'image' | 'name',
	// 	value: string
	// ) => void;
	// clearPortrait: (side: 'left' | 'right', key?: 'image' | 'name') => void;
	// clearPortraits: (key?: 'image' | 'name') => void;
	// hasExamined: (item: Item) => boolean;
};

//@ts-ignore
export const [state, setState] = createStore<State>();

const defaultState: State = {
	canGetSwA: false,
	hasSwA: false,
	hasUsedScroll: false,
	hasExaminedScroll: false,
	hasSaidScrollName: false,
	SwAIsActive: false,
	SBExplainedQuest: false,
	SBCaptured: false,
	gruzAtCompound: false,
	gruzIsDefeated: false,
	pathExamined: false,
	apesAreAsleep: false,
	apesAreDefeated: false,
	bearInOuthouse: false,
	bearIsDefeated: false,
	partyWantsComp: false,
	partyIsHostile: false,
	nokeIsAlerted: false,
	nokeRetreated: false,
	wyrmDead: false,
	nokeDefeated: false,
	nokeDead: false,

	bgImage: '',
	dialogue: '',

	DMDialogue: undefined,
	leftDialogue: undefined,
	rightDialogue: undefined,

	dialogueIdx: 0,

	_leftPortraitImage: '',
	_rightPortraitImage: '',

	_leftPortraitName: '',
	_rightPortraitName: '',

	// activeSpeaker: undefined,
	options: undefined,

	history: [],
	journal: [],
	notebook: [],
	// inventory: [],

	playerName: '',

	// ranDialogues: new Set(),

	// context: undefined,
	// provideContext: (context) => {
	// 	setState('context', context);
	// },
};

setState(defaultState);


