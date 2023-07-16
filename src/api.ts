export const getPokemonList = (limit: number, offset: number) => {
	return `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
};
