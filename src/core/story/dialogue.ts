// import DMDialogues from '../dialogues/DM';
// import miscPartyDialogues from '../dialogues/MP';
// import shinebrightDialogues from '../dialogues/SB';
// import gruzDialogues from '../dialogues/GZ';
// import { items } from '../items/item';
// import { useSession } from '../../contexts/SessionState';
// import { ControllerFns } from '../../contexts/Controller';

// export type DialogueDef = {
// 	text: string[];
// 	bgImage?: string;
// 	portrait?: string;
// 	portraitName?: string;
// 	speaker?: string;
// };

// export type DialogueItem = {
// 	// next?: DialogueItem;
// 	dialogue: DialogueDef;
// 	onStart: (callback: () => void) => void;
// 	onEnd: (callback: () => void) => void;
// 	beforeNext: (callback: () => void) => void;
// 	callOnStart: (fns: ControllerFns) => void;
// 	callOnEnd: (fns: ControllerFns) => void;
// 	callBeforeNext: (fns: ControllerFns) => void;
// };

// const toDialogue = (dialogue: DialogueDef): DialogueItem => {
// 	let next: DialogueItem | undefined = undefined;

// 	const _onStart: Array<() => void> = [];
// 	const _onEnd: Array<() => void> = [];
// 	const _beforeNext: Array<() => void> = [];
// 	const onStart = (callback: () => void) => _onStart.push(callback);
// 	const onEnd = (callback: () => void) => _onEnd.push(callback);
// 	const beforeNext = (callback: () => void) => _beforeNext.push(callback);

// 	const callOnStart = () => _onStart.forEach((callback) => callback());
// 	const callOnEnd = () => _onEnd.forEach((callback) => callback());
// 	const callBeforeNext = () => _beforeNext.forEach((callback) => callback());

// 	return {
// 		next,
// 		dialogue,
// 		onStart,
// 		onEnd,
// 		beforeNext,
// 		callOnStart,
// 		callOnEnd,
// 		callBeforeNext,
// 	};
// };

// const toDialogues = (dialogues: Record<string, DialogueDef>) => {
// 	const d: Record<string, DialogueItem> = {};
// 	const _ = Object.entries(dialogues);
// 	for (const [key, dialogue] of _) d[key] = toDialogue(dialogue);
// 	return d;
// };

// export const setupDialogues = (controller: any) => {
// 	const DM = toDialogues(DMDialogues);
// 	const MP = toDialogues(miscPartyDialogues);
// 	const SB = toDialogues(shinebrightDialogues);
// 	const GZ = toDialogues(gruzDialogues);

// 	const { state } = useSession()!;

// 	DM.intro.next = DM.sheepAppears;
// 	DM.sheepAppears.next = DM.sheepWavesScroll;

// 	SB.sheepSpeaksFirstTime.next = SB.sheepIntroducesSelf;
// 	SB.sheepIntroducesSelf.next = SB.sheepExplainsQuest;

// 	DM.gruzAppears.next = GZ.intro;

// 	controller.watch(
// 		'$store.state.SBExplainedQuest',
// 		(SBExplainedQuest: boolean) => {
// 			if (SBExplainedQuest) state.runDialogue(DM.gruzAppears);
// 		}
// 	);

// 	DM.sheepWavesScroll.onEnd(() => {
// 		state.toggleFlag('canGetSwA');
// 		state.setOptions({
// 			take: {
// 				scroll: () => {
// 					state.runDialogue(DM.playerTakesScroll);
// 				},
// 			},
// 		});
// 	});

// 	DM.playerTakesScroll.onStart(() => {
// 		state.toggleFlag('hasSwA', true);
// 		state.pushInventoryItem(items.scrollOfSPA);
// 		console.log(JSON.stringify(state.inventory));
// 	});
// 	DM.playerTakesScroll.onEnd(() => {
// 		state.runDialogue(MP.playerTakesScroll); // have random party member say it

// 		state.setOptions({
// 			examine: {
// 				scroll: () => {
// 					state.runDialogue(DM.playerExaminesScroll);
// 				},
// 			},
// 			explain: {
// 				scroll: () => {
// 					state.runDialogue(DM.playerExplainsScroll);
// 				},
// 			},
// 			use: {
// 				scroll: () => {
// 					state.runDialogue(DM.playerUsesScroll);
// 				},
// 			},
// 		});
// 	});

// 	MP.playerTakesScroll.beforeNext(() => {
// 		state.clearPortrait(MP.playerTakesScroll.dialogue.portrait);
// 	});

// 	DM.playerExaminesScroll.onEnd(() => {
// 		state.toggleFlag('hasExaminedScroll');
// 		state.setOptions({
// 			explain: {
// 				scroll: () => {
// 					state.runDialogue(DM.playerExplainsScroll);
// 				},
// 			},
// 			use: {
// 				scroll: () => {
// 					state.runDialogue(DM.playerUsesScroll);
// 				},
// 			},
// 		});
// 	});

// 	DM.playerExplainsScroll.onStart(() => {
// 		if (state.flag('hasExaminedScroll')) {
// 			state.toggleFlag('hasSaidScrollName');
// 			state.runDialogue(DM._explainScroll);
// 		} else {
// 			state.runDialogue(DM._cantExplainScroll);
// 		}
// 	});
// 	DM._explainScroll.onEnd(() => {
// 		state.runDialogue(SB.playerExplainsScroll);
// 	});
// 	SB.playerExplainsScroll.onEnd(() => {
// 		state.setOptions({
// 			use: {
// 				scroll: () => {
// 					state.runDialogue(DM.playerUsesScroll);
// 				},
// 			},
// 		});
// 	});
// 	DM._cantExplainScroll.onEnd(() => {
// 		state.setOptions({
// 			examine: {
// 				scroll: () => {
// 					state.runDialogue(DM.playerExaminesScroll);
// 				},
// 			},
// 			use: {
// 				scroll: () => {
// 					state.runDialogue(DM.playerUsesScroll);
// 				},
// 			},
// 		});
// 	});

// 	// SB.playerExplainsScroll.beforeNext(() => {
// 	// 	state.clearPortrait(SB.playerExplainsScroll.dialogue.portrait);
// 	// });

// 	DM.playerUsesScroll.onEnd(() => {
// 		state.toggleFlag('hasUsedScroll');
// 		state.toggleFlag('SwAIsActive');
// 		state.clearPortrait(DM.playerUsesScroll.dialogue.portrait);
// 		state.runDialogue(SB.sheepSpeaksFirstTime);
// 	});

// 	DM.playerUsesScroll.beforeNext(() => {
// 		// state.clearPortrait('player.png'); //? fix dis
// 		state.clearPortraits();
// 	});

// 	SB.sheepSpeaksFirstTime.beforeNext(() => {
// 		state.clearPortrait(SB.sheepSpeaksFirstTime.dialogue.portrait);
// 	});

// 	SB.sheepExplainsQuest.onEnd(() => {
// 		state.toggleFlag('SBExplainedQuest');
// 		state.runDialogue(DM.gruzAppears);
// 	});
// 	SB.sheepExplainsQuest.beforeNext(() => {
// 		state.clearPortrait(SB.sheepExplainsQuest.dialogue.portrait);
// 	});

// 	return DM.intro; // starting point
// };
