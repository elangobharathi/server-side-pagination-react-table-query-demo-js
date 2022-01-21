import { useTable, usePagination } from "react-table";

const useReactTableInstance = (
  tableColumns,
  tableData,
  queryPageIndex,
  queryPageSize,
  queryTotalCount
) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions, // get the length of the object that exist total on the page
    pageCount, // used for counting how many page left
    gotoPage, // Used to indicate which page number we want specific to go at
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns: tableColumns,
      data: tableData,
      initialState: {
        pageIndex: queryPageIndex, // Displaying page index for incrementing by 1. It will observe where you are at in current pagination number and go to Page
        pageSize: queryPageSize // Used for the dropdown of how many rows you want to see on the page. In this example, we have 10 as default that is initiated at our ContextProvider "queryPageSize" as default state
      },
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: queryTotalCount // used for counting how many page left
    },
    usePagination
  );

  return {
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
  };
};

export default useReactTableInstance;
