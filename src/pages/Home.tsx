import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { getPokemonList } from '../api'; // Replace 'Pokemon' with the actual type for your 'getPokemonList' response.
import PokemonCard from '../components/PokemonCard';
import { PokemonListItemType } from '../types';
import styles from './Home.module.css';

export default function Home() {
	const [pokemonList, setPokemonList] = useState<PokemonListItemType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
	const [isEndOfData, setIsEndOfData] = useState<boolean>(false);
	const observerRef = useRef<HTMLDivElement | null>(null);

	const loadMoreData = useCallback(() => {
		if (isEndOfData) return;
		if (!isLoading) {
			setIsLoadMore(true);
		}
		fetch(getPokemonList(30, pokemonList.length)).then((res) => {
			res.json().then((data) => {
				setTimeout(() => {
					setIsLoading(false);
					setIsLoadMore(false);
					setPokemonList([...pokemonList, ...data.results]);
					if (data.next === null) {
						setIsEndOfData(true);
					}
				}, 500);
			});
		});
	}, [isLoading, isEndOfData, pokemonList.length]);

	useQuery('home', loadMoreData);

	const handleIntersection: IntersectionObserverCallback = (entries) => {
		const target = entries[0];
		if (target.isIntersecting) {
			loadMoreData();
		}
	};

	useEffect(() => {
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 1.0,
		};
		const observer = new IntersectionObserver(handleIntersection, options);
		if (observerRef.current) observer.observe(observerRef.current);

		return () => {
			if (observerRef.current) observer.unobserve(observerRef.current);
		};
	}, [loadMoreData]);

	return (
		<>
			<div className={styles.contentContainer}>
				{isLoading ? (
					<div className={styles.loaderContainer}>
						<LoadingOutlined className={styles.loader} />
						<span className={styles.loaderText}>Please Wait...</span>
					</div>
				) : (
					<>
						{pokemonList.map((pokemon) => (
							<PokemonCard pokemon={pokemon} key={pokemon.name} />
						))}
						<div ref={observerRef}></div>
					</>
				)}
			</div>
			{isLoadMore && (
				<div className={styles.loaderMoreContainer}>
					<LoadingOutlined className={styles.loaderMore} />
					<span className={styles.loaderMoreText}>Loading More...</span>
				</div>
			)}
			{isEndOfData && (
				<div className={styles.endOfDataContainer}>
					<span className={styles.endOfDataText}>End of Data</span>
					<button
						className={styles.endOfDataButton}
						onClick={() => {
							window.scrollTo({
								top: 0,
								behavior: 'smooth',
							});
						}}>
						Back to Top
					</button>
				</div>
			)}
		</>
	);
}
