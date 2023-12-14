import { factory } from './factory';
import { Dialogue, GetDialogue } from './dialogues/dialogue';
import { DMDialogueNames, DMDialogues } from './dialogues/DM';
import { GZDialogueNames, GZDialogues } from './dialogues/GZ';
import { SBDialogueNames, SBDialogues } from './dialogues/SB';
import { MPDialogueNames, MPDialogues } from './dialogues/MP';
import { PLDialogueNames, PLDialogues } from './dialogues/PL';
import { Entity, EntityID, entities } from './entities/entity';
import {
	// ArmorID,
	ItemID,
	// WeaponID,
	// armors,
	items,
	// weapons,
} from './items/item';

export const speakerLUT: Record<
	EntityID,
	Partial<Record<GetDialogue<EntityID>, Dialogue>>
> = {
	DM: {},
	PL: {},
	MP: {},
	SB: {},
	GZ: {},
};
export const entityLUT: Partial<Record<EntityID, Entity>> = {};
export const itemLUT: Partial<Record<ItemID, any>> = {};
// export const weaponLUT: Partial<Record<WeaponID, any>> = {};
// export const armorLUT: Partial<Record<ArmorID, any>> = {};

for (const key of DMDialogueNames)
	speakerLUT.DM[key] = factory.DM(DMDialogues[key]);
for (const key of PLDialogueNames)
	speakerLUT.PL[key] = factory.PL(PLDialogues[key]);
for (const key of MPDialogueNames)
	speakerLUT.MP[key] = factory.MP(MPDialogues[key]);
for (const key of SBDialogueNames)
	speakerLUT.SB[key] = factory.SB(SBDialogues[key]);
for (const key of GZDialogueNames)
	speakerLUT.GZ[key] = factory.GZ(GZDialogues[key]);

for (const key in entities)
	entityLUT[key as EntityID] = factory.Entity(entities[key as EntityID]);

for (const key in items)
	itemLUT[key as ItemID] = factory.Item(items[key as ItemID]);
// for (const key in weapons)
// 	weaponLUT[key as WeaponID] = factory.Weapon(weapons[key as WeaponID]);
// for (const key in armors)
// 	armorLUT[key as ArmorID] = factory.Armor(armors[key as ArmorID]);
