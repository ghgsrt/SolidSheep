import { deepCopy, deepMerge } from '../utils/utils';
import { DMDefaultProps } from './dialogues/DM';
import { GZDefaultProps } from './dialogues/GZ';
import { MP1DefaultProps } from './dialogues/MP1';
import { MP2DefaultProps } from './dialogues/MP2';
import { PLDefaultProps } from './dialogues/PL';
import { SBDefaultProps } from './dialogues/SB';
import { Dialogue, defaultDialogueProps } from './dialogues/dialogue';
import { Entity, defaultEntityProps } from './entities/entity';
import {
	Armor,
	Item,
	Weapon,
	defaultArmorProps,
	defaultItemProps,
	defaultWeaponProps,
} from './items/item';

export const create = <T, D = Partial<T>, N = Partial<T>>(
	defaultProps?: D,
	narrowProps?: N
) => {
	const fns: Record<string, any> = {};

	for (const key in defaultProps)
		if (typeof defaultProps[key] === 'function') fns[key] = defaultProps[key];

	return (props: Omit<T, keyof D>) => {
		return {
			...fns,
			...deepMerge(
				deepMerge(deepCopy(defaultProps ?? {}), deepCopy(narrowProps ?? {})),
				props
			),
		} as T;
	};
};

export const factory = {
	DM: create<Dialogue>(defaultDialogueProps, DMDefaultProps),
	PL: create<Dialogue>(defaultDialogueProps, PLDefaultProps),
	MP1: create<Dialogue>(defaultDialogueProps, MP1DefaultProps),
	MP2: create<Dialogue>(defaultDialogueProps, MP2DefaultProps),
	SB: create<Dialogue>(defaultDialogueProps, SBDefaultProps),
	GZ: create<Dialogue>(defaultDialogueProps, GZDefaultProps),
	Entity: create<Entity>(defaultEntityProps),
	Item: create<Item>(defaultItemProps),
	Weapon: create<Weapon>(defaultItemProps, defaultWeaponProps),
	Armor: create<Armor>(defaultItemProps, defaultArmorProps),
};
