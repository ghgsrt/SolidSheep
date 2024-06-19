import { State, StoryOptions, state } from '../../contexts/SessionState';
import { Async, ExtendFirstParam } from '../../types/utils';
import { EntityID } from '../entities/entity';
import { Dialogue, GetDialogue } from './dialogue';

type DialogueLookupFn<R = void> = <
	T extends EntityID,
	N extends GetDialogue<T>
>(
	speaker: T,
	dialogue: N,
	_?: undefined
) => R;

export type DialogueFns = {
	queueDialogue: DialogueLookupFn;
	runDialogue: DialogueLookupFn;
	continueDialogue: () => void;
	hasRan:
		| DialogueLookupFn<boolean> &
				(<T extends EntityID, N extends GetDialogue<T>>(
					speaker: T,
					dialogues: N[],
					options?: { atLeast?: number; atMost?: number }
				) => { [K in N]: boolean } & { result: boolean });
	setOptions: (options?: StoryOptions) => void;
	// setDialogue: State['setDialogue'];
	clearPortrait: Async<ExtendFirstParam<State['clearPortrait'], EntityID>>;
	clearPortraits: Async<State['clearPortraits']>;
};

export function useDialogues(): DialogueFns {
	return {
		queueDialogue: (speaker, dialogue) => {},
		runDialogue: () => {},
		continueDialogue: () => {},
		hasRan: (_speaker, dialogue, options) => {
			if (!Array.isArray(dialogue)) return state.ranDialogues.has(dialogue);

			const ran = dialogue.reduce(
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
			if (options?.atMost)
				return { result: ran.times <= options.atMost, ...ran };
			return { result: ran.times === dialogue.length, ...ran };
		},
		setOptions: () => {},
		clearPortrait: () => {},
		clearPortraits: () => {},
	};
}

export const dialogueController = useDialogues();

export function useSequence(start: Dialogue) {

}