import React from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import PokemonTable from './PokemonTable';

const queryClient = new QueryClient();

function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <PokemonTable />
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </div>
  );
}

export default App;
