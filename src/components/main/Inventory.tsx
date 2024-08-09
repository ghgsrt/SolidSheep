import { Component, For } from 'solid-js';
import InventoryItem from './InventoryItem';
import { state } from '../../contexts/SessionState';

type props = {
	side: 'left' | 'right';
};

const Inventory: Component<props> = (props) => {
	let itemRefs: HTMLDivElement[] = [];

	const getOffset = (idx: number) => {
		const offset: string[] = [props.side];

		if (props.side === 'left') offset.push(`${(idx + 1) * 25}%`);
		else offset.push(`${100 - (idx + 1) * 25}%`);

		return offset as ['left' | 'right', string];
	};

	return (
		<>
			<div class='inventory'>
				<For each={[0, 1, 2]}>
					{(idx) => (
						<InventoryItem
							ref={itemRefs[idx]}
							offset={getOffset(idx)}
							item={state.inventory[props.side === 'left' ? idx : idx + 3]}
						/>
					)}
				</For>
			</div>
		</>
	);
};

export default Inventory;
