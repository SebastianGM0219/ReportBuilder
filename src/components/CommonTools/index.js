import * as React from "react";
import { Box, List, Divider } from "@mui/material";

import CommonToolsItem from "./CommonToolsItem";

const CommonTools = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        boxShadow: "0px 0.5px grey",
        width: 1,
      }}
    >
      <List
        orientation="horizontal"
        sx={{ display: "flex", flexDirection: "row", padding: 0 }}
      >
        {["Undo", "Redo"].map((text, index) => (
          <CommonToolsItem text={text} key={text} />
        ))}
        <Divider orientation="vertical" variant="middle" flexItem />
        {["Properties"].map((text, index) => (
          <CommonToolsItem text={text} key={text} />
        ))}
        <Divider orientation="vertical" variant="middle" flexItem />
        {["SaveAs", "Print", "Export"].map((text, index) => (
          <CommonToolsItem text={text} key={text} />
        ))}
      </List>
    </Box>
  );
};

export default CommonTools;
