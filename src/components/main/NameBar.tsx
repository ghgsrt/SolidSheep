import { Component } from 'solid-js';
import { useView } from '../../contexts/View';

type props = {
	right: string;
	left: string;
	leftIsActive: boolean;
	rightIsActive: boolean;
};

let leftName: HTMLDivElement;
let rightName: HTMLDivElement;
const NameBar: Component<props> = (props) => {
	const view = useView()!;

	return (
		<>
			<div class='dialogue-name-container'>
				<div
					ref={leftName}
					class={`dialogue-name ${
						props.left && !view.hideLeftName() ? 'show' : ''
					} ${props.leftIsActive ? 'active' : ''}`}
				>
					{props.left}
				</div>
				<div
					ref={rightName}
					class={`dialogue-name ${
						props.right && !view.hideRightName() ? 'show' : ''
					} ${props.rightIsActive ? 'active' : ''}`}
				>
					{props.right}
				</div>
			</div>
		</>
	);
};

export default NameBar;
