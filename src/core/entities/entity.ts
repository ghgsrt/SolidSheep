import { Subset } from '../../types/utils';

export type Entity = {
	id: string;
	name: string;
	portrait: string;
	speaker: string;
};

export const defaultEntityProps = {
	portrait: '',
} as const satisfies Partial<Entity>;

export type ReqEntityProps = Omit<Entity, keyof typeof defaultEntityProps> &
	Subset<Pick<Entity, keyof typeof defaultEntityProps>>;

const entity = ['DM', 'PL', 'MP1', 'MP2', 'SB', 'GZ'] as const;
export type EntityID = (typeof entity)[number];

export const entities: Record<EntityID, ReqEntityProps> = {
	DM: {
		id: 'DM',
		name: 'DM',
		speaker: 'DM',
	},
	PL: {
		id: 'PL',
		name: '',
		portrait: '',
		speaker: 'PL',
	},
	GZ: {
		id: 'GZ',
		name: 'Guz',
		portrait: 'guz.png',
		speaker: 'Guz',
	},
	SB: {
		id: 'SB',
		name: 'Finethir Shinebright',
		portrait: 'sheep.png',
		speaker: 'SB',
	},
	MP1: {
		id: 'MP1',
		name: '',
		portrait: '',
		speaker: '',
	},
	MP2: {
		id: 'MP2',
		name: '',
		portrait: '',
		speaker: '',
	},
};
