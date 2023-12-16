import { Component } from 'solid-js';
import Dialogue from './Dialogue';
import NameBar from './NameBar';
// import TabBar from './TabBar';
import { state } from '../../contexts/SessionState';
import { entityLUT } from '../../core/LUTs';

type props = {};

const Middle: Component<props> = () => {
	return (
		<>
			<section class='middle'>
				<NameBar
					// left={state.leftPortraitName()}
					// right={state.rightPortraitName()}
					left={
						(state._leftPortraitName ||
							(state.leftDialogue &&
								(state.leftDialogue!.portraitName ||
									entityLUT[state.leftDialogue!.entity].portraitName))) ??
						''
					}
					right={
						(state._rightPortraitName ||
							(state.rightDialogue &&
								(state.rightDialogue!.portraitName ||
									entityLUT[state.rightDialogue!.entity].portraitName))) ??
						''
					}
					leftIsActive={state.activeSpeaker === state.leftDialogue?.entity}
					rightIsActive={state.activeSpeaker === state.rightDialogue?.entity}
				/>
				<div class='wrapper'>
					<Dialogue />
					{/* <TabBar /> */}
				</div>
			</section>
		</>
	);
};

export default Middle;
