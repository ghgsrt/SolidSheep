import { Component, onMount } from 'solid-js';
import { useView } from '../contexts/View';
import TabGroup from './TabGroup';

type props = {};

const TabBar: Component<props> = () => {
	const view = useView()!;

	onMount(() => {
		const tabs = document.querySelectorAll('.tab');

		view.runOnResize(() => {
			let max = 0;
			for (const tab of tabs) {
				const width = tab.clientWidth;
				if (width > max) max = width;
			}
			for (const tab of tabs) {
				//@ts-ignore - this is fine
				tab.style.width = `${max}px`;
			}
		});
	});

	return (
		<>
			<div class='tab-bar'>
				<TabGroup
					items={view.leftTabKeys}
					currKey={view.leftTabKey}
					setKey={view.setLeftTabKey}
				/>
				<div class='spacer' />
				<TabGroup
					items={view.rightTabKeys}
					currKey={view.rightTabKey}
					setKey={view.setRightTabKey}
				/>
			</div>
		</>
	);
};

export default TabBar;
