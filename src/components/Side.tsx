import { Component, createEffect } from 'solid-js';
import Inventory from './Inventory';
import Portrait from './Portrait';
import { state } from '../contexts/SessionState';
import { useView } from '../contexts/View';

type props = {
	right?: boolean;
	left?: boolean;
};

const Side: Component<props> = (props) => {
	const view = useView()!;
	const side = props.right ? 'right' : 'left';

	createEffect(() =>
		console.log(
			state.activeSpeaker ===
				(props.right ? state.rightPortraitName : state.leftPortraitName)
		)
	);

	return (
		<>
			<section class={side}>
				<div class='portrait-wrapper'>
					<Portrait
						src={
							props.right ? state.rightPortraitImage : state.leftPortraitImage
						}
						hide={props.right ? view.hideRightImage() : view.hideLeftImage()}
						active={
							state.activeSpeaker ===
							(props.right ? state.rightPortraitName : state.leftPortraitName)
						}
					/>
					<svg>
						<path d='M100,100 H-1 V20 A70,70 0 0,0 60,91 Z' />
					</svg>
				</div>
				<Inventory side={side} />
			</section>
		</>
	);
};

export default Side;
