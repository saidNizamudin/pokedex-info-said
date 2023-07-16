import { LoadingOutlined, PlusCircleFilled } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getFlavorTextById, getPokemonById } from '../api';
import { TYPES_BACKGROUND } from '../constants';
import { PokemonType, SpeciesType } from '../types';
import styles from './Pokemon.module.css';

export default function Pokemon() {
	const { id } = useParams();
	const [data, setData] = useState<PokemonType>({} as PokemonType);
	const [species, setSpecies] = useState<SpeciesType>({} as SpeciesType);
	const [current, setCurrent] = useState('about');
	const [isLoadingData, setIsLoadingData] = useState(true);
	const [isLoadingAbout, setIsLoadingAbout] = useState(true);

	const items: MenuProps['items'] = [
		{
			label: 'About',
			key: 'about',
		},
		{
			label: 'Base Stats',
			key: 'base-stats',
		},
	];

	useQuery(['pokemon', id], () =>
		fetch(getPokemonById(id)).then((res) => {
			res.json().then((data) => {
				setIsLoadingData(false);
				setData(data);
			});
		})
	);

	useQuery(['pokemonAbout', id], () =>
		fetch(getFlavorTextById(id)).then((res) => {
			res.json().then((data) => {
				setIsLoadingAbout(false);
				setSpecies(data);
			});
		})
	);

	const onClick: MenuProps['onClick'] = (e) => {
		setCurrent(e.key);
	};

	return (
		<div className={styles.contentContainer}>
			{isLoadingData || isLoadingAbout ? (
				<div className={styles.loaderContainer}>
					<LoadingOutlined className={styles.loader} />
					<span className={styles.loaderText}>Please Wait...</span>
				</div>
			) : (
				<div
					className={styles.pokemonContainer}
					style={{
						backgroundColor: `${TYPES_BACKGROUND[data?.types?.[0]?.type?.name]}55`,
					}}>
					<img
						alt="example"
						src={data?.sprites?.other?.['official-artwork']?.front_default}
						className={styles.pokemonImage}
					/>
					<div className={styles.pokemonTypes}>
						{data?.types?.map(
							(type: {
								type: {
									name: string;
								};
							}) => {
								return (
									<span
										style={{
											backgroundColor: TYPES_BACKGROUND[type?.type?.name],
										}}
										className={styles.pokemonType}>
										{type.type.name}
									</span>
								);
							}
						)}
					</div>
					<div className={styles.pokemonButtonContainer}>
						<PlusCircleFilled />
						<span>Add to Collection</span>
					</div>
					<div className={styles.pokemonContent}>
						<Menu
							mode="horizontal"
							items={items}
							onClick={onClick}
							selectedKeys={[current]}
							className={styles.pokemonMenu}
						/>
						<div className={styles.pokemonText}>
							{current === 'about' && (
								<>
									<div className={styles.pokemonId}>#{data?.id}</div>
									<div className={styles.pokemonName}>{data?.name}</div>

									<div className={styles.pokemonDescription}>
										{species?.flavor_text_entries?.[0]?.flavor_text}
									</div>
									<div className={styles.pokemonBasic}>
										<span className={styles.textTitle}>Basic</span>
										<span className={styles.text}>Weight: {data?.weight}</span>
										<span className={styles.text}>Height: {data?.height}</span>
									</div>
									<div className={styles.pokemonAbilities}>
										<span className={styles.textTitle}>Abilities</span>
										{data?.abilities?.map((ability: any) => {
											return (
												<li key={ability.ability.name} className={styles.text}>
													{ability.ability.name}
												</li>
											);
										})}
									</div>
								</>
							)}
							{current === 'base-stats' &&
								data?.stats?.map((stat: any) => {
									return (
										<>
											<div className={styles.pokemonStat}>
												<span className={styles.statsNumber}>({stat.base_stat})</span>
												<span className={styles.statsTitle}>{stat.stat.name}</span>
											</div>
											<div className={styles.pokemonStatBar}>
												<div
													className={styles.pokemonStatBarValue}
													style={{ width: `${stat.base_stat}%` }}
												/>
											</div>
										</>
									);
								})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
