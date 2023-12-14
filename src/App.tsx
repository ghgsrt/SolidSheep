import './App.css';
import ControllerProvider from './contexts/Controller';
import ViewProvider from './contexts/View';
import Main from './components/Main';

function App() {
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
