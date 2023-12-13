import './App.css';
import ControllerProvider from './contexts/Controller';
import Dock from './components/Dock';
import ViewProvider from './contexts/View';
import Stage from './components/Stage';

function App() {
	return (
		<>
			<ViewProvider>
				<ControllerProvider>
					<main>
						<Stage />
						<Dock />
					</main>
				</ControllerProvider>
			</ViewProvider>
		</>
	);
}

export default App;
