import './App.css';
import ControllerProvider from './contexts/Controller';
import ViewProvider from './contexts/View';
import Main from './components/Main';
import { onMount } from 'solid-js';
import { preloadImages } from './utils/utils';

function App() {
	onMount(() => {
		preloadImages([
			'backgrounds/intro.png',
			'backgrounds/sheep_appears.png',
			'backgrounds/took_scroll.png',
			'backgrounds/gruz_appears.png',
			'characters/player.png',
			'characters/player-female.png',
			'characters/player-amo.png',
			'characters/guz.png',
			'characters/sheep.png',
			'icons/glimmer.png',
			'icons/icon_bg.png',
			'icons/icon_bg2.png',
			'icons/scroll.jpg',
		]);
	});

	return (
		<>
			<ViewProvider>
				<ControllerProvider>
					<Main />
				</ControllerProvider>
			</ViewProvider>
		</>
	);
}

export default App;
