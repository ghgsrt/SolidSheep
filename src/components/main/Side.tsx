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
											(state.rightDialogue?.portraitImage ||
												entityLUT[state.rightDialogue!.entity]
													.portraitImage))) ??
								  ''
								: (state._leftPortraitImage ||
										(state.leftDialogue &&
											(state.leftDialogue?.portraitImage ||
												entityLUT[state.leftDialogue!.entity]
													.portraitImage))) ??
								  ''
						}
						hide={props.right ? view.hideRightImage() : view.hideLeftImage()}
						active={state.activeSpeaker === state[`${side}Dialogue`]?.entity}
					/>
					{/* <div class='half-pipe'></div> */}
					<svg viewBox='0 0 100 100'>
						<path
							d={
								props.right
									? 'M-3,15 L0,105 L100,101 A100,100 0 0 1 -1,15 Z'
									: `M103,15 L100,105 L0,101 A100,100 0 0 0 101,15 Z`
							}
						/>
					</svg>
				</div>
				<Inventory side={side} />
			</section>
		</>
	);
};

export default Side;
