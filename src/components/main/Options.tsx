import { Component, For, createEffect, createSignal } from 'solid-js';
import { state } from '../../contexts/SessionState';
import { useView } from '../../contexts/View';

type props = {};

const Options: Component<props> = () => {
	const [open, setOpen] = createSignal(false);
	const view = useView()!;

	createEffect(() => {
		view.setOptionsHeightTarget(
			(Object.keys(state.options ?? {}).length + 0.7) * 32
		);
		if (state.options) setOpen(true);
	});

	const selectOption = (key: string) => {
		setOpen(false);
		setTimeout(() => {
			state.options![key]();
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
							<div class='option' onClick={() => selectOption(key)}>
								{key}
							</div>
						)}
					</For>
				</div>
			</div>
		</>
	);
};

export default Options;
