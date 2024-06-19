import { createMemo, batch, Accessor } from 'solid-js';
import { formatLabel } from '../../utils/utils';
import { entityLUT } from '../LUTs';
import { Dialogue } from '../dialogues/dialogue';
import { StoryOptions } from './state';
import { createStore } from 'solid-js/store';
import { Item } from '../items/item';

export type Side = 'left' | 'right';
export type PortraitKey = 'Image' | 'Name';

export type State = {
	DMDialogue?: Dialogue;
	// active portraits
	leftDialogue?: Dialogue;
	rightDialogue?: Dialogue;

	activeSide?: Side;

	// dialogueIdx: number;

	// images/portrait overrides
	bgImage: string;
	_leftPortraitImage: string;
	_rightPortraitImage: string;

	// text/portrait overrides
	// dialogue: string;
	_leftPortraitName: string;
	_rightPortraitName: string;

	// story
	options: StoryOptions | undefined;

	// player
	playerName: string;
};

export type StateFns = {
	leftPortraitImage: Accessor<string>;
	rightPortraitImage: Accessor<string>;
	leftPortraitName: Accessor<string>;
	rightPortraitName: Accessor<string>;
	dialogue: Accessor<string>;
	activeDialogue: Accessor<Dialogue | undefined>;
	setDialogue: (dialogue: Dialogue, side?: 'left' | 'right') => void;
	// updateDialogueIdx: (idx: number) => void;
	continueDialogue: () => void;
	updatePortrait: (
		side: 'left' | 'right',
		key: 'image' | 'name',
		value: string
	) => void;
	clearPortrait: (side: 'left' | 'right', key?: 'image' | 'name') => void;
	clearPortraits: (key?: 'image' | 'name') => void;
};

const defaultState: State = {
	bgImage: '',
	// dialogue: '',

	DMDialogue: undefined,
	leftDialogue: undefined,
	rightDialogue: undefined,

	activeSide: undefined,
	// dialogueIdx: 0,

	_leftPortraitImage: '',
	_rightPortraitImage: '',

	_leftPortraitName: '',
	_rightPortraitName: '',

	options: undefined,

	playerName: '',
};

export function useState(defaultState: State): [State, StateFns] {
	const [state, setState] = createStore<State>(defaultState);

	const getPortrait = (side: Side, key: PortraitKey) => {
		return (
			(state[`_${side}Portrait${key}`] ||
				(state[`${side}Dialogue`] &&
					(state[`${side}Dialogue`]?.[`portrait${key}`] ||
						entityLUT[state[`${side}Dialogue`]!.entity][`portrait${key}`]))) ??
			''
		);
	};

	// const updateDialogueIdx = (idx: number) => {
	// 	if (idx >= (state.activeDialogue?.text.length ?? 0) - 1)
	// 		state.activeDialogue?.onEnd?.(state.context!);

	// 	batch(() => {
	// 		setState('dialogueIdx', idx);
	// 		setState('dialogue', state.activeDialogue?.text[idx] ?? '');
	// 	});
	// };

	const activeDialogue = createMemo(
		() =>
			state.DMDialogue ??
			(state.activeSide === 'left'
				? state.leftDialogue
				: state.activeSide === 'right'
				? state.rightDialogue
				: undefined)
	);

	return [
		state,
		{
			leftPortraitImage: createMemo(() => getPortrait('left', 'Image')),
			rightPortraitImage: createMemo(() => getPortrait('right', 'Image')),
			leftPortraitName: createMemo(
				() => getPortrait('left', 'Name').split(' ')[0]
			),
			rightPortraitName: createMemo(
				() => getPortrait('right', 'Name').split(' ')[0]
			),
			dialogue: createMemo(
				() => activeDialogue()?.text[activeDialogue()!.idx] ?? ''
			),
			activeDialogue,
			setDialogue(dialogue, side) {
				// setState('options', undefined);
			},
			continueDialogue() {
				activeDialogue()?.continue();
				// updateDialogueIdx(state.dialogueIdx + 1);
			},
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
		},
	];
}

export const [state, stateController] = useState(defaultState);
