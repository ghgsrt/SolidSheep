import { Component } from 'solid-js';
import Dialogue from './Dialogue';
import NameBar from './NameBar';
import TabBar from './TabBar';
import { state } from '../../contexts/SessionState';

type props = {};

const Middle: Component<props> = () => {
	return (
		<>
			<section class='middle'>
				<NameBar
					left={state.leftPortraitName}
					right={state.rightPortraitName}
					leftIsActive={
						state.activeSpeaker === state.leftPortraitName ||
						(state.activeSpeaker === 'Player' &&
							state.playerName === state.leftPortraitName)
					}
					rightIsActive={
						state.activeSpeaker === state.rightPortraitName ||
						(state.activeSpeaker === 'Player' &&
							state.playerName === state.rightPortraitName)
					}
				/>
				<div
					class='wrapper'
					// style={{
					// 	'border-top-left-radius': `${
					// 		state.leftPortraitName ? '0' : '20px'
					// 	}`,
					// 	'border-top-right-radius': `${
					// 		state.rightPortraitName ? '0' : '20px'
					// 	}`,
					// }}
				>
					<Dialogue />
					<TabBar />
				</div>
			</section>
		</>
	);
};

export default Middle;
