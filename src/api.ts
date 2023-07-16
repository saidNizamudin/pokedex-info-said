export const getPokemonList = (limit: number, offset: number) => {
	return `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
};

export const getPokemonByType = (type: string) => {
	return `https://pokeapi.co/api/v2/type/${type}`;
};

export const getPokemonById = (id: string | undefined) => {
	return `https://pokeapi.co/api/v2/pokemon/${id}`;
};

export const getFlavorTextById = (id: string | undefined) => {
	return `https://pokeapi.co/api/v2/pokemon-species/${id}`;
};
