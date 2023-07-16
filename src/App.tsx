import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.css';
import { Home, Pokemon } from './pages';

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
						<Route path="pokemon/:id" element={<Pokemon />} />
						<Route path="*" element={<Home />} />
					</Routes>
				</BrowserRouter>
			</div>
		</>
	);
}
