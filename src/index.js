import React from "react";
import { createRoot } from 'react-dom/client';
import "./index.css";
import store from "./store";
import { Provider } from "react-redux";
import { MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CustomSnackbarProvider } from "./CustomSnackbarProvider"; // Import updated CustomSnackbarProvider
import { SnackbarProvider } from "notistack";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SnackbarProvider maxSnack={5}>
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <CustomSnackbarProvider>
            <App />
          </CustomSnackbarProvider>
        </DndProvider>
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
