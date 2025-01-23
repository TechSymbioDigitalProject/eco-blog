import { render } from 'preact';
import './index.css';
import AppRoutes from './routes/AppRoutes';

export function App() {
	return (	
		
				<AppRoutes />	
	);
}


render(<App />, document.getElementById('app'));