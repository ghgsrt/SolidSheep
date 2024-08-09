import { Component, createEffect, createSignal, onMount } from 'solid-js';
import Middle from './Middle';
import Side from './Side';
import { useView } from '../../contexts/View';
import { state } from '../../contexts/SessionState';
import { sleep } from '../../utils/utils';

type props = {};

let backdrop: HTMLDivElement;
let backdropQueue: HTMLDivElement;
const Stage: Component<props> = () => {
	const view = useView()!;
	const [bgImage, setBgImage] = createSignal();
	const [bgImageQueue, setBgImageQueue] = createSignal();
	const [show, setShow] = createSignal(false);
	const [showQueue, setShowQueue] = createSignal(false);

	createEffect(async () => {
		const _show = view.currView() === 'main' && !view.pending();
		if (!_show) return;

		await sleep(200);
		setShow(_show);
	});

	createEffect(async () => {
		if (state.bgImage) {
			setBgImageQueue(state.bgImage);
			setShowQueue(true);
			await sleep(2000);
			setBgImage(state.bgImage);
			// setShow(true);
			setShowQueue(false);
		}
	});

	onMount(() => {
		const inv = document.querySelector<HTMLElement>('.inventory');
		// const initHeight = backdrop.style.height;
		// const initHeightQueue = backdropQueue.style.height;

		const resize = () =>
			// defer after inventory resizes
			setTimeout(() => {
				console.log('stage', backdrop.clientHeight, inv?.clientHeight, backdrop.clientHeight - inv!.clientHeight)
				// backdropQueue.style.height = initHeightQueue;
				backdropQueue.style.height = `${
					backdropQueue.clientHeight - inv!.clientHeight
				}px`;
				// backdrop.style.height = initHeight;
				backdrop.style.height = `${
					backdrop.clientHeight - inv!.clientHeight
				}px`;
			}, 0);

		setTimeout(resize)

		view.runOnResize(false, resize);
	});

	return (
		<>
			<div class='stage'>
				<div
					ref={backdrop}
					class='backdrop'
					classList={{
						special: view.isSpecial(),
						show: show(),
						pending: view.hideBG(),
					}}
					style={{
						background: `url(/backgrounds/${bgImage()}) center center / cover no-repeat`,
					}}
				></div>
				<div
					ref={backdropQueue}
					class='backdrop backdrop-queue'
					classList={{
						special: view.isSpecial(),
						show: showQueue(),
						pending: view.hideBG(),
					}}
					style={{
						background: `url(/backgrounds/${bgImageQueue()}) center center / cover no-repeat`,
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
