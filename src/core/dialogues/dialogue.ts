import { ControllerFns } from '../../contexts/Controller';
import { EnsureFnParamTyping, OmitDefaults } from '../../types/utils';
import { Entity, EntityID } from './entities/entity';
import { DMDialogueName } from './DM';
import { GZDialogueName } from './GZ';
import { MP1DialogueName } from './MP1';
import { PLDialogueName } from './PL';
import { SBDialogueName } from './SB';
import { MP2DialogueName } from './MP2';

export type Dialogue<E extends EntityID = EntityID> = {
	id: GetDialogue<E>;
	text: string[];
	bgImage: string;
	entity: E;
	portrait: string;
	portraitName: string;
	speaker?: EntityID;
	onStart: (fns: ControllerFns) => Promise<void> | void;
	onEnd: (fns: ControllerFns) => Promise<void> | void;
	beforeNext: (fns: ControllerFns) => Promise<void> | void;
};

export const defaultDialogueProps = {
	bgImage: '',
	onStart: undefined,
	onEnd: undefined,
	beforeNext: undefined,
} as const satisfies Partial<Dialogue<any>>;

export type ReqDialogueProps<E extends EntityID> = OmitDefaults<
	Dialogue<E>,
	keyof typeof defaultDialogueProps | keyof Entity
>;

//? validate and generate typings for the dialogue object
export const createDialogue = <
	E extends EntityID,
	P extends Partial<Dialogue<E>>
>(
	defProps:
		| {
				entity: E;
		  }
		| P,
	dialogues: Record<
		GetDialogue<E>,
		//@ts-ignore -- it works 🤷🏻‍♂️
		EnsureFnParamTyping<OmitDefaults<ReqDialogueProps<E>, keyof P>>
	>
) => {
	return [defProps, dialogues] as const;
};

// const speaker = ['DM', 'PL', 'MP', 'SB', 'GZ'] as const;
// export type Speaker = (typeof speaker)[number];
export type GetDialogue<T extends EntityID> = T extends 'DM'
	? DMDialogueName
	: T extends 'PL'
	? PLDialogueName
	: T extends 'MP1'
	? MP1DialogueName
	: T extends 'MP2'
	? MP2DialogueName
	: T extends 'SB'
	? SBDialogueName
	: T extends 'GZ'
	? GZDialogueName
	: never;

// ? keyof typeof DMDialogues
// : T extends 'PL'
// ? keyof typeof PLDialogues
// : T extends 'MP'
// ? keyof typeof MPDialogues
// : T extends 'SB'
// ? keyof typeof SBDialogues
// : T extends 'GZ'
// ? keyof typeof GZDialogues
// : never;
