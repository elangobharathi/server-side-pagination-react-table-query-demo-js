export const fetchPokemonData = async (page, pageSize) => {
  const offset = page * pageSize;
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pageSize}`
    );
    const data = await response.json();

    return data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};
