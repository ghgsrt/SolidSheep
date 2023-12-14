import { Component, Match, Switch } from 'solid-js';
import Stage from './main/Stage';
import Dock from './main/Dock';
import { useView } from '../contexts/View';
import MainMenu from './intro/MainMenu';
import Credits from './outro/Credits';

type props = {};

const Main: Component<props> = () => {
	const view = useView()!;

	return (
		<>
			<main
				data-view={view.currView()}
				classList={{
					pending: view.pending(),
					show: view.currView() === 'intro' || !view.pending(),
				}}
			>
				<Switch>
					<Match when={view.currView() === 'intro'}>
						<MainMenu />
					</Match>
					<Match when={view.currView() === 'main'}>
						<Stage />
						<Dock />
					</Match>
					<Match when={view.currView() === 'outro'}>
						<Credits />
					</Match>
				</Switch>
			</main>
		</>
	);
};

export default Main;
