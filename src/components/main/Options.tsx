import { Component, For, createEffect, createSignal } from 'solid-js';
import { setState, state } from '../../contexts/SessionState';
import { useView } from '../../contexts/View';

type props = {};

const Options: Component<props> = () => {
	const [open, setOpen] = createSignal(false);
	const view = useView()!;

	createEffect(() => {
		view.setOptionsHeightTarget(
			(Object.keys(state.options ?? {}).length + 0.7) * 32
		);
		if (state.options && Object.keys(state.options).length > 0) setOpen(true);
	});

	const selectOption = (key: string) => {
		const caller = state.options![key];
		if (!caller) return;
		setOpen(false);
		setTimeout(() => {
			setState('options', undefined);
			caller();
		}, 1000);
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
				<div class='options'>
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
