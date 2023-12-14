import { Accessor, Component, Setter } from 'solid-js';
import { formatLabel } from '../../utils/utils';

type props = {
	key: string;
	currKey: Accessor<string>;
	setKey: Setter<string>;
};

const Tab: Component<props> = (props) => {
	return (
		<>
			<div
				class={`tab ${props.key === props.currKey() && 'active'}`}
				onClick={() => props.setKey(props.key)}
			>
				<span>{formatLabel(props.key)}</span>
			</div>
		</>
	);
};

export default Tab;
