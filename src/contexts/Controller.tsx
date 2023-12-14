import {
	createSignal,
	createContext,
	Component,
	useContext,
	batch,
	createEffect,
} from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import { Flag, State, StoryOptions, state, setState } from './SessionState';
import { ItemID } from '../core/items/item';
import { produce } from 'solid-js/store';
import { Dialogue, GetDialogue } from '../core/dialogues/dialogue';
import { entityLUT, itemLUT, speakerLUT } from '../core/LUTs';
import { Entity, EntityID } from '../core/entities/entity';
import promptParser from '../core/parser';
import { useView } from './View';

type DialogueLookupFn<R = void> = <
	T extends EntityID,
	N extends GetDialogue<T>
>(
	speaker: T,
	dialogue: N
) => R;
type EntityOrDialogueLookupFn<R = void> = <
	T extends EntityID,
	N extends GetDialogue<T>
>(
	speaker: T,
	dialogue?: N
) => Promise<R>;
type EntityOrDialogueFn<R = void> = (item: Entity | Dialogue) => Promise<R>;

export type ControllerFns = {
	state: State;
	prompt: (prompt: string) => void;
	toggleFlag: (flag: Flag, set?: boolean) => void;
	queueDialogue: DialogueLookupFn;
	runDialogue: DialogueLookupFn;
	continueDialogue: () => void;
	updateStage: () => void;
	addJournalEntry: (entry: string) => void;
	setBGImage: (image: string) => void;
	setOptions: (options: StoryOptions) => void;
	setPortraitImage: (image: string, side?: 'left' | 'right') => Promise<void>;
	setPortraitName: (name: string, side?: 'left' | 'right') => Promise<void>;
	setPortrait: EntityOrDialogueFn;
	clearPortraitImage: EntityOrDialogueLookupFn;
	clearPortraitName: EntityOrDialogueLookupFn;
	clearPortrait: EntityOrDialogueLookupFn;
	clearPortraits: () => Promise<void>;
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
	const [currDialogue, setCurrDialogue] = createSignal<Dialogue | undefined>(
		undefined
	);
	const [currIdx, setCurrIdx] = createSignal(0);

	createEffect(() => (entityLUT.PL!.name = state.playerName));

	const prompt: ControllerFns['prompt'] = (prompt) => {
		if (!prompt) return;

		const err = promptParser(prompt);

		batch(() => {
			setState('history', (history) => [
				...history,
				{ name: '', text: prompt },
			]);
			if (err)
				setState('history', (history) => [
					...history,
					{ name: 'DM', text: err },
				]);
		});
	};

	const updateDialogue = (dialogue: Dialogue) => {
		setCurrDialogue(dialogue);
		batch(() => {
			setState('options', undefined);
			setState(
				'activeSpeaker',
				dialogue?.speaker || entityLUT[dialogue?.entity]!.speaker
			); //! change back to ?? after cleaning dialogue typings

			if (dialogue) setPortrait(dialogue);
		});
	};

	const updateIdx = (idx: number) => {
		setCurrIdx(idx);
		setState('dialogue', currDialogue()?.text[currIdx()] ?? '');
		if (currIdx() === (currDialogue()?.text.length ?? 0) - 1)
			currDialogue()?.onEnd?.(context);
	};

	let dialogueQueue: [EntityID, GetDialogue<EntityID>][] = [];
	const _runDialogue = async (
		speaker: EntityID,
		dialogue: GetDialogue<EntityID>,
		onNextClick = true
	) => {
		if (onNextClick) {
			dialogueQueue.push([speaker, dialogue]);
			return;
		}

		if (currDialogue()?.beforeNext) await currDialogue()?.beforeNext?.(context);

		const item = speakerLUT[speaker][dialogue]! as Dialogue;
		updateDialogue(item);
		updateIdx(0);

		item.onStart?.(context);
		updateStage();
	};
	const queueDialogue: ControllerFns['queueDialogue'] = (speaker, dialogue) =>
		_runDialogue(speaker, dialogue);
	const runDialogue: ControllerFns['runDialogue'] = (speaker, dialogue) =>
		_runDialogue(speaker, dialogue, false);
	const continueDialogue = () => {
		if (dialogueQueue.length > 0) {
			runDialogue(...dialogueQueue.shift()!);
			return;
		}

		if (state.options) return;
		updateIdx(currIdx() + 1);
	};

	const updateStage = () => {
		const dialogue = currDialogue();
		if (dialogue) {
			setBGImage(dialogue?.bgImage);
			setPortrait(dialogue);
		}
	};

	const toggleFlag = (flag: Flag, set?: boolean) =>
		setState(produce((state) => (state[flag] = set ?? !state[flag])));
	const setBGImage = (image?: string) =>
		setState('bgImage', (prev) => image || prev);
	const setOptions = (options: StoryOptions) => setState('options', options);
	const addJournalEntry = (entry: string) =>
		setState('journal', (journal) => [...journal, entry]);

	const setPortraitImage = async (image: string, side?: 'left' | 'right') => {
		if (!side) {
			if (!state.leftPortraitName) {
				await view.hide('left', 'image');
				setState('leftPortraitImage', image);
			} else {
				await view.hide('right', 'image');
				setState('rightPortraitImage', image);
			}
		} else {
			await view.hide(side, 'image');
			setState(`${side}PortraitImage`, image);
		}
	};

	const setPortraitName = async (name: string, side?: 'left' | 'right') => {
		if (!side) {
			if (!state.leftPortraitName) {
				await view.hide('left', 'name');
				setState('leftPortraitName', name);
			} else {
				await view.hide('right', 'name');
				setState('rightPortraitName', name);
			}
		} else {
			await view.hide(side, 'name');
			setState(`${side}PortraitName`, name);
		}
	};

	const setPortrait: ControllerFns['setPortrait'] = async (item) => {
		let portrait: string;
		let portraitName: string;
		//@ts-ignore -- if not, then it's a dialogue not an entity
		if (!item.id) {
			const entity = entityLUT[(item as Dialogue).entity]!;
			portrait = item?.portrait || entity.portrait;
			portraitName = (item as Dialogue)?.portraitName || entity.name;
		} else {
			portrait = item.portrait;
			portraitName = (item as Entity).name;
		}

		if (
			!portrait ||
			!portraitName ||
			state.leftPortraitName === portraitName ||
			state.rightPortraitName === portraitName ||
			portraitName === 'Dungeon Master'
		)
			return;

		if (!state.leftPortraitName) {
			batch(() => {
				setState('leftPortraitImage', portrait);
				setState('leftPortraitName', portraitName);
			});
		} else {
			if (state.rightPortraitName) await view.hide('right');

			batch(() => {
				setState('rightPortraitImage', portrait);
				setState('rightPortraitName', portraitName);
			});
		}
	};
	const clearPortraitImage: ControllerFns['clearPortraitImage'] = async (
		speaker,
		dialogue
	) => {
		let portraitName: string;
		if (!dialogue) portraitName = entityLUT[speaker]!.name;
		else portraitName = speakerLUT[speaker][dialogue]!.portraitName;

		if (!portraitName) return;

		if (state.leftPortraitName === portraitName) {
			await view.hide('left', 'image');

			setState('leftPortraitImage', '');
		} else if (state.rightPortraitName === portraitName) {
			await view.hide('right', 'image');

			setState('rightPortraitImage', '');
		}
	};
	const clearPortraitName: ControllerFns['clearPortraitName'] = async (
		speaker,
		dialogue
	) => {
		let portraitName: string;
		if (!dialogue) portraitName = entityLUT[speaker]!.name;
		else portraitName = speakerLUT[speaker][dialogue]!.portraitName;

		if (!portraitName) return;

		if (state.leftPortraitName === portraitName) {
			await view.hide('left', 'name');

			setState('leftPortraitName', '');
		} else if (state.rightPortraitName === portraitName) {
			await view.hide('right', 'name');

			setState('rightPortraitName', '');
		}
	};
	const clearPortrait: ControllerFns['clearPortrait'] = async (
		speaker,
		dialogue
	) => {
		let portraitName: string;
		if (!dialogue) portraitName = entityLUT[speaker]!.name;
		else portraitName = speakerLUT[speaker][dialogue]!.portraitName;

		if (!portraitName) return;

		if (state.leftPortraitName === portraitName) {
			await view.hide('left');

			batch(() => {
				setState('leftPortraitImage', '');
				setState('leftPortraitName', '');
			});
		} else if (state.rightPortraitName === portraitName) {
			await view.hide('right');

			batch(() => {
				setState('rightPortraitImage', '');
				setState('rightPortraitName', '');
			});
		}
	};
	const clearPortraits: ControllerFns['clearPortraits'] = async () => {
		await view.hide();

		batch(() => {
			setState('leftPortraitImage', '');
			setState('leftPortraitName', '');
			setState('rightPortraitImage', '');
			setState('rightPortraitName', '');
		});
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
		prompt,
		toggleFlag,
		runDialogue,
		queueDialogue,
		continueDialogue,
		updateStage: updateStage,
		addJournalEntry,
		setBGImage,
		setOptions,
		setPortraitImage,
		setPortraitName,
		setPortrait,
		clearPortraitImage,
		clearPortraitName,
		clearPortrait,
		clearPortraits,
		pushInventoryItem,
		consumeInventoryItem,
		useInventoryItem,
	};
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
