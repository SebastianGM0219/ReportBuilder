import * as React from "react";
import { styled } from "@mui/material/styles";

import { useSelector } from "react-redux";

import {
  Box,
  Toolbar,
  Typography,
  CssBaseline
} from "@mui/material";

import MuiAppBar from "@mui/material/AppBar";

import Data from "./components/Data";
import Report from "./components/Report";
import Aside from "./components/Aside";

import "@progress/kendo-theme-default/dist/all.css";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const App = () => {
  const currentAsideItem = useSelector(
    (state) => state.utility.currentAsideItem
  );

  let workSpace;
  switch (currentAsideItem) {
    case "Data":
      workSpace = <Data />;
      break;
    case "Report":
      workSpace = <Report />;
      break;
    default:
      workSpace = <div></div>;
      break;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Data Cube
          </Typography>
        </Toolbar>
      </AppBar>
      <Aside />
      <Box component="main" sx={{ flexGrow: 1, mt: "55px" }}>
        {workSpace}
      </Box>
    </Box>
  );
};

export default App;
