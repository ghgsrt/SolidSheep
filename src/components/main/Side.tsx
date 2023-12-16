import { Component } from 'solid-js';
import Inventory from './Inventory';
import Portrait from './Portrait';
import { state } from '../../contexts/SessionState';
import { useView } from '../../contexts/View';
import { entityLUT } from '../../core/LUTs';

type props = {
	right?: boolean;
	left?: boolean;
};

const Side: Component<props> = (props) => {
	const view = useView()!;
	const side = props.right ? 'right' : 'left';

	return (
		<>
			<section class={side}>
				<div class='portrait-wrapper'>
					<Portrait
						// src={state[`${side}PortraitImage`]()}
						src={
							props.right
								? (state._rightPortraitImage ||
										(state.rightDialogue &&
											(state.rightDialogue?.portrait ||
												entityLUT[state.rightDialogue!.entity].portrait))) ??
								  ''
								: (state._leftPortraitImage ||
										(state.leftDialogue &&
											(state.leftDialogue?.portrait ||
												entityLUT[state.leftDialogue!.entity].portrait))) ??
								  ''
						}
						hide={props.right ? view.hideRightImage() : view.hideLeftImage()}
						active={state.activeSpeaker === state[`${side}Dialogue`]?.entity}
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
