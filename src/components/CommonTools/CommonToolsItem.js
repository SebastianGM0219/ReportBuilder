import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import PrintIcon from "@mui/icons-material/Print";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { pivot, saveLog } from "../../slices/report";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { renderToString } from "react-dom/server";
import ExportDialog from "../Dialogs/ExportDialog";

const CommonToolsItem = (props) => {
  const dispatch = useDispatch();

  const pivotInfo = useSelector((state) => state.report.reportPivotInfo);
  // const pivotResult = useSelector((state) => state.report.reportResultOfPivot);

  const { rows, cols } = pivotInfo;
  const filters = pivotInfo.pages;

  const [displayData, setDisplayData] = React.useState("");
  const [exportDialog, setExportDialog] = React.useState(false);

  const reportRows = useSelector((state) => state.report.reportRows);
  const reportCols = useSelector((state) => state.report.reportCols);
  const reportPages = useSelector((state) => state.report.reportPages);
  const reportExpandedRows = useSelector(
    (state) => state.report.reportExpandedRows
  );
  const reportExpandedCols = useSelector(
    (state) => state.report.reportExpandedCols
  );
  const reportExpandedPages = useSelector(
    (state) => state.report.reportExpandedPages
  );
  const reportTableData = useSelector((state) => state.report.reportTableData);
  const reportDatabase = useSelector((state) => state.report.reportDatabase);
  const saveLogDispatch = () => {
    const user_id = "0";
    const time = new Date();
    console.log("CommonTools time", time);
    const database = reportDatabase;
    const log = {
      rows: reportRows,
      cols: reportCols,
      pages: reportPages,
      expandedRows: reportExpandedRows,
      expandedCols: reportExpandedCols,
      expandedPages: reportExpandedPages,
      tableData: reportTableData,
      pivotInfo: pivotInfo,
    };
    dispatch(
      saveLog({ user_id: user_id, time: time, database: database, log: log })
    );
  };

  const handleExportDialogOK = () => {
    setExportDialog(false);
  };

  const handleExportDialogClose = () => {
    setExportDialog(false);
  };

  let text;
  if (filters !== undefined && filters.length > 0) {
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
  }
  let iconToRender;
  let itemText = (
    <ListItemText
      primary={props.text}
      primaryTypographyProps={{ fontSize: "0.7rem" }}
      sx={{ justifyContent: "center", whiteSpace: "nowrap" }}
    />
  );

  let handleClick = () => {
    console.log("CommonTools", props.text, "clicked!");
  };

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
                <MenuItem
                  onClick={() => {
                    popupState.close();
                  }}
                >
                  <Button
                    onClick={() => {
                      saveLogDispatch();
                      dispatch(pivot({ rows, cols, filters: filters })).then(
                        (result) => {
                          let pivotResult = result.payload.Return;
                          let colParentsCount = {};
                          let rowHeaderIndex = [];

                          let modifiedData = [];

                          if (
                            rows !== undefined &&
                            cols !== undefined &&
                            filters !== undefined
                          ) {
                            //Formatting data for display

                            if (
                              pivotResult.rows !== undefined &&
                              pivotResult.columns !== undefined
                            ) {
                              let resultRows = pivotResult.rows;
                              let resultCols = pivotResult.columns;
                              let resultData = pivotResult.data;
                              //For RowHeader

                              resultRows.forEach((row, index) => {
                                const key = Object.keys(row)[1];
                                if (row.parent.member === row[key])
                                  rowHeaderIndex.push(index + 2);
                              });

                              //Maintain orders of columns
                              //For ColumnHeader
                              let colOrder = [];

                              colParentsCount = resultCols.reduce(
                                (acc, curr) => {
                                  const { dimension, member, relation } =
                                    curr.parent;
                                  const key = `${dimension}-${member}-${relation}`;
                                  if (colOrder.indexOf(key) < 0)
                                    colOrder.push(key);

                                  acc[key] = acc[key] || {
                                    count: 0,
                                    member: "",
                                  };
                                  acc[key].count++;
                                  acc[key].member = member;

                                  return acc;
                                },
                                {}
                              );

                              colParentsCount = colOrder.forEach((combination) => ({
                                key: combination,
                                value: colParentsCount[combination] || {
                                  count: 0,
                                  member: new Set(),
                                },
                              }));

                              resultRows = resultRows.forEach((row) => {
                                const key = Object.keys(row)[1];
                                return row[key];
                              });
                              resultCols = resultCols.forEach((col) => {
                                const key = Object.keys(col)[1];
                                return col[key];
                              });
                              resultCols.unshift("");

                              resultRows.forEach((row, rowIndex) => {
                                modifiedData.push([
                                  row,
                                  ...resultData[rowIndex],
                                ]);
                              });
                              modifiedData.unshift(resultCols);
                            }
                          }
                          const doc = new jsPDF();
                          let header = [""];
                          if (
                            colParentsCount !== undefined &&
                            colParentsCount.length > 0
                          )
                            colParentsCount.forEach((item) => {
                              const { count, member } = item.value;
                              header.push({
                                content: member,
                                styles: { halign: "center" },
                                colSpan: count,
                              });
                            });
                          modifiedData.unshift(header);

                          if (
                            filters !== undefined &&
                            filters.length > 0 &&
                            filters[0][0].id !== undefined
                          )
                            doc.text(
                              `${filters[0][0].id.toUpperCase()}: ${text}`,
                              15,
                              10
                            );
                          console.log("modified Length", modifiedData.length);
                          let lastRow = modifiedData.length - 1;
                          doc.autoTable({
                            body: modifiedData,
                            theme: "plain",
                            didParseCell: function (modifiedData) {
                              if (
                                rowHeaderIndex.indexOf(
                                  modifiedData.row.index
                                ) !== -1
                              ) {
                                modifiedData.cell.styles.fillColor = [
                                  222, 218, 223,
                                ];
                                modifiedData.cell.styles.lineWidth = {
                                  left: 0.5,
                                  right: 0.5,
                                  top: 0.5,
                                  bottom: 0.5,
                                };
                              } else {
                                modifiedData.cell.styles.lineWidth = {
                                  left: 0.5,
                                  right: 0.5,
                                  top: 0,
                                  bottom: 0,
                                };
                              }
                              if (
                                modifiedData.row.index === 0 ||
                                modifiedData.row.index === 1
                              ) {
                                modifiedData.cell.styles.lineWidth = {
                                  left: 0.5,
                                  right: 0.5,
                                  top: 0.5,
                                  bottom: 0.5,
                                };
                              }
                              if (modifiedData.row.index === lastRow) {
                                modifiedData.cell.styles.lineWidth = {
                                  left: 0.5,
                                  right: 0.5,
                                  bottom: 0.5,
                                };
                              }
                            },
                          });
                          doc.save("data.pdf");
                          modifiedData.shift();
                        }
                      );
                    }}
                  >
                    PDF
                  </Button>
                </MenuItem>
                <MenuItem onClick={popupState.close}>
                  <Button
                    onClick={() => {
                      saveLogDispatch();
                      dispatch(pivot({ rows, cols, filters: filters })).then(
                        (result) => {
                          let pivotResult = result.payload.Return;
                          let colParentsCount = {};
                          let rowHeaderIndex = [];

                          let modifiedData = [];

                          if (
                            rows !== undefined &&
                            cols !== undefined &&
                            filters !== undefined
                          ) {
                            //Formatting data for display
                            if (
                              pivotResult.rows !== undefined &&
                              pivotResult.columns !== undefined
                            ) {
                              let resultRows = pivotResult.rows;
                              let resultCols = pivotResult.columns;
                              let resultData = pivotResult.data;

                              //For RowHeader
                              resultRows.forEach((row, index) => {
                                const key = Object.keys(row)[1];
                                if (row.parent.member === row[key])
                                  rowHeaderIndex.push(index + 2);
                              });

                              //Maintain orders of columns
                              //For ColumnHeader
                              let colOrder = [];

                              colParentsCount = resultCols.reduce(
                                (acc, curr) => {
                                  const { dimension, member, relation } =
                                    curr.parent;
                                  const key = `${dimension}-${member}-${relation}`;
                                  if (colOrder.indexOf(key) < 0)
                                    colOrder.push(key);

                                  acc[key] = acc[key] || {
                                    count: 0,
                                    member: "",
                                  };
                                  acc[key].count++;
                                  acc[key].member = member;

                                  return acc;
                                },
                                {}
                              );

                              colParentsCount = colOrder.forEach((combination) => ({
                                key: combination,
                                value: colParentsCount[combination] || {
                                  count: 0,
                                  member: new Set(),
                                },
                              }));

                              resultRows = resultRows.forEach((row) => {
                                const key = Object.keys(row)[1];
                                return row[key];
                              });
                              resultCols = resultCols.forEach((col) => {
                                const key = Object.keys(col)[1];
                                return col[key];
                              });
                              resultCols.unshift("");

                              resultRows.forEach((row, rowIndex) => {
                                console.log(
                                  "resultData[rowIndex]",
                                  resultData[rowIndex]
                                );
                                modifiedData.push([
                                  row,
                                  ...resultData[rowIndex],
                                ]);
                              });
                              modifiedData.unshift(resultCols);
                            }
                          }
                          let htmlFile = (
                            <html>
                              <body style={{ padding: "20px" }}>
                                {filters !== undefined &&
                                filters.length > 0 &&
                                filters[0][0].id !== undefined ? (
                                  <h3>{`${filters[0][0].id.toUpperCase()}: ${text}`}</h3>
                                ) : (
                                  <></>
                                )}
                                <br />
                                <table style={{ borderCollapse: "collapse" }}>
                                  <thead>
                                    <tr>
                                      <th
                                        style={{
                                          backgroundColor: "rgb(245, 245, 245)",
                                          borderTop:
                                            "1px solid rgb(199, 199, 199)",
                                          borderBottom:
                                            "1px solid rgb(199, 199, 199)",
                                          borderLeft:
                                            "1px solid rgb(199, 199, 199)",
                                          borderRight:
                                            "1px solid rgb(199, 199, 199)",
                                        }}
                                      ></th>
                                      {colParentsCount !== undefined &&
                                      colParentsCount.length > 0 ? (
                                        colParentsCount.map((item, index) => {
                                          return (
                                            <th
                                              style={{
                                                backgroundColor:
                                                  "rgb(245, 245, 245)",
                                                borderTop:
                                                  "1px solid rgb(199, 199, 199)",
                                                borderBottom:
                                                  "1px solid rgb(199, 199, 199)",
                                                borderLeft:
                                                  "1px solid rgb(199, 199, 199)",
                                                borderRight:
                                                  "1px solid rgb(199, 199, 199)",
                                              }}
                                              colSpan={item.value.count}
                                              key={index}
                                            >
                                              {item.value.member}
                                            </th>
                                          );
                                        })
                                      ) : (
                                        <></>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody
                                    style={{
                                      borderBottom:
                                        "1px solid rgb(199, 199, 199)",
                                    }}
                                  >
                                    {modifiedData.map((data, index) => {
                                      return (
                                        <tr
                                          style={{ textAlign: "center" }}
                                          key={index}
                                        >
                                          {data.map((dataItem) => {
                                            if (
                                              rowHeaderIndex.indexOf(
                                                index + 1
                                              ) !== -1
                                            )
                                              return (
                                                <td
                                                  style={{
                                                    backgroundColor:
                                                      "rgb(222, 217, 222)",
                                                    borderTop:
                                                      "1px solid rgb(199, 199, 199)",
                                                    borderBottom:
                                                      "1px solid rgb(199, 199, 199)",
                                                    borderLeft:
                                                      "1px solid rgb(199, 199, 199)",
                                                    borderRight:
                                                      "1px solid rgb(199, 199, 199)",
                                                  }}
                                                >
                                                  {dataItem}
                                                </td>
                                              );
                                            else
                                              return (
                                                <td
                                                  style={{
                                                    borderLeft:
                                                      "1px solid rgb(199, 199, 199)",
                                                    borderRight:
                                                      "1px solid rgb(199, 199, 199)",
                                                  }}
                                                >
                                                  {dataItem}
                                                </td>
                                              );
                                          })}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </body>
                            </html>
                          );
                          htmlFile = renderToString(htmlFile);

                          const blob = new Blob([htmlFile], {
                            type: "text/html",
                          });

                          // Create a URL for the blob
                          const url = URL.createObjectURL(blob);

                          // Create a link and trigger the download
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = "generated_file.html";
                          document.body.appendChild(link);
                          link.click();

                          // Clean up
                          document.body.removeChild(link);
                          URL.revokeObjectURL(url);
                        }
                      );
                    }}
                  >
                    HTML
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
    case "Export":
      iconToRender = <PrintIcon />;
      handleClick = () => {
        dispatch(pivot({ rows, cols, filters: filters })).then((result) => {
          let pivotResult = result.payload.Return;
          let colParentsCount = {};
          let rowHeaderIndex = [];

          let modifiedData = [];

          if (
            rows !== undefined &&
            cols !== undefined &&
            filters !== undefined
          ) {
            //Formatting data for display
            if (
              pivotResult.rows !== undefined &&
              pivotResult.columns !== undefined
            ) {
              let resultRows = pivotResult.rows;
              let resultCols = pivotResult.columns;
              let resultData = pivotResult.data;

              //For RowHeader
              resultRows.forEach((row, index) => {
                const key = Object.keys(row)[1];
                if (row.parent.member === row[key])
                  rowHeaderIndex.push(index + 2);
              });

              //Maintain orders of columns
              //For ColumnHeader
              let colOrder = [];

              colParentsCount = resultCols.reduce((acc, curr) => {
                const { dimension, member, relation } = curr.parent;
                const key = `${dimension}-${member}-${relation}`;
                if (colOrder.indexOf(key) < 0) colOrder.push(key);

                acc[key] = acc[key] || {
                  count: 0,
                  member: "",
                };
                acc[key].count++;
                acc[key].member = member;

                return acc;
              }, {});

              colParentsCount = colOrder.map((combination) => ({
                key: combination,
                value: colParentsCount[combination] || {
                  count: 0,
                  member: new Set(),
                },
              }));

              resultRows = resultRows.map((row) => {
                const key = Object.keys(row)[1];
                return row[key];
              });
              resultCols = resultCols.map((col) => {
                const key = Object.keys(col)[1];
                return col[key];
              });
              resultCols.unshift("");

              resultRows.forEach((row, rowIndex) => {
                modifiedData.push([row, ...resultData[rowIndex]]);
              });
              modifiedData.unshift(resultCols);
            }
          }
          let htmlFile = (
            <body style={{ padding: "20px" }}>
              {filters !== undefined &&
              filters.length > 0 &&
              filters[0][0].id !== undefined ? (
                <h3>{`${filters[0][0].id.toUpperCase()}: ${text}`}</h3>
              ) : (
                <></>
              )}
              <br />
              <table style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        backgroundColor: "rgb(245, 245, 245)",
                        borderTop: "1px solid rgb(199, 199, 199)",
                        borderBottom: "1px solid rgb(199, 199, 199)",
                        borderLeft: "1px solid rgb(199, 199, 199)",
                        borderRight: "1px solid rgb(199, 199, 199)",
                      }}
                    ></th>
                    {colParentsCount !== undefined &&
                    colParentsCount.length > 0 ? (
                      colParentsCount.map((item) => {
                        return (
                          <th
                            style={{
                              backgroundColor: "rgb(245, 245, 245)",
                              borderTop: "1px solid rgb(199, 199, 199)",
                              borderBottom: "1px solid rgb(199, 199, 199)",
                              borderLeft: "1px solid rgb(199, 199, 199)",
                              borderRight: "1px solid rgb(199, 199, 199)",
                              textAlign: "center"
                            }}
                            colSpan={item.value.count}
                          >
                            {item.value.member}
                          </th>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </tr>
                </thead>
                <tbody
                  style={{
                    borderBottom: "1px solid rgb(199, 199, 199)",
                  }}
                >
                  {modifiedData.map((data, index) => {
                    return (
                      <tr style={{ textAlign: "center" }} key={index}>
                        {data.map((dataItem) => {
                          if (rowHeaderIndex.indexOf(index + 1) !== -1)
                            return (
                              <td
                                style={{
                                  backgroundColor: "rgb(222, 217, 222)",
                                  borderTop: "1px solid rgb(199, 199, 199)",
                                  borderBottom: "1px solid rgb(199, 199, 199)",
                                  borderLeft: "1px solid rgb(199, 199, 199)",
                                  borderRight: "1px solid rgb(199, 199, 199)",
                                }}
                              >
                                {dataItem ? dataItem : '-'}
                              </td>
                            );
                          else
                            return (
                              <td
                                style={{
                                  borderLeft: "1px solid rgb(199, 199, 199)",
                                  borderRight: "1px solid rgb(199, 199, 199)",
                                }}
                              >
                                {dataItem ? dataItem : '-'}
                              </td>
                            );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p></p>
            </body>
          );
          htmlFile = renderToString(htmlFile);
          setDisplayData(htmlFile)
          setExportDialog(true);
        });
      };
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
        onClick={handleClick}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
          }}
        >
          {iconToRender}
        </ListItemIcon>
        {itemText}
      </ListItemButton>
      <ExportDialog
        open={exportDialog}
        data={displayData}
        handleExportDialogClose={handleExportDialogClose}
        handleExportDialogOK={handleExportDialogOK}
      />
    </ListItem>
  );
};

export default CommonToolsItem;
