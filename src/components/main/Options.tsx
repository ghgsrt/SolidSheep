import {
	Component,
	For,
	createEffect,
	createSignal,
	onCleanup,
} from 'solid-js';
import { setState, state } from '../../contexts/SessionState';
import { useView } from '../../contexts/View';

type props = {};

const optionsContainerTopOffset = -1.55 * 16 + 0.7 * 16;
let optionsContainer: HTMLDivElement;
const Options: Component<props> = () => {
	const [open, setOpen] = createSignal(false);
	const view = useView()!;

	const resize = () => {
		// console.log(parseInt(window.getComputedStyle(optionsContainer).height));
		view.setOptionsHeightTarget(
			parseInt(window.getComputedStyle(optionsContainer).height) +
				optionsContainerTopOffset ?? 0
			// (Object.keys(state.options ?? {}).length) * 2.5
		);
		if (state.options && Object.keys(state.options).length > 0) setOpen(true);
	};
	createEffect(resize);
	view.runOnResize(true, resize);

	const selectOption = (key: string) => {
		const caller = state.options![key];
		if (!caller) return;
		setOpen(false);
		setTimeout(() => {
			setState('options', undefined);
			caller();
		}, 750);
	};

	return (
		<>
			<div class='options-container'>
				<div
					class='options-cover'
					classList={{
						open: open(),
					}}
				/>
				<div ref={optionsContainer} class='options'>
					<For each={Object.keys(state.options ?? {})}>
						{(key) => (
							<div
								class='option'
								onClick={() => selectOption(key)}
								innerHTML={key}
							></div>
						)}
					</For>
				</div>
			</div>
		</>
	);
};

export default Options;
