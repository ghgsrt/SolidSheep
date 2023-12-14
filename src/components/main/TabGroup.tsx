import {
	Accessor,
	Component,
	For,
	Setter,
	createEffect,
	createSignal,
} from 'solid-js';
import Tab from './Tab';

type props = {
	items: string[];
	currKey: Accessor<string>;
	setKey: Setter<string>;
};

const TabGroup: Component<props> = (props) => {
	const [idxOfCurrKey, setIdxOfCurrKey] = createSignal(0);

	createEffect(() => setIdxOfCurrKey(props.items.indexOf(props.currKey())));

	return (
		<>
			<div class='tab-group'>
				<div
					class='tab-indicator'
					style={`left: ${13 + (100 / props.items.length) * idxOfCurrKey()}%`}
				/>
				<For each={props.items}>
					{(itemKey) => (
						<Tab key={itemKey} currKey={props.currKey} setKey={props.setKey} />
					)}
				</For>
			</div>
		</>
	);
};

export default TabGroup;
