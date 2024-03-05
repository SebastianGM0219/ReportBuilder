import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

import CommonToolsItem from "./CommonToolsItem";

const CommonTools = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row",boxShadow: "0px 0.5px grey", width:1 }}>
      <List
        orientation="horizontal"
        sx={{ display: "flex", flexDirection: "row", padding: 0 }}
      >
        {["Undo", "Redo"].map((text, index) => (
          <CommonToolsItem text={text} />
        ))}
        <Divider orientation="vertical" variant="middle" flexItem />
        {["Properties"].map((text, index) => (
          <CommonToolsItem text={text} />
        ))}
        <Divider orientation="vertical" variant="middle" flexItem />
        {["SaveAs"].map((text, index) => (
          <CommonToolsItem text={text} />
        ))}
        {["Print"].map((text, index) => (
          <CommonToolsItem text={text} />
        ))}
      </List>
    </Box>
  );
};

export default CommonTools;
