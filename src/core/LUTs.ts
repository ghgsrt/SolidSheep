import { factory } from './factory';
import { Dialogue, GetDialogue } from './dialogues/dialogue';
import { DMDialogueNames, DMDialogues } from './dialogues/DM';
import { GZDialogueNames, GZDialogues } from './dialogues/GZ';
import { SBDialogueNames, SBDialogues } from './dialogues/SB';
import { MP1DialogueNames, MP1Dialogues } from './dialogues/MP1';
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
import { MP2DialogueNames, MP2Dialogues } from './dialogues/MP2';

export const speakerLUT: Record<
	EntityID,
	Partial<Record<GetDialogue<EntityID>, Dialogue>>
> = {
	DM: {},
	PL: {},
	MP1: {},
	MP2: {},
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
for (const key of MP1DialogueNames)
	speakerLUT.MP1[key] = factory.MP1(MP1Dialogues[key]);
for (const key of MP2DialogueNames)
//@ts-ignore smh my h
	speakerLUT.MP2[key] = factory.MP2(MP2Dialogues[key]);
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
