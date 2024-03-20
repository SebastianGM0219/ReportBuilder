import React, { createContext, useContext } from "react";
import { useSnackbar } from "notistack";

const SnackbarContext = createContext();

export const useCustomSnackbar = () => {
  return useContext(SnackbarContext);
};

export const CustomSnackbarProvider = ({ children, maxSnack }) => {
  const { enqueueSnackbar } = useSnackbar();

  const snackbarWithStyle = (content, variant) => {
    enqueueSnackbar(content, {
      variant: variant,
      style: { width: "350px" },
      autoHideDuration: 3000,
      anchorOrigin: { vertical: "top", horizontal: "right" },
    });
  };

  return (
    <SnackbarContext.Provider value={snackbarWithStyle}>
      {children}
    </SnackbarContext.Provider>
  );
};
