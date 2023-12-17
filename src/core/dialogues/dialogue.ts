import { ControllerFns } from '../../contexts/Controller';
import { Entity, EntityID } from './entities/entity';
import { DMDialogueName } from './DM';
import { GZDialogueName } from './GZ';
import { MP1DialogueName } from './MP1';
import { PLDialogueName } from './PL';
import { SBDialogueName } from './SB';
import { MP2DialogueName } from './MP2';
import { createValidator } from '../../utils/utils';

export type Dialogue<E extends EntityID = EntityID> = {
	id: GetDialogue<E>;
	text: string[];
	bgImage: string;
	entity: E;
	portraitImage: string;
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

//? validate and generate typings for the dialogue object
export const createDialogue = <
	P extends Partial<Dialogue<E>> & { entity: EntityID },
	E extends EntityID = P['entity']
>(
	defProps: P
) => {
	return createValidator<
		Dialogue<E>,
		keyof typeof defaultDialogueProps | keyof Entity,
		GetDialogue<E>
	>()(defProps);
};

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
