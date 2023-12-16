export const deepCopy = (obj: Record<string, any>) =>
	JSON.parse(JSON.stringify(obj));

//! UNTESTED
export const safeDeepCopy = <T extends Record<string, any>>(
	obj: T,
	hash = new WeakMap()
): T | Date | RegExp => {
	// Do not try to clone non-object values or functions
	if (Object(obj) !== obj || obj instanceof Function) return obj;

	// Handle dates and regular expressions
	if (obj instanceof Date) return new Date(obj);
	if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);

	// Handle circular references
	if (hash.has(obj)) return hash.get(obj);

	const result =
		obj instanceof Array
			? []
			: obj.constructor
			? new (obj.constructor as { new (): any })()
			: Object.create(null);

	hash.set(obj, result);

	if (obj instanceof Map)
		Array.from(obj, ([key, val]) => result.set(key, safeDeepCopy(val, hash)));

	return Object.assign(
		result,
		...Object.keys(obj).map((key) => ({ [key]: safeDeepCopy(obj[key], hash) }))
	);
};

export const deepMerge = <T extends Record<string, any>>(
	target: T,
	source: Partial<T>
) => {
	if (!target) return source;
	for (let key in source) {
		// if (source[key] === undefined) continue;

		if ((source[key] as any) instanceof Object) {
			// target[key] ??= {};

			//@ts-ignore -- typescript sucks balls
			target[key] = deepMerge(target[key], source[key]!);
		} else if (!((source[key] as any) instanceof Function))
			target[key] = source[key]!;
	}

	return target;
};

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const formatLabel = (label: string) =>
	label.charAt(0).toUpperCase() + label.slice(1);

export const descendingLen = <T extends { length: number }>(a: T, b: T) =>
	b.length - a.length;

export const getRandomElement = <T>(arr: T[]) =>
	arr[Math.floor(Math.random() * arr.length)];

const imgs: HTMLImageElement[] = [];
export function preloadImages(urls: string[]) {
	for (const url of urls) {
		const img = new Image();
		img.src = url;
		imgs.push(img);
	}
}
