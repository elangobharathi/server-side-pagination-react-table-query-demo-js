import { useReducer } from "react";
import ReactTableContext from "./react-table-context";

const ACTION = {
  PAGE_CHANGED: "page-changed",
  PAGE_SIZE_CHANGED: "page-sized-changed",
  TOTAL_COUNT_CHANGED: "total-count-changed"
};

const defaultState = {
  queryPageIndex: 0,
  queryPageSize: 10,
  queryTotalCount: 0
};

const tableReducer = (state, action) => {
  switch (action.type) {
    case ACTION.PAGE_CHANGED:
      return { ...state, queryPageIndex: action.pageIndexValue };
    case ACTION.PAGE_SIZE_CHANGED:
      return { ...state, queryPageSize: action.pageSizeChangedValue };
    case ACTION.TOTAL_COUNT_CHANGED:
      return { ...state, queryTotalCount: action.totalCountChangedValue };
    default:
      return state;
  }
};

const ReactTableContextProvider = ({ children }) => {
  const [tableState, dispatchTableAction] = useReducer(
    tableReducer,
    defaultState
  );

  const setQueryPageIndexHandler = ({ pageIndexValue }) => {
    dispatchTableAction({
      type: ACTION.PAGE_CHANGED,
      pageIndexValue
    });
  };

  const setQueryPageSizeHandler = ({ pageSizeChangedValue }) => {
    dispatchTableAction({
      type: ACTION.PAGE_SIZE_CHANGED,
      pageSizeChangedValue
    });
  };

  const setTotalCountHandler = ({ totalCountChangedValue }) => {
    dispatchTableAction({
      type: ACTION.TOTAL_COUNT_CHANGED,
      totalCountChangedValue
    });
  };

  const contextValue = {
    tableState: tableState,
    setQueryPageIndex: setQueryPageIndexHandler,
    setQueryPageSize: setQueryPageSizeHandler,
    setTotalCount: setTotalCountHandler
  };

  return (
    <ReactTableContext.Provider value={contextValue}>
      {children}
    </ReactTableContext.Provider>
  );
};

export default ReactTableContextProvider;
