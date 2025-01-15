import { render } from 'preact';
import './index.css';

export function App() {
	return (
		<div className="bg-blue-500 text-white p-6 rounded-lg">
			<h1 className="text-2xl font-bold">Hello, Tailwind CSS!</h1>
		</div>
	
	);
}


render(<App />, document.getElementById('app'));