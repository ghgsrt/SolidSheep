import { Component, createEffect, onMount } from 'solid-js';
import { useView } from '../../contexts/View';

type props = {
	src: string;
	hide: boolean;
	active: boolean;
};

const Portrait: Component<props> = (props) => {
	let portrait: HTMLDivElement;
	const { runOnResize } = useView()!;

	onMount(() => {
		const resize = () =>
			(portrait.style.height = `${portrait!.offsetWidth * 2}px`);
		runOnResize(resize);
		resize();
	});

	createEffect(() => {
		// if (!props.src)
		// if (props.src) setTimeout(() => portrait.classList.add('show'), 0);
	});

	return (
		<>
			<div
				//@ts-ignore - typescript is dumb
				ref={portrait}
				class={`portrait ${props.src && !props.hide ? 'show' : ''} ${
					props.active ? 'active' : ''
				}`}
				style={{
					'background-image': `url(/characters/${props.src})`,
				}}
			></div>
		</>
	);
};

export default Portrait;
