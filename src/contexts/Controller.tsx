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
import { Dialogue, GetDialogue } from '../core/dialogues/dialogue';
import { itemLUT, speakerLUT } from '../core/LUTs';
import { EntityID } from '../core/dialogues/entities/entity';
import { ViewValues, useView } from './View';
import { Tail } from '../types/utils';

type DialogueLookupFn<R = void> = <
	T extends EntityID,
	N extends GetDialogue<T>
>(
	speaker: T,
	dialogue: N
) => R;

type ExtendFirstParam<T extends (...args: any[]) => any, E extends any> = (
	...args: [Parameters<T>[0] | E, ...Tail<Parameters<T>>]
) => ReturnType<T>;

type Async<T extends (...args: any[]) => any> = (
	...args: Parameters<T>
) => Promise<ReturnType<T>>;

export type ControllerFns = {
	state: State;
	view: ViewValues;
	toggleFlag: (flag: Flag, set?: boolean) => void;
	queueDialogue: DialogueLookupFn;
	runDialogue: DialogueLookupFn;
	continueDialogue: () => void;
	addJournalEntry: (entry: string) => void;
	setBGImage: (image: string) => void;
	setOptions: (options: StoryOptions) => void;
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
		if (idx >= (active()?.text.length ?? 0) - 1) active()?.onEnd?.(context!);

		batch(() => {
			setState('dialogueIdx', idx);
			setState('dialogue', active()?.text[idx] ?? '');
		});
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

			// setState('activeDialogue', dialogue);
		});

		batch(() => {
			updateIdx(0);
			if (dialogue.bgImage) setState('bgImage', dialogue.bgImage);

			setState(`_${side!}PortraitImage`, '');
			setState(`_${side!}PortraitName`, '');
		});
	};
	// const idxUpdate = () => {
	// 	console.log(
	// 		state.activeDialogue()?.portraitName,
	// 		state.activeDialogue() &&
	// 			entityLUT[state.activeDialogue()!.entity].portraitName
	// 	);

	// };
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
		// idxUpdate();
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
		// idxUpdate();
	};

	const toggleFlag = (flag: Flag, set?: boolean) =>
		setState(produce((state) => (state[flag] = set ?? !state[flag])));
	const setBGImage = (image?: string) =>
		setState('bgImage', (prev) => image || prev);
	const setOptions = (options: StoryOptions) => setState('options', options);
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
