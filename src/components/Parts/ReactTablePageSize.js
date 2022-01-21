import { useContext } from "react";
import reactTableContext from "../../stores/react-table-context";

const ReactTablePageSize = ({ pageSize, setPageSize }) => {
  const reactTableCtx = useContext(reactTableContext);

  const setPageSizeHandler = (e) => {
    const pageSizeValue = Number(e.target.value);
    reactTableCtx.setQueryPageSize({ pageSizeChangedValue: pageSizeValue });

    setPageSize(pageSizeValue);
  };

  return (
    <select value={pageSize} onChange={setPageSizeHandler}>
      {[10, 20, 30, 40, 50].map((pageSize) => (
        <option key={pageSize} value={pageSize}>
          Show {pageSize}
        </option>
      ))}
    </select>
  );
};

export default ReactTablePageSize;
