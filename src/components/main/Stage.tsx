import { Component, createEffect, createSignal, onMount } from 'solid-js';
import Middle from './Middle';
import Side from './Side';
import { useView } from '../../contexts/View';
import { state } from '../../contexts/SessionState';
import { sleep } from '../../utils/utils';

type props = {};

let backdrop: HTMLDivElement;
const Stage: Component<props> = () => {
	const view = useView()!;
	const [show, setShow] = createSignal(false);

	createEffect(async () => {
		const _show = view.currView() === 'main' && !view.pending();
		if (!_show) return;

		await sleep(200);
		setShow(_show);
	});

	onMount(() => {
		const inv = document.querySelector<HTMLElement>('.inventory');
		const initHeight = backdrop.style.height;

		const resize = () =>
			// defer after inventory resizes
			setTimeout(() => {
				backdrop.style.height = initHeight;
				backdrop.style.height = `${
					backdrop.clientHeight - inv!.clientHeight
				}px`;
			}, 0);

		resize();
		view.runOnResize(resize);
	});

	return (
		<>
			<div class='stage'>
				<div
					ref={backdrop}
					class={`backdrop ${view.isSpecial() && 'special'} ${
						show() ? 'show' : ''
					}`}
					style={{
						'background': `url(/backgrounds/${state.bgImage}) center center / cover no-repeat`,
					}}
				></div>
				<Side left />
				<Middle />
				<Side right />
			</div>
		</>
	);
};

export default Stage;
