import { HomeFilled, LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';
import { PokemonListItemType } from '../types';
import styles from './Collection.module.css';

export default function Collection() {
	const [pokemonList, setPokemonList] = useState<PokemonListItemType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const navigate = useNavigate();

	useEffect(() => {
		const collection = localStorage.getItem('collection');
		if (collection) {
			const parsedCollection = JSON.parse(collection);
			const collectionList = Object.keys(parsedCollection).map((key) => {
				return {
					name: parsedCollection[key].name,
					url: parsedCollection[key].url,
				};
			});
			setPokemonList(collectionList);
		}
		setIsLoading(false);
	});

	return (
		<>
			<div className={styles.menuContainer}>
				<span
					className={styles.menuItem}
					onClick={() => {
						navigate('/');
					}}>
					<HomeFilled />
					Back to Home
				</span>
			</div>
			<div className={styles.contentContainer}>
				{isLoading ? (
					<div className={styles.loaderContainer}>
						<LoadingOutlined className={styles.loader} />
						<span className={styles.loaderText}>Please Wait...</span>
					</div>
				) : (
					pokemonList.map((pokemon) => <PokemonCard pokemon={pokemon} key={pokemon.name} />)
				)}
			</div>
		</>
	);
}
