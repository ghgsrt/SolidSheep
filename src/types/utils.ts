export type FilterKeysByValueType<T, V> = {
	[K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

export type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never;

export type TailParameters<T extends (...args: any[]) => any> = (
	...args: Tail<Parameters<T>>
) => ReturnType<T>;

export type ExtraParameters<
	T extends (...args: any[]) => any,
	E extends any[]
> = (...args: [...Parameters<T>, ...E]) => ReturnType<T>;

export type Subset<K> = {
	[attr in keyof K]?: K[attr] extends (args: any) => any
		? K[attr]
		: K[attr] extends object
		? Subset<K[attr]>
		: K[attr] extends object | null
		? Subset<K[attr]> | null
		: K[attr] extends object | null | undefined
		? Subset<K[attr]> | null | undefined
		: K[attr];
};

export type OmitDefaults<T, D extends keyof T> = Omit<T, D> &
	Subset<Pick<T, D>>;

export type EnsureFnParamTyping<T> = {
	[P in keyof T]: T[P] extends (...args: any[]) => any
		? (...args: Parameters<T[P]>) => ReturnType<T[P]>
		: T[P];
};
