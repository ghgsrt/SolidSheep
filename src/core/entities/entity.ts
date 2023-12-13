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

const entity = ['DM', 'PL', 'MP', 'SB', 'GZ'] as const;
export type EntityID = (typeof entity)[number];

export const entities: Record<EntityID, ReqEntityProps> = {
	DM: {
		id: 'DM',
		name: 'DM',
		speaker: 'DM',
	},
	PL: {
		id: 'PL',
		name: 'Player',
		portrait: 'player.png',
		speaker: 'Player',
	},
	GZ: {
		id: 'GZ',
		name: 'Gruz',
		portrait: 'gruz.png',
		speaker: 'Gruz',
	},
	SB: {
		id: 'SB',
		name: 'Finethir Shinebright',
		portrait: 'sheep.png',
		speaker: 'Finethir Shinebright',
	},
	MP: {
		id: 'MP',
		name: 'Party Member',
		portrait: 'mage_party.png',
		speaker: 'Party Member',
	},
};
