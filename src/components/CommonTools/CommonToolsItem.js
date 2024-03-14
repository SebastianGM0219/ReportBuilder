import React, { useRef } from "react";
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
import { saveAs } from "file-saver";
import XLSX from "xlsx";
import { colors } from "@mui/material";
import { renderToString } from "react-dom/server";
import { render } from "@testing-library/react";

const CommonToolsItem = (props) => {
  const dispatch = useDispatch();

  const exportHTMLRef = useRef(null);

  const pivotInfo = useSelector((state) => state.report.reportPivotInfo);
  // const pivotResult = useSelector((state) => state.report.reportResultOfPivot);

  const { rows, cols } = pivotInfo;
  const filters = pivotInfo.pages;

  const [displayData, setDisplayData] = React.useState([]);

  let rowParentsCount = {};
  // let colParentsCount = {};
  // let rowHeaderIndex = [];

  // let modifiedData = [];
  // // React.useEffect(() => {

  // if (rows !== undefined && cols !== undefined && filters !== undefined) {
  //   //Formatting data for display
  //   console.log("rows, cols, filters", rows, cols, filters);
  //   console.log("pivotResults", pivotResult);

  //   if (pivotResult.rows !== undefined && pivotResult.columns !== undefined) {
  //     let resultRows = pivotResult.rows;
  //     let resultCols = pivotResult.columns;
  //     let resultData = pivotResult.data;

  //     console.log("resultrows,......!!!!!!!!", pivotResult.rows);

  //     //For RowHeader

  //     resultRows.map((row, index) => {
  //       const key = Object.keys(row)[1];
  //       if (row.parent.member === row[key]) rowHeaderIndex.push(index + 2);
  //     });

  //     //Maintain orders of columns
  //     //For ColumnHeader
  //     let colOrder = [];

  //     colParentsCount = resultCols.reduce((acc, curr) => {
  //       const { dimension, member, relation } = curr.parent;
  //       const key = `${dimension}-${member}-${relation}`;
  //       if (colOrder.indexOf(key) < 0) colOrder.push(key);

  //       acc[key] = acc[key] || { count: 0, member: "" };
  //       acc[key].count++;
  //       acc[key].member = member;

  //       return acc;
  //     }, {});

  //     colParentsCount = colOrder.map((combination) => ({
  //       key: combination,
  //       value: colParentsCount[combination] || { count: 0, member: new Set() },
  //     }));

  //     resultRows = resultRows.map((row) => {
  //       const key = Object.keys(row)[1];
  //       // console.log("sfsdfsdf",row)
  //       return row[key];
  //     });
  //     resultCols = resultCols.map((col) => {
  //       const key = Object.keys(col)[1];
  //       // console.log("sfsdfsdf",col)
  //       return col[key];
  //     });
  //     resultCols.unshift("");

  //     resultRows.map((row, rowIndex) => {
  //       console.log("resultData[rowIndex]", resultData[rowIndex]);
  //       // resultData[rowIndex].unshift(1);
  //       modifiedData.push([row, ...resultData[rowIndex]]);
  //     });
  //     // resultCols.push(["", "Total", "2016-2020"])
  //     modifiedData.unshift(resultCols);
  //   }
  // }
  // setDisplayData(modifiedData);
  // console.log("CommonToolsItem pivotInfo input test", filters[0])
  // }, [pivotInfo]);

  let text;
  if (filters !== undefined && filters.length > 0) {
    // console.log(filters[0])
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
  // console.log("text for page property:###########", text)
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
                <MenuItem
                  onClick={() => {
                    popupState.close();
                  }}
                >
                  <Button
                    onClick={() => {
                      dispatch(pivot({ rows, cols, filters: filters })).then(
                        (result) => {
                          let pivotResult = result.payload.Return;
                          let colParentsCount = {};
                          let rowHeaderIndex = [];

                          let modifiedData = [];
                          // React.useEffect(() => {

                          if (
                            rows !== undefined &&
                            cols !== undefined &&
                            filters !== undefined
                          ) {
                            //Formatting data for display
                            console.log(
                              "rows, cols, filters",
                              rows,
                              cols,
                              filters
                            );
                            console.log("pivotResults", pivotResult);

                            if (
                              pivotResult.rows !== undefined &&
                              pivotResult.columns !== undefined
                            ) {
                              let resultRows = pivotResult.rows;
                              let resultCols = pivotResult.columns;
                              let resultData = pivotResult.data;

                              console.log(
                                "resultrows,......!!!!!!!!",
                                pivotResult.rows
                              );

                              //For RowHeader

                              resultRows.map((row, index) => {
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

                              colParentsCount = colOrder.map((combination) => ({
                                key: combination,
                                value: colParentsCount[combination] || {
                                  count: 0,
                                  member: new Set(),
                                },
                              }));

                              resultRows = resultRows.map((row) => {
                                const key = Object.keys(row)[1];
                                // console.log("sfsdfsdf",row)
                                return row[key];
                              });
                              resultCols = resultCols.map((col) => {
                                const key = Object.keys(col)[1];
                                // console.log("sfsdfsdf",col)
                                return col[key];
                              });
                              resultCols.unshift("");

                              resultRows.map((row, rowIndex) => {
                                console.log(
                                  "resultData[rowIndex]",
                                  resultData[rowIndex]
                                );
                                // resultData[rowIndex].unshift(1);
                                modifiedData.push([
                                  row,
                                  ...resultData[rowIndex],
                                ]);
                              });
                              // resultCols.push(["", "Total", "2016-2020"])
                              modifiedData.unshift(resultCols);
                            }
                          }
                          const doc = new jsPDF();
                          let header = [""];
                          if (
                            colParentsCount !== undefined &&
                            colParentsCount.length > 0
                          )
                            colParentsCount.map((item) => {
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
                      dispatch(pivot({ rows, cols, filters: filters })).then(
                        (result) => {
                          let pivotResult = result.payload.Return;
                          let colParentsCount = {};
                          let rowHeaderIndex = [];

                          let modifiedData = [];
                          // React.useEffect(() => {

                          if (
                            rows !== undefined &&
                            cols !== undefined &&
                            filters !== undefined
                          ) {
                            //Formatting data for display
                            console.log(
                              "rows, cols, filters",
                              rows,
                              cols,
                              filters
                            );
                            console.log("pivotResults", pivotResult);

                            if (
                              pivotResult.rows !== undefined &&
                              pivotResult.columns !== undefined
                            ) {
                              let resultRows = pivotResult.rows;
                              let resultCols = pivotResult.columns;
                              let resultData = pivotResult.data;

                              console.log(
                                "resultrows,......!!!!!!!!",
                                pivotResult.rows
                              );

                              //For RowHeader

                              resultRows.map((row, index) => {
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

                              colParentsCount = colOrder.map((combination) => ({
                                key: combination,
                                value: colParentsCount[combination] || {
                                  count: 0,
                                  member: new Set(),
                                },
                              }));

                              resultRows = resultRows.map((row) => {
                                const key = Object.keys(row)[1];
                                // console.log("sfsdfsdf",row)
                                return row[key];
                              });
                              resultCols = resultCols.map((col) => {
                                const key = Object.keys(col)[1];
                                // console.log("sfsdfsdf",col)
                                return col[key];
                              });
                              resultCols.unshift("");

                              resultRows.map((row, rowIndex) => {
                                console.log(
                                  "resultData[rowIndex]",
                                  resultData[rowIndex]
                                );
                                // resultData[rowIndex].unshift(1);
                                modifiedData.push([
                                  row,
                                  ...resultData[rowIndex],
                                ]);
                              });
                              // resultCols.push(["", "Total", "2016-2020"])
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
                                        colParentsCount.map((item) => {
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
                                  <tbody style={{borderBottom: "1px solid rgb(199, 199, 199)"}}>
                                    {modifiedData.map((data, index) => {
                                      return (
                                        <tr style={{ textAlign: "center" }}>
                                          {data.map((dataItem) => {
                                            console.log(
                                              "modifiedData dataItem-------",
                                              dataItem
                                            );
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

                    // // modifiedData.shift("", "Total", "2016-2020");
                    // console.log(
                    //   "exportHTMLRef",
                    //   exportHTMLRef.current.outerHTML
                    // );

                    // let htmlFile = exportHTMLRef.current.outerHTML;
                    // htmlFile = htmlFile.replace("display: none;", "");

                    // const blob = new Blob([htmlFile], {
                    //   type: "text/html",
                    // });

                    // // Create a URL for the blob
                    // const url = URL.createObjectURL(blob);

                    // // Create a link and trigger the download
                    // const link = document.createElement("a");
                    // link.href = url;
                    // link.download = "generated_file.html";
                    // document.body.appendChild(link);
                    // link.click();

                    // // Clean up
                    // document.body.removeChild(link);
                    // URL.revokeObjectURL(url);
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
    default:
      iconToRender = <HomeOutlinedIcon />;
  }
  // console.log("modifiedData!@@!@!@#!@#!@", modifiedData);
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

      {/* <html style={{ display: "none" }} ref={exportHTMLRef}>
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
                {colParentsCount !== undefined && colParentsCount.length > 0 ? (
                  colParentsCount.map((item) => {
                    return (
                      <th
                        style={{
                          backgroundColor: "rgb(245, 245, 245)",
                          borderTop: "1px solid rgb(199, 199, 199)",
                          borderBottom: "1px solid rgb(199, 199, 199)",
                          borderLeft: "1px solid rgb(199, 199, 199)",
                          borderRight: "1px solid rgb(199, 199, 199)",
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
            <tbody>
              {modifiedData.map((data, index) => {
                return (
                  <tr style={{ textAlign: "center" }}>
                    {data.map((dataItem) => {
                      console.log("modifiedData dataItem-------", dataItem);
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
                            {dataItem}
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
      </html> */}
    </ListItem>
  );
};

export default CommonToolsItem;
