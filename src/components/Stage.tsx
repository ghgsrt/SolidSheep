import { Component, onMount } from 'solid-js';
import Middle from './Middle';
import Side from './Side';
import { useView } from '../contexts/View';
import { state } from '../contexts/SessionState';

type props = {};

let backdrop: HTMLDivElement;
const Stage: Component<props> = () => {
	const view = useView()!;

	onMount(() => {
		const inv = document.querySelector<HTMLElement>('.inventory');
		const initHeight = backdrop.style.height;

		view.runOnResize(() =>
			// defer after inventory resizes
			setTimeout(() => {
				backdrop.style.height = initHeight;
				backdrop.style.height = `${
					backdrop.clientHeight - inv!.clientHeight
				}px`;
			}, 0)
		);
	});

	return (
		<>
			<div class='stage'>
				<div
					ref={backdrop}
					class={`backdrop ${view.isSpecial() && 'special'}`}
					style={{
						'background-image': `url(/backgrounds/${state.bgImage})`,
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
