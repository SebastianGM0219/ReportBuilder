import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import store from './store'
import { Provider } from 'react-redux'
import {
  MultiBackend,
  getBackendOptions
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";

import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <SnackbarProvider maxSnack={5}>
          <App />
        </SnackbarProvider>
      </DndProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
