import * as React from "react";
import { styled } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Tab,
  Tabs,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
  InputLabel,
  Avatar,
  Divider,
} from "@mui/material";

import CommonTools from "../CommonTools";
import WorkTree from "../WorkTree";
import DimensionLayoutDialog from "../Dialogs/DimensionLayoutDialog";
import DatabaseConnectDialog from "../Dialogs/DatabaseConnectDialog";
import SelectMembersDialog from "../Dialogs/SelectMembersDialog";

import AddIcon from "@mui/icons-material/Add";
import GridOnIcon from "@mui/icons-material/GridOn";

import { pivot } from "../../slices/query";
import { getTableData, setReportPivotInfo } from "../../slices/report";
import jsPDF from "jspdf";
import "jspdf-autotable";

// const useStyles = makeStyles({
//   grid: {
//     order: "2px solid #6F6B68",
//     margin: "10px",
//     height: "870px",
//   },
// });

const useStyles = makeStyles()((theme) => {
  return {
    grid: {
      border: "3px solid #908C91",
      height: "100%",
    },
    main: {
      minHeight: "75vh"
    },
  };
});

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const Report = () => {
  const dispatch = useDispatch();

  const { classes } = useStyles();

  const [tabValue, setTabValue] = React.useState(0);
  const [dimensionLayoutDialog, setDimensionLayoutDialog] =
    React.useState(false);

  const [databaseConnectDialog, setDatabaseConnectDialog] =
    React.useState(false);
  const [selectMembersDialog, setSelectMembersDialog] = React.useState(false);
  const [selectedTable, setSelectedTable] = React.useState("");
  const [kind, setKind] = React.useState("pages");
  const [selectedPage, setSelectedPage] = React.useState("");

  const rows = useSelector((state) => state.report.reportRows);
  const cols = useSelector((state) => state.report.reportCols);
  const pages = useSelector((state) => state.report.reportPages);

  const expandedRows = useSelector((state) => state.report.reportExpandedRows);
  const expandedCols = useSelector((state) => state.report.reportExpandedCols);
  const expandedPages = useSelector(
    (state) => state.report.reportExpandedPages
  );

  const pivotResult = useSelector((state) => state.report.reportResultOfPivot);
  console.log("pivotResult Initial", pivotResult);
  const displayRows = expandedRows.length ? expandedRows : rows;
  const displayCols = expandedCols.length ? expandedCols : cols;
  const displayPages = expandedPages.length ? expandedPages : pages;

  React.useEffect(() => {
    if (pages.length) setSelectedPage(pages[0].id);
  }, [pages]);

  React.useEffect(() => {
    if (expandedPages.length) setSelectedPage(pages[0].id);
  }, [expandedPages]);

  // React.useEffect(() => {
  //   if (pivotResult) {
  //     const doc = new jsPDF();
  //     doc.text(`Pages: ${selectedPage}`, 15, 15);
  //     if (typeof doc.autoTable === "function" && !doc.autoTable.started) {
  //       doc.autoTable({
  //         html: "#export-data",
  //         startY: 20,
  //         didDrawPage: () => {
  //           doc.save("data1.pdf");
  //           console.log("############After doc.save");
  //         }
  //       });
  //     }
  //   }
  // }, [pivotResult, selectedPage]);

  const handleSelectedPageChanged = (e) => {
    // console.log("handleSelectedPageChanged", e.target.value)
    dispatch(setReportPivotInfo({ kind: "pages", data: [[e.target.value]] }));
    setSelectedPage(e.target.value);
  };

  console.log(
    "rows, cols, pages, expandedRows, expandedCols, expandedPages, displayRows, displayCols, displayPages",
    rows,
    cols,
    pages,
    expandedRows,
    expandedCols,
    expandedPages,
    displayRows,
    displayCols,
    displayPages
  );

  React.useEffect(() => {
    if (pages.length > 0) {
      setSelectedTable(pages[0].id);
    }
  }, [pages]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleDimensionLayoutButtonClick = () => {
    setDimensionLayoutDialog(true);
  };

  const handleDimensionLayoutDialogClose = () => {
    setDimensionLayoutDialog(false);
  };

  const handleDimensionLayoutDialogOK = () => {
    setDimensionLayoutDialog(false);
  };

  const handleDatabaseConnectDialogClose = () => {
    setDatabaseConnectDialog(false);
  };

  const handleDatabaseConnectDialogOK = () => {
    setDatabaseConnectDialog(false);
  };

  const handleSelectMembersDialogClose = () => {
    setSelectMembersDialog(false);
  };

  const handleSelectMembersDialogOK = () => {
    setSelectMembersDialog(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Report Generator" style={{ fontWeight: 700 }} />
      </Tabs>
      <CommonTools />
      <Box sx={{ display: "flex" }}>
        <WorkTree />
        <Box component="main" sx={{ flexGrow: 1 }} className={classes.main}>
          <Box
            style={{
              width: "100%",
              backgroundColor: "#C5C1C5",
              paddingLeft: "10px",
              fontWeight: "900",
            }}
          >
            Report Builder
          </Box>
          <Grid container>
            <Grid item xs={2} sx={{}}>
              <Box className={classes.grid} style={{ marginRight: "7px" }}>
                <List sx={{}}>
                  <ListItem
                    sx={{ borderBottom: "1px solid grey" }}
                    secondaryAction={
                      <IconButton>
                        <AddIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText>Header</ListItemText>
                  </ListItem>
                  <ListItem
                    sx={{ borderBottom: "1px solid grey" }}
                    secondaryAction={
                      <IconButton
                        onClick={handleClick}
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        <AddIcon />
                      </IconButton>
                    }
                  >
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          minWidth: "170px",
                          width:"11%",
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem onClick={() => setDatabaseConnectDialog(true)}>
                        <GridOnIcon /> <Typography sx={{marginLeft: "10px", fontWeight:"600", fontSize:"18px"}}> Grid </Typography>
                      </MenuItem>
                    </Menu>
                    <ListItemText>Body</ListItemText>
                    <DatabaseConnectDialog
                      open={databaseConnectDialog}
                      handleDatabaseConnectDialogClose={
                        handleDatabaseConnectDialogClose
                      }
                      handleDatabaseConnectDialogOK={
                        handleDatabaseConnectDialogOK
                      }
                    />
                    <SelectMembersDialog
                      open={selectMembersDialog}
                      kind={kind}
                      table={selectedTable}
                      handleSelectMembersDialogClose={
                        handleSelectMembersDialogClose
                      }
                      handleSelectMembersDialogOK={handleSelectMembersDialogOK}
                    />
                  </ListItem>
                  <ListItem
                    sx={{ borderBottom: "1px solid grey" }}
                    secondaryAction={
                      <IconButton>
                        <AddIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText>Footer</ListItemText>
                  </ListItem>
                </List>
              </Box>
            </Grid>
            <Grid item xs={7}>
              <Box className={classes.grid} style={{padding:"10px"}}>
                {pages.length ? (
                  <Box>
                    <Button
                      variant="contained"
                      value={selectedTable}
                      onClick={(e) => {
                        dispatch(getTableData(e.target.value));
                        setSelectMembersDialog(true);
                      }}
                    >
                      {selectedTable}
                    </Button>
                  </Box>
                ) : (
                  <></>
                )}
                {pages.length ? (
                  <Box sx={{ mt: 2 }}>
                    <label>Pages: </label>
                    <Button
                      variant="contained"
                      value={pages[0].id}
                      onClick={(e) => {
                        setKind("pages");
                        dispatch(getTableData(e.target.value));
                        setSelectMembersDialog(true);
                      }}
                    >
                      {pages[0].content}
                    </Button>
                  </Box>
                ) : (
                  <></>
                )}
                {expandedPages.length ? (
                  <FormControl sx={{ m: 1, width: 300 }}>
                    {/* <InputLabel id="demo-multiple-name-label">Name</InputLabel> */}
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      value={selectedPage}
                      onChange={handleSelectedPageChanged}
                      input={<OutlinedInput label="" />}
                      // MenuProps={MenuProps}
                    >
                      {expandedPages.map((page) => (
                        <MenuItem key={page.id} value={page}>
                          {page.content}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <></>
                )}

                {/* Grid with Drag and Drop function */}
                {displayRows.length && displayCols.length ? (
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell />
                          {/* {rows.map((row, index) => {
                          // console.log(row);
                          return (
                            <TableCell align="right">
                              {String.fromCharCode(65 + index)}
                            </TableCell>
                          );
                        })} */}
                          {displayCols.map((col, index) => {
                            // console.log(row);
                            return (
                              <TableCell align="right">
                                {String.fromCharCode(65 + index)}
                              </TableCell>
                            );
                          })}
                          <TableCell align="center" width={1}>
                            <IconButton>
                              <AddIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell />
                          <TableCell />
                          {/* {rows.map((row) => {
                          return (
                            <TableCell align="right">
                              <Button
                                value={row.id}
                                onClick={(e) => {
                                  setKind("rows");
                                  setSelectedTable(e.target.value);
                                }}
                              >
                                {row.content}
                              </Button>
                            </TableCell>
                          );
                        })} */}
                          {displayCols.map((col) => {
                            return (
                              <TableCell align="right">
                                <Button
                                  value={col.id}
                                  onClick={(e) => {
                                    setKind("cols");
                                    setSelectedTable(e.target.value);
                                  }}
                                >
                                  {col.content}
                                </Button>
                              </TableCell>
                            );
                          })}
                          <TableCell />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* {cols.map((col, index) => {
                        return (
                          <TableRow>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell align="right">
                              <Button
                                value={col.id}
                                onClick={(e) => {
                                  // console.log("cell button clicked", e.target.value)
                                  setKind("cols")
                                  setSelectedTable(e.target.value);
                                }}
                              >
                                {col.content}
                              </Button>
                            </TableCell>
                            {rows.map((row, index) => {
                              return <TableCell align="right">#</TableCell>;
                            })}
                            <TableCell />
                          </TableRow>
                        );
                      })} */}
                        {displayRows.map((row, index) => {
                          return (
                            <TableRow>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell align="right">
                                <Button
                                  value={row.id}
                                  onClick={(e) => {
                                    // console.log("cell button clicked", e.target.value)
                                    setKind("rows");
                                    setSelectedTable(e.target.value);
                                  }}
                                >
                                  {row.content}
                                </Button>
                              </TableCell>
                              {displayRows.map((row, index) => {
                                return <TableCell align="right">#</TableCell>;
                              })}
                              <TableCell />
                            </TableRow>
                          );
                        })}
                        <TableRow>
                          <TableCell align="right" width={1}>
                            <IconButton>
                              <AddIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell />
                          <TableCell />
                          {displayRows.map(() => {
                            return <TableCell />;
                          })}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <></>
                )}
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.grid} style={{ marginLeft: "7px" }}>
                <Accordion
                  expanded={expanded === "panel1"}
                  onChange={handleChange("panel1")}
                >
                  <AccordionSummary
                    aria-controls="panel1d-content"
                    id="panel1d-header"
                  >
                    <Typography>Grid Properties</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ p: 1 }}>
                      <Button
                        variant="contained"
                        onClick={handleDimensionLayoutButtonClick}
                      >
                        Dimension Layout
                      </Button>
                      <DimensionLayoutDialog
                        open={dimensionLayoutDialog}
                        handleDimensionLayoutDialogClose={
                          handleDimensionLayoutDialogClose
                        }
                        handleDimensionLayoutDialogOK={
                          handleDimensionLayoutDialogOK
                        }
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "panel2"}
                  onChange={handleChange("panel2")}
                >
                  <AccordionSummary
                    aria-controls="panel2d-content"
                    id="panel2d-header"
                  >
                    <Typography>Suppression</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Suspendisse malesuada lacus ex, sit amet blandit leo
                      lobortis eget. Lorem ipsum dolor sit amet, consectetur
                      adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                      blandit leo lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "panel3"}
                  onChange={handleChange("panel3")}
                >
                  <AccordionSummary
                    aria-controls="panel3d-content"
                    id="panel3d-header"
                  >
                    <Typography>Position</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Suspendisse malesuada lacus ex, sit amet blandit leo
                      lobortis eget. Lorem ipsum dolor sit amet, consectetur
                      adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                      blandit leo lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Report;
