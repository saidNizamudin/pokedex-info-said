import { MinusCircleFilled, PlusCircleFilled, StarFilled } from '@ant-design/icons';
import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { TYPES_BACKGROUND } from '../constants';
import { PokemonListItemType, PokemonType } from '../types';
import styles from './PokemonCard.module.css';

export default function PokemonCard({ pokemon }: { pokemon: PokemonListItemType }) {
	const [data, setData] = useState<PokemonType>({} as PokemonType);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isInCollection, setIsInCollection] = useState<boolean>(false);

	const navigate = useNavigate();

	useQuery(['pokemon', pokemon.url], () =>
		fetch(pokemon.url).then((res) => {
			res.json().then((data) => {
				setTimeout(() => {
					setIsLoading(false);
					setData(data);
				}, 500);
			});
		})
	);

	useEffect(() => {
		const collection = localStorage.getItem('collection') || '{}';
		const parsedCollection = JSON.parse(collection);
		const isInCollection = parsedCollection[data?.id];
		setIsInCollection(!!isInCollection);
	}, [data?.id]);

	const handleAddToCollection = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();
		const collection = localStorage.getItem('collection') || '{}';
		const parsedCollection = JSON.parse(collection);
		parsedCollection[data?.id] = {
			name: data?.name,
			url: pokemon.url,
		};
		localStorage.setItem('collection', JSON.stringify(parsedCollection));
		setIsInCollection(true);
	};

	const handleRemoveFromCollection = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();
		const collection = localStorage.getItem('collection') || '{}';
		const parsedCollection = JSON.parse(collection);
		delete parsedCollection[data?.id];
		localStorage.setItem('collection', JSON.stringify(parsedCollection));
		setIsInCollection(false);
	};

	return (
		<Card
			loading={isLoading}
			hoverable
			style={{
				backgroundColor: `${TYPES_BACKGROUND[data?.types?.[0]?.type?.name]}55`,
				borderRadius: 10,
			}}
			cover={
				<img
					alt="example"
					src={
						data?.sprites?.other?.['official-artwork']?.front_default ||
						'http://www.listercarterhomes.com/wp-content/uploads/2013/11/dummy-image-square.jpg'
					}
				/>
			}
			onClick={() => {
				navigate(`/pokemon/${data?.id}`);
			}}>
			{isInCollection && <StarFilled className={styles.starIcon} />}
			<div className={styles.pokemonText}>
				<span className={styles.pokemonId}>{`#${data?.id}`}</span>
				<span className={styles.pokemonName}>{data?.name}</span>
				<div className={styles.pokemonTypes}>
					{data?.types?.map((type: { type: { name: string } }) => {
						return (
							<span
								style={{
									backgroundColor: TYPES_BACKGROUND[type?.type?.name],
								}}
								className={styles.pokemonType}>
								{type.type.name}
							</span>
						);
					})}
				</div>
			</div>
			{isInCollection ? (
				<div className={styles.pokemonButtonContainer} onClick={handleRemoveFromCollection}>
					<MinusCircleFilled />
					<span>Remove from Collection</span>
				</div>
			) : (
				<div className={styles.pokemonButtonContainer} onClick={handleAddToCollection}>
					<PlusCircleFilled />
					<span>Add to Collection</span>
				</div>
			)}
		</Card>
	);
}
