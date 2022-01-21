import React from "react";

const reactTableContext = React.createContext({
  tableState: [],
  setQueryPageIndex: (pageIndexValue) => {},
  setQueryPageSize: (pageSizeChangedValue) => {},
  setTotalCount: (totalCountChangedValue) => {}
});

export default reactTableContext;
