import { Component, Show, createEffect, createSignal, onMount } from 'solid-js';
import { state } from '../../contexts/SessionState';
import { useController } from '../../contexts/Controller';
import useEventListener from '../../hooks/useEventListener';
import { useView } from '../../contexts/View';

type props = {};

let dialogueContainer: HTMLDivElement;
let dialogue: HTMLDivElement;
let dialogueClone: HTMLDivElement;
const Dialogue: Component<props> = () => {
	const [timeoutID, setTimeoutID] = createSignal(0);
	const [showBlinker, setShowBlinker] = createSignal(false);
	const [text, setText] = createSignal('');
	const view = useView()!;
	const controller = useController()!;

	const resize = () => {
		setTimeout(() => {
			const padding = Math.ceil(
				parseFloat(window.getComputedStyle(dialogue).paddingLeft) * 2
			);
			const _padding = Math.ceil(
				parseFloat(window.getComputedStyle(dialogueContainer).paddingLeft) * 2
			);
			const width = dialogueContainer.offsetWidth - _padding;
			const cloneWidth = dialogueClone.offsetWidth + 1 + padding;
			// console.log(
			// 	width,
			// 	dialogueContainer.clientWidth,
			// 	dialogueContainer.offsetWidth,
			// 	window.getComputedStyle(dialogueContainer).width,
			// 	cloneWidth
			// );
			dialogue.style.width = `${Math.min(width, cloneWidth)}px`;
		}, 0);
	};
	view.runOnResize(true, resize);

	const continueDialogue = () => {
		if (text().length < state.dialogue.length) {
			setText(state.dialogue);
			return;
		}

		clearTimeout(timeoutID());
		setShowBlinker(false);

		if (!state.options) {
			// setText('');
			controller.continueDialogue();
			// resize();
		}
	};

	const step = 10;
	createEffect(() => {
		let start: number;
		let rafID: number;
		let done = false;

		//@ts-ignore -- force solid to watch state.dialogue
		const _force_watch = state.dialogue;

		setText('');
		resize();

		const stepFn = (timestamp: number) => {
			if (!start) start = timestamp;

			const elapsed = timestamp - start;

			if (elapsed > step) {
				setText((text) => {
					let next = state.dialogue.charAt(text.length);
					if (next === '<') {
						let end = state.dialogue.indexOf('>', text.length);
						next = state.dialogue.substring(text.length, end + 1);
					}

					next = text + next;

					if (next.length === state.dialogue.length) {
						console.log('canceled');
						done = true;
					}

					return next;
				});

				start = performance.now();
			}

			if (done) {
				cancelAnimationFrame(rafID);
				if (!state.options)
					setTimeoutID(setTimeout(() => setShowBlinker(true), 2500));
			} else rafID = requestAnimationFrame(stepFn);
		};

		requestAnimationFrame(stepFn);

		return () => cancelAnimationFrame(rafID);
	});

	onMount(() => {
		controller.runDialogue('DM', 'intro');
		resize();
		console.log(state.dialogue);

		useEventListener('keydown', (e) => {
			if (state.options) return;
			if ((e as KeyboardEvent).key === ' ') {
				e.preventDefault();
				continueDialogue();
			}
		});
	});

	return (
		<>
			<div
				ref={dialogueContainer}
				class='dialogue-container'
				onClick={continueDialogue}
			>
				{!state.options && (
					<Show when={showBlinker()}>
						<div class='dialogue-blinker' />
					</Show>
				)}
				<div class='dialogue-text-bg'></div>
				<div
					ref={dialogue}
					class={`dialogue-text ${state.activeSpeaker} ${
						state.options && 'waiting'
					}`}
					innerHTML={text()}
				></div>
				<div
					ref={dialogueClone}
					class={`dialogue-text clone`}
					// onClick={continueDialogue}
					innerHTML={state.dialogue}
				></div>
				{/* <div class='typewriter'>
					<For each={Array.from({ length: length() }, () => 0)}>
						{(line) => <div class='typewriter-line'></div>}
					</For>
				</div> */}
			</div>
		</>
	);
};

export default Dialogue;
