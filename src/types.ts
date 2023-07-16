export type PokemonListItemType = {
	name: string;
	url: string;
};

export type PokemonTypesType = {
	slot: number;
	type: {
		name: string;
		url: string;
	};
};

export type PokemonSpritesType = {
	other: {
		'official-artwork': {
			front_default: string;
		};
	};
};

export type PokemonType = {
	id: number;
	name: string;
	weight: number;
	height: number;
	types: PokemonTypesType[];
	sprites: PokemonSpritesType;
};
