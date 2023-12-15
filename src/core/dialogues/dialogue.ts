import { ControllerFns } from '../../contexts/Controller';
import { EnsureFnParamTyping, OmitDefaults } from '../../types/utils';
import { EntityID } from '../entities/entity';
import { DMDialogueName } from './DM';
import { GZDialogueName } from './GZ';
import { MP1DialogueName } from './MP1';
import { PLDialogueName } from './PL';
import { SBDialogueName } from './SB';

export type Dialogue = {
	text: string[];
	bgImage: string;
	entity: EntityID;
	portrait: string;
	portraitName: string;
	speaker: string;
	onStart: (fns: ControllerFns) => void;
	onEnd: (fns: ControllerFns) => void;
	beforeNext: (fns: ControllerFns) => Promise<void>;
};

export const defaultDialogueProps = {
	bgImage: '',
	portrait: '',
	portraitName: '',
	speaker: '',
	onStart: () => {},
	onEnd: () => {},
	beforeNext: undefined,
} as const satisfies Partial<Dialogue>;

export type ReqDialogueProps = OmitDefaults<
	Dialogue,
	keyof typeof defaultDialogueProps
>;

//? validate and generate typings for the dialogue object
export const createDialogue = <D extends string, P extends Partial<Dialogue>>(
	defProps: P,
	dialogues: Record<
		D,
		//@ts-ignore -- it works 🤷🏻‍♂️
		EnsureFnParamTyping<OmitDefaults<ReqDialogueProps, keyof P>>
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
	? MP1DialogueName
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
