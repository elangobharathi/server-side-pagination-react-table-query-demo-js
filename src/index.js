import React from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClientProvider, QueryClient } from "react-query";
import ReactDOM from "react-dom";
import App from "./App";
import ReactTableContextProvider from "./stores/ReactTableContextProvider";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactTableContextProvider>
        <App />
      </ReactTableContextProvider>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
