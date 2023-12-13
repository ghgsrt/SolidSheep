import { ControllerFns } from '../../contexts/Controller';
import { Subset } from '../../types/utils';
import { EntityID } from '../entities/entity';
import { DMDialogue } from './DM';
import { GZDialogue } from './GZ';
import { MPDialogue } from './MP';
import { PLDialogue } from './PL';
import { SBDialogue } from './SB';

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
	entity: 'DM',
	portrait: '',
	portraitName: '',
	speaker: '',
	onStart: () => {},
	onEnd: () => {},
	beforeNext: undefined,
} as const satisfies Partial<Dialogue>;

export type ReqDialogueProps = Omit<
	Dialogue,
	keyof typeof defaultDialogueProps
> &
	Subset<Pick<Dialogue, keyof typeof defaultDialogueProps>>;

const speaker = ['DM', 'PL', 'MP', 'SB', 'GZ'] as const;
export type Speaker = (typeof speaker)[number];
export type GetDialogue<T extends Speaker> = T extends 'DM'
	? DMDialogue
	: T extends 'PL'
	? PLDialogue
	: T extends 'MP'
	? MPDialogue
	: T extends 'SB'
	? SBDialogue
	: T extends 'GZ'
	? GZDialogue
	: never;
