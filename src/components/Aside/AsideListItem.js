import React from "react";

import { useSelector, useDispatch } from "react-redux";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import WorkIcon from "@mui/icons-material/Work";
import InsightsIcon from "@mui/icons-material/Insights";
import AddchartIcon from "@mui/icons-material/Addchart";
import DraftsIcon from "@mui/icons-material/Drafts";

import { setCurrentAsideItem } from "../../slices/utility";

const AsideListItem = (props) => {
  let iconToRender;

  const dispatch = useDispatch();

  const currentAsideItem = useSelector(
    (state) => state.utility.currentAsideItem
  );

  switch (props.text) {
    case "Home":
      iconToRender = <HomeOutlinedIcon />;
      break;
    case "Create":
      iconToRender = <AddCircleOutlineOutlinedIcon />;
      break;
    case "Browse":
      iconToRender = <FolderOpenOutlinedIcon />;
      break;
    case "Workspaces":
      iconToRender = <WorkIcon />;
      break;
    case "Data":
      iconToRender = <InsightsIcon />;
      break;
    case "Report":
      iconToRender = <AddchartIcon />;
      break;
    case "Files":
      iconToRender = <DraftsIcon />;
      break;
    default:
      iconToRender = <HomeOutlinedIcon />;
  }

  const handleCurrentAsideItem = (event) => {
    dispatch(setCurrentAsideItem(event.currentTarget.dataset.key));
  };

  return (
    <ListItem
      key={props.text}
      data-key={props.text}
      disablePadding
      sx={{ display: "block" }}
      onClick={handleCurrentAsideItem}
      selected = {props.text === currentAsideItem}
    >
      <ListItemButton
        sx={{
          minHeight: 60,
          justifyContent: "center",
          px: 2.5,
          display: "flex",
          flexDirection: "column",
        }}
        id={props.text}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
          }}
        >
          {iconToRender}
        </ListItemIcon>
        <ListItemText
          primary={props.text}
          primaryTypographyProps={{ fontSize: "0.7rem" }}
          sx={{ justifyContent: "right" }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default AsideListItem;
