import { OmitDefaults } from '../../../types/utils';

export type Entity = {
	id: EntityID;
	portraitName: string;
	portrait: string;
};

export const defaultEntityProps = {
	portraitName: '',
	portrait: '',
} as const satisfies Partial<Entity>;

export type ReqEntityProps = OmitDefaults<
	Entity,
	keyof typeof defaultEntityProps
>;

const entity = ['DM', 'PL', 'MP1', 'MP2', 'SB', 'GZ'] as const;
export type EntityID = (typeof entity)[number];

export const entities: Record<EntityID, ReqEntityProps> = {
	DM: {
		portraitName: 'DM',
	},
	PL: {},
	GZ: {
		portraitName: 'Guz',
		portrait: 'guz.png',
	},
	SB: {
		portraitName: 'Finethir Shinebright',
		portrait: 'sheep.png',
	},
	MP1: {},
	MP2: {},
} as const;

export const maleMPNAmes = [
	'Thorin Ironshield',
	'Garrick Stormblade',
	'Aldric the Brave',
	'Roland Darkhammer',
	'Ulric Wolfheart',
	'Brennan Steelhand',
	'Kael the Stalwart',
	'Geralt Silverblade',
	'Ewan Blackforge',
	'Darius Lionmane',
];
export const femaleMPNames = [
	'Liliana Starweaver',
	'Seraphina Moonwhisper',
	'Elara Sunflare',
	'Thalia Frostveil',
	'Isolde the Enchantress',
	'Vexa Spellshadow',
	'Iris Darkbloom',
	'Mira Stormweaver',
	'Luna Nightbinder',
	'Eris Flameheart',
];
export const amoMPNames = [
	'Raven Darkstride',
	'Sable Quickfoot',
	'Rain Sablecloak',
	'Ash the Silent',
	'Quinn Steelwhisper',
	'Taylor Swiftfoot',
	'Wren Ironmask',
	'Robin of Hood',
	'Rowan the Red',
	'Arvel the Swift',
];
