import { useMemo, useContext } from "react";
import { usePokemonData } from "./hooks/usePokemon";
import useReactTableInstance from "./hooks/useReactTableInstance";
import reactTableContext from "./stores/react-table-context";
import TableContainer from "./components/UI/TableContainer";
import ReactTable from "./components/Parts/ReactTable";
import ReactPaginationButtons from "./components/Parts/ReactTablePaginationButtons";
import ReactTableGoToPage from "./components/Parts/ReactTableGoToPage";
import ReactTablePageSize from "./components/Parts/ReactTablePageSize";
import POKEMON_COLUMN_DATA from "./react-table-data/pokemon-column-data";

function App() {
  const reactTableCtx = useContext(reactTableContext);
  const {
    queryPageIndex,
    queryPageSize,
    queryTotalCount
  } = reactTableCtx.tableState;

  const queryPageCount = Math.ceil(queryTotalCount / queryPageSize);

  const { data: POKEMON_DATA, isSuccess, error, isLoading } = usePokemonData(
    queryPageIndex,
    queryPageCount
  );

  const tableColumns = useMemo(() => POKEMON_COLUMN_DATA, []);
  const tableData = useMemo(() => POKEMON_DATA, [POKEMON_DATA]);

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
    pageIndex,
    pageSize
  } = useReactTableInstance(
    tableColumns,
    tableData,
    queryPageIndex,
    queryPageSize,
    queryPageCount
  );

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
          <ReactTable
            getTableProps={getTableProps}
            headerGroups={headerGroups}
            getTableBodyProps={getTableBodyProps}
            page={page}
            prepareRow={prepareRow}
          />
          <div className="pagination">
            <ReactPaginationButtons
              gotoPage={gotoPage}
              canPreviousPage={canPreviousPage}
              previousPage={previousPage}
              nextPage={nextPage}
              canNextPage={canNextPage}
              pageCount={pageCount}
              pageIndex={pageIndex}
              pageOptions={pageOptions}
            />

            <ReactTableGoToPage pageIndex={pageIndex} gotoPage={gotoPage} />

            <ReactTablePageSize pageSize={pageSize} setPageSize={setPageSize} />
          </div>
        </>
      ) : null}
    </TableContainer>
  );
}

export default App;
