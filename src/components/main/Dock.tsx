import { Component, Match, Switch } from 'solid-js';
import { useView } from '../../contexts/View';
import Combat from './Combat';
import Journal from './Journal';
import Notebook from './Notebook';
// import Prompt from './Prompt';
import Options from './Options';
// import DockItem from './DockItem';

type props = {};

const Dock: Component<props> = () => {
	const view = useView()!;

	return (
		<>
			<section
				class={`dock ${view.isSpecial() && 'special'}`}
				style={{
					'min-height': view.optionsHeightTarget() + 'px',
				}}
			>
				<div class='dock-spacer' />
				<Switch>
					<Match when={view.dockView() === 'prompt'}>
						<Options />
					</Match>
					<Match when={view.dockView() === 'combat'}>
						<Combat />
					</Match>
					<Match when={view.dockView() === 'journal'}>
						<Journal />
					</Match>
					<Match when={view.dockView() === 'notebook'}>
						<Notebook />
					</Match>
				</Switch>
				<div class='dock-spacer' />
			</section>
			{/* <section class={`dock ${view.isSpecial() && 'special'}`}>
				<DockItem key={view.leftTabKey} />
				<div class='vr' />
				<DockItem key={view.rightTabKey} />
			</section> */}
		</>
	);
};

export default Dock;
