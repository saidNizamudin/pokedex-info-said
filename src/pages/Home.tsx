import { FilterFilled, FolderFilled, LoadingOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { getPokemonByType, getPokemonList } from '../api';
import PokemonCard from '../components/PokemonCard';
import { TYPES } from '../constants';
import { PokemonListItemType } from '../types';
import styles from './Home.module.css';

export default function Home() {
	const [pokemonList, setPokemonList] = useState<PokemonListItemType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
	const [isEndOfData, setIsEndOfData] = useState<boolean>(false);
	const [type, setType] = useState<string>('');
	const [typeSelected, setTypeSelected] = useState<string>('');
	const [showFilter, setShowFilter] = useState(false);
	const observerRef = useRef<HTMLDivElement | null>(null);

	const navigate = useNavigate();

	const loadPokemonList = useCallback(
		(offset: number = 0) => {
			console.log('loadPokemonList', offset);
			fetch(getPokemonList(30, offset))
				.then((res) => res.json())
				.then((data) => {
					setTimeout(() => {
						setIsLoading(false);
						setIsLoadMore(false);
						setPokemonList([...pokemonList, ...data.results]);
						if (data.next === null) {
							setIsEndOfData(true);
						}
					}, 500);
				});
		},
		[pokemonList]
	);

	const loadMoreData = useCallback(() => {
		if (isEndOfData) return;
		loadPokemonList(pokemonList.length);
		if (!isLoading) setIsLoadMore(true);
	}, [isLoading, isEndOfData, loadPokemonList, pokemonList.length]);

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

	const handleFilterChange = (selectedType: string) => {
		setTypeSelected(selectedType);
		setPokemonList([]);
		setShowFilter(false);

		if (selectedType) {
			setIsEndOfData(false);
			setIsLoading(true);
			fetch(getPokemonByType(selectedType))
				.then((res) => res.json())
				.then((data) => {
					setTimeout(() => {
						setIsLoading(false);
						setPokemonList(data.pokemon.map((entry: any) => entry.pokemon));
						if (data.pokemon.length === 0) {
							setIsEndOfData(true);
						}
					}, 500);
				});
		} else {
			setIsLoading(true);
			loadPokemonList();
		}
	};

	return (
		<>
			<div className={styles.menuContainer}>
				<span className={styles.menuItem} onClick={() => setShowFilter(true)}>
					<FilterFilled />
					Filter
				</span>
				<span className={styles.menuItem} onClick={() => navigate('/collection')}>
					<FolderFilled />
					My Collection
				</span>
			</div>
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
			<Modal
				title="Filter by Type"
				open={showFilter}
				onOk={() => handleFilterChange(type)}
				onCancel={() => setShowFilter(false)}
				className={styles.modal}>
				<div className={styles.filterContainer}>
					{TYPES.map((item: string) => (
						<Button
							key={item}
							className={type === item ? styles.filterButtonActive : styles.filterButton}
							onClick={() => setType(item)}
							type="primary">
							{item}
						</Button>
					))}
					<Button
						key={'reset'}
						className={type === '' ? styles.filterButtonResetActive : styles.filterButtonReset}
						onClick={() => setType('')}
						type="ghost">
						reset
					</Button>
				</div>
			</Modal>
		</>
	);
}
