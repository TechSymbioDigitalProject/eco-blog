import { render } from 'preact';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

export function App() {
	return (	
		<AuthProvider>
				<AppRoutes />
		</AuthProvider>	
		
	);
}


render(<App />, document.getElementById('app'));