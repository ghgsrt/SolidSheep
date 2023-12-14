import { Component } from 'solid-js';
import { useView } from '../../contexts/View';
import DockItem from './DockItem';

type props = {};

const Dock: Component<props> = () => {
	const view = useView()!;

	return (
		<>
			<section class={`dock ${view.isSpecial() && 'special'}`}>
				<DockItem key={view.leftTabKey} />
				<div class='vr' />
				<DockItem key={view.rightTabKey} />
			</section>
		</>
	);
};

export default Dock;
