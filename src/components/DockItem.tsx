import { Accessor, Component, Match, Switch } from 'solid-js';
import Combat from './Combat';
import Prompt from './Prompt';
import Journal from './Journal';
import Notebook from './Notebook';

type props = {
	key: Accessor<string>;
};

const DockItem: Component<props> = (props) => {
	return (
		<>
			<section class='dock-item'>
				<Switch>
					<Match when={props.key() === 'prompt'}>
						<Prompt />
					</Match>
					<Match when={props.key() === 'combat'}>
						<Combat />
					</Match>
					<Match when={props.key() === 'journal'}>
						<Journal />
					</Match>
					<Match when={props.key() === 'notebook'}>
						<Notebook />
					</Match>
				</Switch>
			</section>
		</>
	);
};

export default DockItem;
