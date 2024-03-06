import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import PrintIcon from "@mui/icons-material/Print";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSelector, useDispatch } from "react-redux";
import { pivot } from "../../slices/report";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CommonToolsItem = (props) => {
  const dispatch = useDispatch();

  const pivotInfo = useSelector(state => state.report.reportPivotInfo);
  const pivotResult = useSelector(state => state.report.reportResultOfPivot);
  
  const { rows, cols } = pivotInfo;
  const filters = pivotInfo.pages;
  // console.log("CommonToolsItem pivotInfo input test", filters[0])
  let text;
  switch (filters[0].member) {
    case "IChildren":
      text = `Children of ${filters[0][0].content}(Inclusive)`;
      break;
    case "Children":
      text = `Children of ${filters[0][0].content}`;
      break;
    case "IDescendants":
      text = `Descendants of ${filters[0][0].content}(Inclusive)`;
      break;
    case "Descendants":
      text = `Descendants of ${filters[0][0].content}`;
      break;
    default:
      text = filters[0][0].content;
      break;
  }
  
  let iconToRender;
  let itemText = (
    <ListItemText
      primary={props.text}
      primaryTypographyProps={{ fontSize: "0.7rem" }}
      sx={{ justifyContent: "center", whiteSpace: "nowrap" }}
    />
  );

  switch (props.text) {
    case "Undo":
      iconToRender = <UndoIcon sx={{ color: "#F9B13C" }} />;
      break;
    case "Redo":
      iconToRender = <RedoIcon sx={{ color: "#99C7EF" }} />;
      break;
    case "Properties":
      iconToRender = <SettingsIcon />;
      itemText = (
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              <Button
                {...bindTrigger(popupState)}
                sx={{
                  fontSize: "0.7rem",
                  color: "inherit",
                  padding: 0,
                  fontWeight: 400,
                  textTransform: "none",
                }}
                endIcon={<ArrowDropDownIcon />}
              >
                Properties
              </Button>
              <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={popupState.close}>Profile</MenuItem>
                <MenuItem onClick={popupState.close}>My account</MenuItem>
                <MenuItem onClick={popupState.close}>Logout</MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
      );
      break;
    case "SaveAs":
      iconToRender = <SaveAsIcon />;
      itemText = (
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              <Button
                {...bindTrigger(popupState)}
                sx={{
                  fontSize: "0.7rem",
                  color: "inherit",
                  padding: 0,
                  fontWeight: 400,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
                endIcon={<ArrowDropDownIcon />}
              >
                Save As
              </Button>
              <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={popupState.close}>
                  <Button
                    onClick={() => {
                      dispatch(pivot({rows, cols, filters: filters}));
                      const doc = new jsPDF()
                      doc.text(`${filters[0][0].id.toUpperCase()}: ${text}`, 15, 10)
                      doc.autoTable({html: "#export-data", startY: 30, startX: 30})
                      doc.save("data.pdf")
                    }}
                  >
                    PDF
                  </Button>
                </MenuItem>
                <MenuItem onClick={popupState.close}>
                  <Button
                    onClick={() => {
                      dispatch(pivot({rows, cols, filters: filters}));
                    }}
                  >
                    Excel
                  </Button>
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
      );
      break;
    case "Print":
      iconToRender = <PrintIcon />;
      break;
    default:
      iconToRender = <HomeOutlinedIcon />;
  }

  return (
    <ListItem key={props.text} disablePadding>
      <ListItemButton
        sx={{
          minHeight: 60,
          justifyContent: "center",
          px: 2.5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
          }}
        >
          {iconToRender}
        </ListItemIcon>
        {itemText}
        {/* <ListItemText
          primary={props.text}
          primaryTypographyProps={{ fontSize: "0.7rem" }}
          sx={{ justifyContent: "center" }}
        /> */}
      </ListItemButton>
      {Object.keys(pivotResult).length !== 0 ?
        <table id="export-data" style={{display: 'none'}}>
          <thead>
            <tr>
              <th></th>
              {pivotResult.columns.map((col) => {
                const key = Object.keys(col)[0];
                return <th>{col[key]}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {pivotResult.rows.map((row, rowIndex) => {
              const key = Object.keys(row)[0];
              return (
                <tr>
                  <th>{row[key]}</th>
                  {pivotResult.columns.map((col, colIndex) => {
                    return <th>{pivotResult.data[rowIndex][colIndex]}</th>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table> :
        <></>
      }
    </ListItem>
  );
};

export default CommonToolsItem;