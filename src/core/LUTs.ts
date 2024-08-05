import { factory } from './factory';
import { DMDialogues } from './dialogues/DM';
import { GZDialogues } from './dialogues/GZ';
import { SBDialogues } from './dialogues/SB';
import { MP1Dialogues } from './dialogues/MP1';
import { MP2Dialogues } from './dialogues/MP2';
import { PLDialogues } from './dialogues/PL';
import { entities } from './dialogues/entities/entity';
import { items } from './items/item';

const generateLUT = <
	F extends keyof typeof factory,
	S extends Record<string, any>,
	R extends ReturnType<(typeof factory)[F]>
>(
	fn: F,
	source: S
) => {
	const keys = Object.keys(source) as (keyof S)[];
	const temp: Partial<Record<keyof S, R>> = {};
	for (const key of keys)
		temp[key] = factory[fn](key as string, source[key]) as R;
	return temp as Record<keyof S, R>;
};

export const speakerLUT = {
	DM: generateLUT('DM', DMDialogues),
	PL: generateLUT('PL', PLDialogues),
	MP1: generateLUT('MP1', MP1Dialogues),
	MP2: generateLUT('MP2', MP2Dialogues),
	SB: generateLUT('SB', SBDialogues),
	GZ: generateLUT('GZ', GZDialogues),
};
export const entityLUT = generateLUT('Entity', entities);
export const itemLUT = generateLUT('Item', items);
