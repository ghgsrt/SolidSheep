import { Component, For, createEffect, on, onMount } from 'solid-js';
import Prompter from './Prompter';
import { state } from '../contexts/SessionState';
import { useController } from '../contexts/Controller';
import useEventListener from '../hooks/useEventListener';
import { useView } from '../contexts/View';

type props = {};

let history: HTMLDivElement;
let input: HTMLInputElement;
let cachedValue = '';
const Prompt: Component<props> = () => {
	const controller = useController()!;
	const view = useView()!;

	const prompt = () => {
		controller.prompt(input.value.trim());
		input.value = '';
		history.scrollTo({
			top: history.scrollHeight,
			behavior: 'smooth',
		});
	};

	onMount(() => {
		input.focus();
		input.onblur = () => input.focus();
		input.onchange = () => (cachedValue = input.value);
		useEventListener('focus', () => input.focus());

		createEffect(() => {
			if (state.options) input.focus();
		});

		createEffect(
			on(view.leftTabKey, () => {
				input.value = cachedValue;
				input.focus;
				history.scrollTo({
					top: history.scrollHeight,
					behavior: 'smooth',
				});
			})
		);
	});

	return (
		<>
			<div class='prompt'>
				<div ref={history} class='history'>
					<For each={state.history}>
						{(item) => (
							<div class='history-item'>
								<div class={`history-item-name ${item.name}`}>
									{!item.name && '>'}
								</div>

								<div
									class='history-item-text'
									innerHTML={`${!item.name ? '&nbsp;' : ''}${item.text}`}
								></div>
							</div>
						)}
					</For>
				</div>
				<Prompter
					ref={input}
					label={state.playerName}
					disabled={!state.options}
					onEnter={prompt}
				/>
			</div>
		</>
	);
};

export default Prompt;
