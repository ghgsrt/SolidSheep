import { Component, onMount } from 'solid-js';
import { useView } from '../../contexts/View';

type props = {};

const MainMenu: Component<props> = () => {
	const view = useView()!;

	onMount(() => document.querySelector('input')?.focus());

	return (
		<>
			<div class='main-menu'>
				<h3>Based on</h3>
				<h1>The Wild Sheep Chase</h1>
				<h3>A DnD One-Shot</h3>
				<div
					class='button'
					onClick={() => view.updateView('character-create', { sleepMS: 1000 })}
				>
					Create Your Character<div class='main-menu-blinker'></div>
				</div>
			</div>
		</>
	);
};

export default MainMenu;
