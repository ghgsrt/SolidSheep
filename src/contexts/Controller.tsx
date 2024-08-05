import {
	createContext,
	Component,
	useContext,
	onMount,
	batch,
	createMemo,
} from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import { Flag, State, StoryOptions, state, setState } from './SessionState';
import { ItemID } from '../core/items/item';
import { produce } from 'solid-js/store';
import { GetDialogue, Dialogue } from '../core/dialogues/dialogue';
import { itemLUT, speakerLUT } from '../core/LUTs';
import { EntityID } from '../core/dialogues/entities/entity';
import { ViewValues, useView } from './View';
import { Tail } from '../types/utils';
import { sleep } from '../utils/utils';

type DialogueLookupFn<R = void> = <
	T extends EntityID,
	N extends GetDialogue<T>
>(
	speaker: T,
	dialogue: N,
	_?: undefined
) => R;
// type DialogueMultiLookupFn<O extends Record<string, any>, R = void> = <
// 	T extends EntityID,
// 	N extends GetDialogue<T>
// >(
// 	speaker: T,
// 	dialogues: N | N[],
// 	options?: O
// ) => R;

type ExtendFirstParam<T extends (...args: any[]) => any, E extends any> = (
	...args: [Parameters<T>[0] | E, ...Tail<Parameters<T>>]
) => ReturnType<T>;

type Async<T extends (...args: any[]) => any> = (
	...args: Parameters<T>
) => Promise<ReturnType<T>>;

export type ControllerFns = {
	state: State;
	view: ViewValues;
	endGame: () => Promise<void>;
	toggleFlag: (flag: Flag, set?: boolean) => void;
	queueDialogue: DialogueLookupFn;
	runDialogue: DialogueLookupFn;
	continueDialogue: () => void;
	addJournalEntry: (entry: string) => void;
	hasRan:
		| DialogueLookupFn<boolean> &
				(<T extends EntityID, N extends GetDialogue<T>>(
					speaker: T,
					dialogues: N[],
					options?: { atLeast?: number; atMost?: number }
				) => { [K in N]: boolean } & { result: boolean });
	setBGImage: (image: string) => void;
	setOptions: (options?: StoryOptions) => void;
	// setDialogue: State['setDialogue'];
	updatePortrait: Async<ExtendFirstParam<State['updatePortrait'], EntityID>>;
	clearPortrait: Async<ExtendFirstParam<State['clearPortrait'], EntityID>>;
	clearPortraits: Async<State['clearPortraits']>;
	pushInventoryItem: (itemID: ItemID) => void;
	consumeInventoryItem: (itemID: ItemID) => void;
	useInventoryItem: (itemID: ItemID) => void;
};

type Props = {
	children: JSX.Element | JSX.Element[];
};

const ControllerContext = createContext<ControllerFns>();

const ControllerProvider: Component<Props> = (props) => {
	const view = useView()!;

	const endGame = async () => {
		setOptions({});
		view.setGameEnding(true);
		await view.updateView('outro', {
			preSleepMS: 2000,
		});
		setOptions(undefined);
		clearPortraits();
	};

	//!!! GIVE BEFORENEXT INFO ON WHAT DIALOGUE IS NEXT

	onMount(() => {});
	const active = createMemo(() => {
		return (
			state.DMDialogue ??
			(state.activeSpeaker ===
			(state.leftDialogue?.speaker || state.leftDialogue?.entity)
				? state.leftDialogue
				: state.activeSpeaker ===
				  (state.rightDialogue?.speaker || state.rightDialogue?.entity)
				? state.rightDialogue
				: undefined)
		);
	});
	const getSideOfEntity = (entity: EntityID) =>
		state.leftDialogue?.entity === entity
			? 'left'
			: state.rightDialogue?.entity === entity
			? 'right'
			: undefined;
	const updateIdx = (idx: number) => {
		batch(() => {
			setState('dialogueIdx', idx);
			setState('dialogue', (prev) => active()?.text[idx] || prev);
		});

		if (idx >= (active()?.text.length ?? 0) - 1) active()?.onEnd?.(context!);
	};
	const setDialogue = async (dialogue: Dialogue, side?: 'left' | 'right') => {
		const entitySide = getSideOfEntity(dialogue.entity);
		side ??= entitySide ?? (!state.leftDialogue ? 'left' : 'right');

		if (dialogue.entity !== 'DM' && !entitySide && state[`${side}Dialogue`])
			await view.hide(side);
		// state.setDialogue(dialogue, side);
		setState('DMDialogue', undefined);
		batch(() => {
			setState('activeSpeaker', dialogue.entity);
			if (dialogue.entity === 'DM') {
				setState('DMDialogue', undefined); //! prevent object merge
				setState('DMDialogue', (_) => dialogue);
			} else {
				setState(`${side!}Dialogue`, undefined); //! prevent object merge
				setState(`${side!}Dialogue`, (_) => dialogue);
			}
		});

		batch(() => {
			updateIdx(0);
			if (dialogue.bgImage) setBGImage(dialogue.bgImage);

			setState(`_${side!}PortraitImage`, '');
			setState(`_${side!}PortraitName`, '');
		});

		setState('ranDialogues', (ran) => ran.add(dialogue.id));
	};

	let dialogueQueue: [EntityID, GetDialogue<EntityID>] | undefined;
	const _runDialogue = async <E extends EntityID>(
		speaker: E,
		dialogue: GetDialogue<E>,
		queue = true
	) => {
		console.log(queue, JSON.stringify(dialogueQueue), dialogue);
		if (queue) {
			dialogueQueue = [speaker, dialogue];
			console.log('queueing');
			return;
		}

		if (active()?.beforeNext) {
			console.log(active()?.id, active()?.beforeNext);
			await active()?.beforeNext?.(context);
		}

		//@ts-ignore typescript is dumb
		const item = speakerLUT[speaker][dialogue];
		console.log(item);
		setDialogue(item);

		item.onStart?.(context);
	};
	const queueDialogue: ControllerFns['queueDialogue'] = (speaker, dialogue) =>
		_runDialogue(speaker, dialogue);
	const runDialogue: ControllerFns['runDialogue'] = (speaker, dialogue) =>
		_runDialogue(speaker, dialogue, false);
	const continueDialogue = () => {
		if (dialogueQueue) {
			console.log(JSON.stringify(dialogueQueue));
			const temp: [EntityID, GetDialogue<EntityID>] = [...dialogueQueue];
			dialogueQueue = undefined;
			runDialogue(...temp);
			return;
		}

		if (state.options) return;
		// state.continueDialogue();
		updateIdx(state.dialogueIdx + 1);
	};

	//@ts-ignore -- it works, shut up
	const hasRan: ControllerFns['hasRan'] = (_entity, dialogues, options) => {
		if (!Array.isArray(dialogues)) return state.ranDialogues.has(dialogues);

		const ran = dialogues.reduce(
			(prev, curr, _i) => {
				const ran = state.ranDialogues.has(curr);
				prev[curr] = ran;
				prev.times += Number(ran);
				return prev;
			},
			{ times: 0 } as Record<string, any>
		);

		if (options?.atLeast)
			return { result: ran.times >= options.atLeast, ...ran };
		if (options?.atMost) return { result: ran.times <= options.atMost, ...ran };
		return { result: ran.times === dialogues.length, ...ran };
	};

	const toggleFlag = (flag: Flag, set?: boolean) =>
		setState(produce((state) => (state[flag] = set ?? !state[flag])));
	const setBGImage = async (image?: string) => {
		if (!image) return;
		if (!image.includes('intro')) {
			view.setHideBG(true);
			await sleep(100);
		}
		setState('bgImage', (prev) => image || prev);
		await sleep(75);
		view.setHideBG(false);
	};
	const setOptions = (options?: StoryOptions) => setState('options', options);
	const addJournalEntry = (entry: string) =>
		setState('journal', (journal) => [...journal, entry]);

	const updatePortrait: ControllerFns['updatePortrait'] = async (
		side,
		key,
		value
	) => {
		if (side !== 'left' && side !== 'right') side = getSideOfEntity(side)!;

		await view.hide(side, key);
		state.updatePortrait(side, key, value);
	};
	const clearPortrait: ControllerFns['clearPortrait'] = async (side, key) => {
		if (side !== 'left' && side !== 'right') side = getSideOfEntity(side)!;

		await view.hide(side, key);
		state.clearPortrait(side, key);
	};
	const clearPortraits: ControllerFns['clearPortraits'] = async (key) => {
		await view.hide(undefined, key);
		state.clearPortraits(key);
	};

	const pushInventoryItem = (itemID: ItemID) => {
		const item = itemLUT[itemID];
		if (!item) return;

		let newQuantity = 0;

		setState(
			'inventory',
			produce((inv) => {
				const idx = inv.findIndex((i) => i?.name === item.name);
				if (idx !== -1) {
					newQuantity = inv[idx]!.quantity += item.quantity;
					return;
				}

				const emptyIdx = inv.findIndex((i) => !i);
				if (emptyIdx !== -1) inv[emptyIdx] = item;
				else inv.push(item);

				newQuantity = item.quantity;
			})
		);

		return newQuantity;
	};
	const consumeInventoryItem = (itemID: ItemID) => {
		setState(
			'inventory',
			produce((inv) => {
				const idx = inv.findIndex((i) => i?.id === itemID);
				if (idx !== -1 && --inv[idx]!.quantity === 0) inv[idx] = undefined;
			})
		);
	};
	const useInventoryItem = (itemID: ItemID) => {
		const idx = state.inventory.findIndex((i) => i?.id === itemID);
		if (idx === -1) return;

		state.inventory[idx]!.onUse?.(context);
	};

	const context: ControllerFns = {
		state,
		view,
		endGame,
		hasRan,
		toggleFlag,
		runDialogue,
		queueDialogue,
		continueDialogue,
		addJournalEntry,
		setBGImage,
		setOptions,
		// setDialogue,
		updatePortrait,
		clearPortrait,
		clearPortraits,
		pushInventoryItem,
		consumeInventoryItem,
		useInventoryItem,
	};
	state.provideContext(context);

	return (
		<ControllerContext.Provider value={context}>
			{props.children}
		</ControllerContext.Provider>
	);
};

export default ControllerProvider;

export function useController() {
	return useContext(ControllerContext);
}
