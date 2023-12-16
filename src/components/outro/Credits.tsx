import { Component, onMount } from 'solid-js';
import { useView } from '../../contexts/View';

type props = {};

const Credits: Component<props> = () => {
	const view = useView()!;
	onMount(() => {
		view.updateView('intro', { preSleepMS: 2000 });
	});

	return (
		<>
			<div class='outro'>FIN</div>
		</>
	);
};

export default Credits;
