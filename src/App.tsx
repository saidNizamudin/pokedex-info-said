import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.css';
import Home from './pages/Home';

export default function App() {
	return (
		<>
			<div className={styles.navContainer}>
				<img src={'/pokedex.png'} alt="pokedex logo" className={styles.navLogo} />
			</div>
			<div className={styles.contentContainer}>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="pokemon/:id" element={<Home />} />
						<Route path="*" element={<Home />} />
					</Routes>
				</BrowserRouter>
			</div>
		</>
	);
}
