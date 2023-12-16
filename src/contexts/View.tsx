import {
	createContext,
	useContext,
	JSX,
	Component,
	createSignal,
	Setter,
	Accessor,
	onMount,
	batch,
} from 'solid-js';
import useEventListener from '../hooks/useEventListener';
import { sleep } from '../utils/utils';

export type View = 'intro' | 'character-create' | 'main' | 'outro';
export type DockView = 'prompt' | 'combat' | 'journal' | 'notebook';

type Props = {
	children: JSX.Element | JSX.Element[];
};

export type ViewValues = {
	currView: Accessor<View>;
	setCurrView: Setter<View>;
	pending: Accessor<boolean>;
	updateView: (
		view: View,
		options?: {
			preSleepMS?: number;
			sleepMS?: number;
			broadcastPending?: boolean;
		}
	) => void;
	dockView: Accessor<DockView>;
	setDockView: Setter<DockView>;
	optionsHeightTarget: Accessor<number>;
	setOptionsHeightTarget: Setter<number>;
	showOptions: Accessor<boolean>;
	setShowOptions: Setter<boolean>;
	hideLeftImage: Accessor<boolean>;
	setHideLeftImage: Setter<boolean>;
	hideRightImage: Accessor<boolean>;
	setHideRightImage: Setter<boolean>;
	hideLeftName: Accessor<boolean>;
	setHideLeftName: Setter<boolean>;
	hideRightName: Accessor<boolean>;
	setHideRightName: Setter<boolean>;
	isSpecial: Accessor<boolean>;
	leftTabKey: Accessor<string>;
	setLeftTabKey: Setter<string>;
	rightTabKey: Accessor<string>;
	setRightTabKey: Setter<string>;
	leftTabKeys: string[];
	rightTabKeys: string[];
	runOnResize: (...fns: (() => void)[]) => void;
	hide: (side?: 'left' | 'right', spec?: 'image' | 'name') => Promise<void>;
};

const ViewContext = createContext<ViewValues>();

const ViewProvider: Component<Props> = (props) => {
	const [currView, setCurrView] = createSignal<View>('intro');
	const [pending, setPending] = createSignal(false);
	const updateView = async (
		view: View,
		options?: {
			preSleepMS?: number;
			sleepMS?: number;
			broadcastPending?: boolean;
		}
	) => {
		if (options?.preSleepMS) await sleep(options.preSleepMS);
		if (options?.broadcastPending ?? true) setPending(true);
		else document.querySelector('main')!.classList.add('pending');
		await sleep(options?.sleepMS ?? 2000);
		setCurrView(view);
		if (options?.broadcastPending ?? true) setPending(false);
		else document.querySelector('main')!.classList.remove('pending');
	};

	const [dockView, setDockView] = createSignal<DockView>('prompt');
	const [optionsHeightTarget, setOptionsHeightTarget] = createSignal(0);
	const [showOptions, setShowOptions] = createSignal(false);

	const [hideLeftImage, setHideLeftImage] = createSignal(false);
	const [hideRightImage, setHideRightImage] = createSignal(false);
	const [hideLeftName, setHideLeftName] = createSignal(false);
	const [hideRightName, setHideRightName] = createSignal(false);
	const [isSpecial, setIsSpecial] = createSignal(false);
	const [leftTabKey, setLeftTabKey] = createSignal('prompt');
	const [rightTabKey, setRightTabKey] = createSignal('journal');
	const leftTabKeys = ['prompt', 'combat'];
	const rightTabKeys = ['journal', 'notebook'];

	const sleepMS = 500;

	async function hide(side?: 'left' | 'right', spec?: 'image' | 'name') {
		const hideImage = !spec || spec === 'image';
		const hideName = !spec || spec === 'name';

		batch(() => {
			if (!side || side === 'left') {
				if (hideImage) setHideLeftImage(true);
				if (hideName) setHideLeftName(true);
			}
			if (!side || side === 'right') {
				if (hideImage) setHideRightImage(true);
				if (hideName) setHideRightName(true);
			}
		});

		await sleep(sleepMS);

		batch(() => {
			setHideLeftImage(false);
			setHideLeftName(false);
			setHideRightImage(false);
			setHideRightName(false);
		});
	}

	const _runOnResize: (() => void)[] = [];
	const runOnResize: ViewValues['runOnResize'] = (...fns) =>
		_runOnResize.push(...fns);

	const onResize = () => {
		for (const fn of _runOnResize) fn();
	};

	useEventListener('resize', onResize);

	onMount(() => {
		const main = document.querySelector('main')!;

		runOnResize(() =>
			setIsSpecial(
				main.clientWidth ===
					Math.round(parseFloat(window.getComputedStyle(main).maxWidth))
			)
		);

		setTimeout(onResize, 0);
	});

	const context: ViewValues = {
		pending,
		updateView,
		currView,
		setCurrView,
		dockView,
		setDockView,
		optionsHeightTarget,
		setOptionsHeightTarget,
		showOptions,
		setShowOptions,
		hideLeftImage,
		setHideLeftImage,
		hideRightImage,
		setHideRightImage,
		hideLeftName,
		setHideLeftName,
		hideRightName,
		setHideRightName,
		isSpecial,
		leftTabKey,
		setLeftTabKey,
		rightTabKey,
		setRightTabKey,
		leftTabKeys,
		rightTabKeys,
		runOnResize,
		hide,
	};
	return (
		<ViewContext.Provider value={context}>
			{props.children}
		</ViewContext.Provider>
	);
};

export default ViewProvider;

export function useView() {
	return useContext(ViewContext);
}
