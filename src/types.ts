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

export type PokemonAbilityType = {
	ability: {
		name: string;
	};
};

export type PokemonStatType = {
	base_stat: number;
	effort: number;
	stat: {
		name: string;
	};
};

export type PokemonType = {
	id: number;
	name: string;
	weight: number;
	height: number;
	types: PokemonTypesType[];
	sprites: PokemonSpritesType;
	abilities: PokemonAbilityType[];
	stats: PokemonStatType[];
};

export type SpeciesType = {
	flavor_text_entries: {
		flavor_text: string;
		language: {
			name: string;
		};
	}[];
};
