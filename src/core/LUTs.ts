import { factory } from './factory';
import { Dialogue, GetDialogue, Speaker } from './dialogues/dialogue';
import { DMDialogue, DMDialogues } from './dialogues/DM';
import { GZDialogue, GZDialogues } from './dialogues/GZ';
import { SBDialogue, SBDialogues } from './dialogues/SB';
import { MPDialogue, MPDialogues } from './dialogues/MP';
import { PLDialogue, PLDialogues } from './dialogues/PL';
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
	Speaker,
	Partial<Record<GetDialogue<Speaker>, Dialogue>>
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

for (const key in DMDialogues)
	speakerLUT.DM[key as DMDialogue] = factory.DM(DMDialogues[key as DMDialogue]);
for (const key in PLDialogues)
	speakerLUT.PL[key as PLDialogue] = factory.PL(PLDialogues[key as PLDialogue]);
for (const key in MPDialogues)
	speakerLUT.MP[key as MPDialogue] = factory.MP(MPDialogues[key as MPDialogue]);
for (const key in SBDialogues)
	speakerLUT.SB[key as SBDialogue] = factory.SB(SBDialogues[key as SBDialogue]);
for (const key in GZDialogues)
	speakerLUT.GZ[key as GZDialogue] = factory.GZ(GZDialogues[key as GZDialogue]);

for (const key in entities)
	entityLUT[key as EntityID] = factory.Entity(entities[key as EntityID]);

for (const key in items)
	itemLUT[key as ItemID] = factory.Item(items[key as ItemID]);
// for (const key in weapons)
// 	weaponLUT[key as WeaponID] = factory.Weapon(weapons[key as WeaponID]);
// for (const key in armors)
// 	armorLUT[key as ArmorID] = factory.Armor(armors[key as ArmorID]);
