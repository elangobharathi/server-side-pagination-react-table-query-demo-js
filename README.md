[React-table](https://react-table.tanstack.com/) and [react-query](https://react-query.tanstack.com/) are two awesome react libraries from [Tanner](https://github.com/tannerlinsley). They are well documented in [tanstack website](https://tanstack.com/) with the examples of most use cases. Now, I am going to explain how you can implement server side pagination using react-table and react-query.

[React-table](https://react-table.tanstack.com/) is a powerful headless design so you can have full control over the render and style aspects. It gives you all the declarative hooks APIs for you to compose and conquer. In order to control the pagination, we need to use `usePagination` with `manualPagination: true`. 

[React-query](https://react-query.tanstack.com/) is a declarative and automatic server state library to fetch and cache data from your backend APIs. For our purpose, `useQuery` with `keepPreviousData` option will enable **the data from the last successful fetch available while new data is being requested, even though the query key has changed** ([For more info](https://react-query.tanstack.com/guides/paginated-queries#better-paginated-queries-with-keeppreviousdata)). 

To explain further, let's consider an example of building a server side paginated table using the [Pokémon](https://pokeapi.co/) API.

For a seak peek of the full code: 
  * [github link](https://github.com/elangobharathi/server-side-pagination-react-table-query-demo-js)
  * [codesandbox link](https://codesandbox.io/s/server-side-pagination-react-table-query-demo-js-9wn8h?file=/src/PokemonTable.js)

```javascript
const fetchPokemonData = async (page, pageSize) => {
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
```
Since Pokémon API expects offset, it's being derived from page and pageSize.


```javascript
const { isLoading, error, data, isSuccess } = useQuery(
  ['pokemons', queryPageIndex, queryPageSize],
  () => fetchPokemonData(queryPageIndex, queryPageSize),
  {
    keepPreviousData: true,
    staleTime: Infinity,
  }
);
```
This fetches the data as and when the query keys, which are the pageIndex and pageSize from the state change. `staleTime` is marked as infinity as we don't want to burden the Pokémon API with too many hits.

Now, let's bring in `useTable` hook from [react-table](https://react-table.tanstack.com/).

```javascript
const {
  getTableProps,
  getTableBodyProps,
  headerGroups,
  prepareRow,
  page,
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  // Get the state from the instance
  state: { pageIndex, pageSize },
} = useTable(
  {
    columns,
    data: isSuccess ? trimData(data.results) : [],
    initialState: {
      pageIndex: queryPageIndex,
      pageSize: queryPageSize,
    },
    manualPagination: true, // Tell the usePagination
    // hook that we'll handle our own data fetching
    // This means we'll also have to provide our own
    // pageCount.
    pageCount: isSuccess ? Math.ceil(totalCount / queryPageSize) : null,
  },
  usePagination
);
```
We are passing the `queryPageIndex` and `queryPageSize` as the initial state. When the fetch query is `isSuccess`, we pass on the `data` and the `pageCount`. Let's look at our local state now.

```javascript
const initialState = {
  queryPageIndex: 0,
  queryPageSize: 10,
  totalCount: null,
};

const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case PAGE_CHANGED:
      return {
        ...state,
        queryPageIndex: payload,
      };
    case PAGE_SIZE_CHANGED:
      return {
        ...state,
        queryPageSize: payload,
      };
    case TOTAL_COUNT_CHANGED:
      return {
        ...state,
        totalCount: payload,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

const [{ queryPageIndex, queryPageSize, totalCount }, dispatch] =
  React.useReducer(reducer, initialState);
```
I am using `useReducer` in this case. As `queryPageIndex` and `queryPageSize` are being used in the `useQuery` keys, the `fetchPokemonData` is invoked when we either move to a new page or change to a new pageSize. Since we are using `staleTime: Infinity`, already visited pages with a particular page size is served from the cache for infinite time.

```javascript
React.useEffect(() => {
  dispatch({ type: PAGE_CHANGED, payload: pageIndex });
}, [pageIndex]);

React.useEffect(() => {
  dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
  gotoPage(0);
}, [pageSize, gotoPage]);

React.useEffect(() => {
  if (data?.count) {
    dispatch({
      type: TOTAL_COUNT_CHANGED,
      payload: data.count,
    });
  }
}, [data?.count]);
```

Here comes the interesting part where we capture `pageIndex` and `pageSize` of react-table state changes in the useEffect and dispatch to keep a copy in our local state. This is clearly duplicating them in favour of using `useQuery` in its declarative nature. There is another option to imperatively use react-query's `fetchQuery` and keep the data in the local state but you will miss the status and all other automagical stuff of `useQuery`. If you want to explore more on this topic, you can follow the reference links given at the bottom.

Here is the complete code of this PokemonTable component.

```javascript
import React from 'react';
import styled from 'styled-components';
import { useTable, usePagination } from 'react-table';
import { useQuery } from 'react-query';
import { fetchPokemonData } from './fetchData';

const TableContainer = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

const columns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Url',
    accessor: 'url',
  },
];

const trimData = (data = []) =>
  data.map(({ name, url }) => ({
    name,
    url,
  }));

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 10,
  totalCount: null,
};

const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case PAGE_CHANGED:
      return {
        ...state,
        queryPageIndex: payload,
      };
    case PAGE_SIZE_CHANGED:
      return {
        ...state,
        queryPageSize: payload,
      };
    case TOTAL_COUNT_CHANGED:
      return {
        ...state,
        totalCount: payload,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

function PokemonTable() {
  const [{ queryPageIndex, queryPageSize, totalCount }, dispatch] =
    React.useReducer(reducer, initialState);

  const { isLoading, error, data, isSuccess } = useQuery(
    ['pokemons', queryPageIndex, queryPageSize],
    () => fetchPokemonData(queryPageIndex, queryPageSize),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: isSuccess ? trimData(data.results) : [],
      initialState: {
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
      },
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: isSuccess ? Math.ceil(totalCount / queryPageSize) : null,
    },
    usePagination
  );

  React.useEffect(() => {
    dispatch({ type: PAGE_CHANGED, payload: pageIndex });
  }, [pageIndex]);

  React.useEffect(() => {
    dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
    gotoPage(0);
  }, [pageSize, gotoPage]);

  React.useEffect(() => {
    if (data?.count) {
      dispatch({
        type: TOTAL_COUNT_CHANGED,
        payload: data.count,
      });
    }
  }, [data?.count]);

  if (error) {
    return <p>Error</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <TableContainer>
      {isSuccess ? (
        <>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </button>{' '}
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {'>>'}
            </button>{' '}
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <span>
              | Go to page:{' '}
              <input
                type="number"
                value={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: '100px' }}
              />
            </span>{' '}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : null}
    </TableContainer>
  );
}

export default PokemonTable;

```

{% codesandbox 9wn8h module=/src/PokemonTable.js %}

[![Edit server-side-pagination-react-table-query-demo-js](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/elangobharathi/server-side-pagination-react-table-query-demo-js/tree/master/?fontsize=14&hidenavigation=1&theme=dark)

*References*:

https://github.com/tannerlinsley/react-query/discussions/736#discussioncomment-227931

https://github.com/tannerlinsley/react-table/discussions/2193

https://github.com/tannerlinsley/react-query/discussions/1113


Photo by <a href="https://unsplash.com/@jwwhitt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jordan Whitt</a> on <a href="https://unsplash.com/@jwwhitt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>