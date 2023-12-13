import { Component } from 'solid-js';

type props = {
	ref: HTMLInputElement;
	label: string;
	disabled?: boolean;
	onEnter: () => void;
};

const Prompter: Component<props> = (props) => {
	return (
		<>
			<div class='prompter-wrapper'>
				<p class={`prompter-label ${props.disabled ? 'disabled' : ''}`}>
					{`[${props.label}]:`}&nbsp;
				</p>
				<input
					ref={props.ref}
					class='prompter'
					type='text'
					disabled={props.disabled}
					onKeyDown={(e) => e.key === 'Enter' && props.onEnter()}
				/>
			</div>
		</>
	);
};

export default Prompter;
