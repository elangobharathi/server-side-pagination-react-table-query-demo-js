import { useState, useEffect, useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import reactTableContext from "../stores/react-table-context";
import axios from "axios";

const fetchPokemonData = async (page, pageSize) => {
  const offset = page * pageSize;
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pageSize}`
  );

  return response.data;
};

export const usePokemonData = (queryPageIndex, queryPageCount) => {
  const [data, setData] = useState([]);

  const reactTableCtx = useContext(reactTableContext);

  const queryClient = useQueryClient();

  useEffect(() => {
    // We want to make sure the current page is less than the total page left
    if (queryPageIndex < queryPageCount) {
      // By using prefetchingQuery we want to fetch whatever the next page is
      const nextPage = queryPageIndex + 1;

      // important to make sure the prefetchQuery query-keys needs to be identical with the useQuery.
      // The only exception is that we are passing on the "next page" as the index position #1 of the query-key array
      queryClient.prefetchQuery(
        ["pokemon-data", nextPage, queryPageCount],
        () => fetchPokemonData(nextPage, queryPageCount)
      );
    }
  }, [queryPageIndex, queryPageCount, queryClient]);

  const { data: pokemonData, isFetched, ...rest } = useQuery(
    ["pokemon-data", queryPageIndex, queryPageCount],
    () => fetchPokemonData(queryPageIndex, queryPageCount),
    {
      keepPreviousData: true,
      staleTime: Infinity
    }
  );

  useEffect(() => {
    setData([]);
    if (isFetched && pokemonData) {
      // Set the state for retrieving total items of the data that exist from the pokemon end-point
      reactTableCtx.setTotalCount({
        totalCountChangedValue: pokemonData.count
      });
      setData(pokemonData.results);
    }
  }, [isFetched, pokemonData]);

  return { data, ...rest };
};
