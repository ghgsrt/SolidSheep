// import { state } from '../contexts/SessionState';
// import { descendingLen } from '../utils/utils';

// const V: Record<string, string[]> = {
// 	take: ['get', 'grab', 'pick up', 'pick'],
// 	examine: ['look at', 'look over', 'look in', 'look on', 'search', 'open'],
// 	use: ['activate'],
// 	explain: ['tell', 'describe', 'say', 'tell'],
// };

// const O: Record<string, string[]> = {
// 	scroll: ['paper', 'parchment', 'speak with animals'],
// 	sheep: ['finethir', 'shinebright', 'finethir shinebright'],
// 	compound: [],
// 	outhouse: ['toilet', 'bathroom'],
// 	bear: [],
// 	apes: [],
// 	wyrm: [],
// };

// // preprocess
// (() => {
// 	const v = Object.keys(V);
// 	for (const name of v) V[name].sort(descendingLen);

// 	const o = Object.keys(O);
// 	for (const name of o) O[name].sort(descendingLen);
// })();

// export default (text: string) => {
// 	// normalize
// 	text = text.toLowerCase();

// 	const verbs = Object.keys(V).filter(
// 		(v) => text.includes(v) || V[v].find((s) => text.includes(s))
// 	);
// 	if (verbs.length === 0 || !state.options![verbs[0]])
// 		return verbs[0]
// 			? `<em>There is nothing to ${verbs[0]}...</em>`
// 			: `<em>Action not recognized...</em>`;
// 	if (verbs.length > 1)
// 		return `<em>Which action are you attempting? (${verbs.join(', ')})</em>`;

// 	const nouns = Object.keys(O).filter(
// 		(o) => text.includes(o) || O[o].find((s) => text.includes(s))
// 	);
// 	if (nouns.length === 0 || !state.options![verbs[0]]![nouns[0]])
// 		return nouns[0]
// 			? `<em>You can't ${verbs[0]} the ${nouns[0]}...</em>`
// 			: `<em>Object not recognized...</em>`;
// 	if (nouns.length > 1)
// 		return `<em>Which object are you targeting? (${nouns.join(', ')})</em>`;

// 	state.options![verbs[0]][nouns[0]]();
// };
