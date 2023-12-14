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

export type View = 'main' | 'intro' | 'outro';

type Props = {
	children: JSX.Element | JSX.Element[];
};

export type ViewValues = {
	currView: Accessor<View>;
	setCurrView: Setter<View>;
	pending: Accessor<boolean>;
	updateView: (view: View) => void;
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

	const updateView = async (view: View) => {
		setPending(true);
		await sleep(2000);
		setCurrView(view);
		setPending(false);
	};

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
		if (!side) {
			batch(() => {
				setHideLeftImage(true);
				setHideLeftName(true);
				setHideRightImage(true);
				setHideRightName(true);
			});

			await sleep(sleepMS);

			batch(() => {
				setHideLeftImage(false);
				setHideLeftName(false);
				setHideRightImage(false);
				setHideRightName(false);
			});
		} else if (side === 'left') {
			if (!spec) {
				batch(() => {
					setHideLeftImage(true);
					setHideLeftName(true);
				});
			} else if (spec === 'image') setHideLeftImage(true);
			else setHideLeftName(true);

			await sleep(sleepMS);

			batch(() => {
				setHideLeftImage(false);
				setHideLeftName(false);
			});
		} else {
			if (!spec) {
				batch(() => {
					setHideRightImage(true);
					setHideRightName(true);
				});
			} else if (spec === 'image') setHideRightImage(true);
			else setHideRightName(true);

			await sleep(sleepMS);

			batch(() => {
				setHideRightImage(false);
				setHideRightName(false);
			});
		}
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
