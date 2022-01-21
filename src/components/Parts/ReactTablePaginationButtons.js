import { useEffect, useContext } from "react";
import reactTableContext from "../../stores/react-table-context";

const ReactTablePaginationButtons = ({
  gotoPage,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageOptions
}) => {
  const reactTableCtx = useContext(reactTableContext);

  useEffect(() => {
    reactTableCtx.setQueryPageIndex({ pageIndexValue: pageIndex });
  }, [pageIndex]);

  return (
    <>
      <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
        {"<<"}
      </button>{" "}
      <button onClick={() => previousPage()} disabled={!canPreviousPage}>
        {"<"}
      </button>{" "}
      <button onClick={() => nextPage()} disabled={!canNextPage}>
        {">"}
      </button>{" "}
      <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
        {">>"}
      </button>{" "}
      <span>
        Page{" "}
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>{" "}
      </span>
    </>
  );
};

export default ReactTablePaginationButtons;
