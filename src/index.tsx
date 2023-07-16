import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import styles from './index.module.css';
import { Collection, Home, Pokemon } from './pages';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const queryClient = new QueryClient();
root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<div className={styles.navContainer}>
					<img src={'/pokedex.png'} alt="pokedex logo" className={styles.navLogo} />
				</div>
				<div className={styles.contentContainer}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="pokemon/:id" element={<Pokemon />} />
						<Route path="collection" element={<Collection />} />
						<Route path="*" element={<Home />} />
					</Routes>
				</div>
			</BrowserRouter>
		</QueryClientProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
