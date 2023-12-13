import { Component, For, onMount } from 'solid-js';
import InventoryItem from './InventoryItem';
import { state } from '../contexts/SessionState';
import { useView } from '../contexts/View';

type props = {
	side: 'left' | 'right';
};

const Inventory: Component<props> = (props) => {
	let itemRefs: HTMLDivElement[] = [];
	const view = useView()!;

	onMount(() =>
		view.runOnResize(() => {
			for (const item of itemRefs) item.style.height = `${item.offsetWidth}px`;
		})
	);

	return (
		<>
			<div class='inventory'>
				<For each={[0, 1, 2]}>
					{(idx) => (
						<InventoryItem
							ref={itemRefs[idx]}
							item={state.inventory[props.side === 'left' ? idx : idx + 3]}
						/>
					)}
				</For>
			</div>
		</>
	);
};

export default Inventory;
