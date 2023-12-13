import { createStore } from 'solid-js/store';
import { Item } from '../core/items/item';

export type StoryOption = () => void;
export type StoryOptions = Record<string, Record<string, StoryOption>>;

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

	// images
	bgImage: string;
	leftPortraitImage: string;
	rightPortraitImage: string;

	// text
	dialogue: string;
	leftPortraitName: string;
	rightPortraitName: string;

	// story
	activeSpeaker: string;
	options: StoryOptions | undefined;

	// containers
	history: { name: string; text: string }[];
	journal: string[];
	notebook: string[];
	inventory: (Item | undefined)[];

	// player
	playerName: string;

	// functions
	hasExamined: (item: Item) => boolean;
};

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
	leftPortraitImage: '',
	rightPortraitImage: '',

	dialogue: '',
	leftPortraitName: '',
	rightPortraitName: '',

	activeSpeaker: '',
	options: undefined,

	history: [],
	journal: [],
	notebook: [],
	inventory: [],

	playerName: 'Player',

	hasExamined(item: Item) {
		if (item.id === 'scrollOfSPA') return this.hasExaminedScroll;
		else return false;
	},
};

export const [state, setState] = createStore<State>(defaultState);
