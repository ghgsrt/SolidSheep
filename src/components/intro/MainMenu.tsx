import { Component, createSignal, onMount } from 'solid-js';
import { useView } from '../../contexts/View';
import { setState } from '../../contexts/SessionState';

type props = {};

const MainMenu: Component<props> = () => {
	const [value, setValue] = createSignal('');
	const view = useView()!;

	const startGame = () => {
		setState('playerName', value());
		if (value()) view.updateView('main');
	};

	onMount(() => document.querySelector('input')?.focus());

	return (
		<>
			<div class='main-menu'>
				<h3>Based on</h3>
				<h1>The Wild Sheep Chase</h1>
				<h3>A DnD One-Shot</h3>
				<input
					onInput={(e) => setValue(e.target.value)}
					type='text'
					placeholder='Enter Your Name'
					onKeyDown={(e) => e.key === 'Enter' && startGame()}
				/>
				<div onClick={startGame} class={`button ${value() ? 'show' : ''}`}>
					Begin<div class='main-menu-blinker'></div>
				</div>
			</div>
		</>
	);
};

export default MainMenu;
