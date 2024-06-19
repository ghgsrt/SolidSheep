import { ControllerFns } from '../../contexts/Controller';
import { OmitDefaults } from '../../types/utils';

export interface Item {
	id: ItemID;
	name: string;
	unknownName?: string;
	description: string;
	unknownDescription?: string;
	img: string;
	quantity: number;
	qName: string;
	examined?: boolean;
	onUse?: (fns: ControllerFns) => void;
	onExamine?: (fns: ControllerFns) => void;
}

export interface Weapon extends Item {
	damage: number;
	range: number;
	durability: number;
}

export interface Armor extends Item {
	defense: number;
	durability: number;
}

export const defaultItemProps = {
	unknownName: '',
	description: '',
	unknownDescription: '',
	img: '',
	quantity: 1,
	qName: 'quantity',
	examined: false,
	// onUse: undefined,
	// onExamine: undefined,
} as const satisfies Partial<Item>;

export const defaultWeaponProps = {
	damage: 0,
	range: 0,
	durability: 0,
} as const satisfies Partial<Weapon>;

export const defaultArmorProps = {
	defense: 0,
	durability: 0,
} as const satisfies Partial<Armor>;

export type ReqItemProps = OmitDefaults<Item, keyof typeof defaultItemProps>;
// export type ReqWeaponProps = Omit<Weapon, keyof typeof defaultWeaponProps> &
// 	Subset<Pick<Weapon, keyof typeof defaultWeaponProps>>;
// export type ReqArmorProps = Omit<Armor, keyof typeof defaultArmorProps> &
// 	Subset<Pick<Armor, keyof typeof defaultArmorProps>>;

const item = ['scrollOfSPA'] as const;
// const weapon = ['placeholder'] as const;
// const armor = ['placeholder'] as const;
export type ItemID = (typeof item)[number];
// export type WeaponID = (typeof weapon)[number];
// export type ArmorID = (typeof armor)[number];

export const items: Record<ItemID, ReqItemProps> = {
	scrollOfSPA: {
		name: 'Scroll of Speak with Animals',
		unknownName: 'Scroll',
		description: 'A scroll with a spell that allows you to speak with animals.',
		unknownDescription:
			'A strange, and still slightly moist, scroll that was given to you by an even stranger sheep.',
		img: 'scroll.jpg',
		quantity: 1,
		qName: 'uses',
		onUse: ({ consumeInventoryItem }) => {
			//? journal entry?
			//? active effect?
			//! yeah prolly activate effect then:
			consumeInventoryItem('scrollOfSPA');
		},
	},
};

// export const weapons: Record<WeaponID, ReqWeaponProps> = {
// 	placeholder: {},
// };
// export const armors: Record<ArmorID, ReqArmorProps> = {
// 	placeholder: {},
// };
