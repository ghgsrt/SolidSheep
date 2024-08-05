import { createStore } from 'solid-js/store';
import { Item } from '../core/items/item';
import { Dialogue, GetDialogue } from '../core/dialogues/dialogue';
import { EntityID } from '../core/dialogues/entities/entity';
import { formatLabel } from '../utils/utils';
import { Accessor, batch, createMemo } from 'solid-js';
import { entityLUT } from '../core/LUTs';
import { ControllerFns } from './Controller';

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
	activeSpeaker?: EntityID;
	options: StoryOptions | undefined;

	// containers
	history: { name: string; text: string }[];
	journal: string[];
	notebook: string[];
	inventory: (Item | undefined)[];

	// player
	playerName: string;

	ranDialogues: Set<GetDialogue<EntityID>>;

	context?: ControllerFns;
	getPortrait: (side: 'left' | 'right', key: 'Image' | 'Name') => string;
	provideContext: (context: ControllerFns) => void;
	// activeDialogue?: Dialogue;
	// functions
	leftPortraitImage: Accessor<string>;
	rightPortraitImage: Accessor<string>;
	leftPortraitName: Accessor<string>;
	rightPortraitName: Accessor<string>;
	// activeDialogue: Accessor<Dialogue | undefined>;
	// setDialogue: (dialogue: Dialogue, side?: 'left' | 'right') => void;
	// updateDialogueIdx: (idx: number) => void;
	// continueDialogue: () => void;
	updatePortrait: (
		side: 'left' | 'right',
		key: 'image' | 'name',
		value: string
	) => void;
	clearPortrait: (side: 'left' | 'right', key?: 'image' | 'name') => void;
	clearPortraits: (key?: 'image' | 'name') => void;
	hasExamined: (item: Item) => boolean;
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

	activeSpeaker: undefined,
	options: undefined,

	history: [],
	journal: [],
	notebook: [],
	inventory: [],

	playerName: '',

	ranDialogues: new Set(),

	context: undefined,
	provideContext: (context) => {
		setState('context', context);
	},

	getPortrait: (side, key) => {
		return (
			(state[`_${side}Portrait${key}`] ||
				(state[`${side}Dialogue`] &&
					(state[`${side}Dialogue`]?.[`portrait${key}`] ||
						entityLUT[state[`${side}Dialogue`]!.entity][`portrait${key}`]))) ??
			''
		);
	},
	leftPortraitImage: createMemo(() => state?.getPortrait?.('left', 'Image')),
	rightPortraitImage: createMemo(() => state?.getPortrait?.('right', 'Image')),
	leftPortraitName: createMemo(
		() => state?.getPortrait?.('left', 'Name').split(' ')[0]
	),
	rightPortraitName: createMemo(
		() => state?.getPortrait?.('right', 'Name').split(' ')[0]
	),
	// activeDialogue: undefined,
	// activeDialogue: () => {
	// 	return (
	// 		state.DMDialogue ??
	// 		(state.activeSpeaker ===
	// 		(state.leftDialogue?.speaker || state.leftDialogue?.entity)
	// 			? state.leftDialogue
	// 			: state.activeSpeaker ===
	// 			  (state.rightDialogue?.speaker || state.rightDialogue?.entity)
	// 			? state.rightDialogue
	// 			: undefined)
	// 	);
	// },
	// async setDialogue(dialogue, side) {
	// 	// setState('options', undefined);
	// },
	// updateDialogueIdx(idx) {
	// 	if (idx >= (state.activeDialogue?.text.length ?? 0) - 1)
	// 		state.activeDialogue?.onEnd?.(state.context!);

	// 	batch(() => {
	// 		setState('dialogueIdx', idx);
	// 		setState('dialogue', state.activeDialogue?.text[idx] ?? '');
	// 	});
	// },
	// continueDialogue() {
	// 	state.updateDialogueIdx(state.dialogueIdx + 1);
	// },
	updatePortrait(side, key, value) {
		setState(
			`_${side as 'left' | 'right'}Portrait${
				formatLabel(key) as 'Image' | 'Name'
			}`,
			value
		);
	},
	clearPortrait(side, key) {
		batch(() => {
			if (!key || key === 'image') setState(`_${side}PortraitImage`, '');
			if (!key || key === 'name') setState(`_${side}PortraitName`, '');
			if (!key) setState(`${side}Dialogue`, undefined);
		});
	},
	clearPortraits(key) {
		batch(() => {
			if (!key || key === 'image') {
				setState('_leftPortraitImage', '');
				setState('_rightPortraitImage', '');
			}
			if (!key || key === 'name') {
				setState('_leftPortraitName', '');
				setState('_rightPortraitName', '');
			}
			if (!key) {
				setState('leftDialogue', undefined);
				setState('rightDialogue', undefined);
			}
		});
	},
	hasExamined(item) {
		if (item.id === 'scrollOfSPA') return state.hasExaminedScroll;
		else return false;
	},
};

setState(defaultState);
