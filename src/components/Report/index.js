import * as React from "react";
import { styled } from "@mui/material/styles";
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
// import { List } from "rsuite";

import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { getTableData } from "../../slices/report";

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

  const [tabValue, setTabValue] = React.useState(0);
  const [dimensionLayoutDialog, setDimensionLayoutDialog] =
    React.useState(false);

  const [databaseConnectDialog, setDatabaseConnectDialog] =
    React.useState(false);
  const [selectMembersDialog, setSelectMembersDialog] = React.useState(false);
  const [selectedTable, setSelectedTable] = React.useState("");
  const [kind, setKind] = React.useState("pages");
  // const [rows, setRows] = React.useState(useSelector((state) => state.report.reportRows));
  // const [rows, setRows] = React.useState([]);
  // const reduxRows = useSelector((state) => state.report.reportRows);

  const rows = useSelector((state) => state.report.reportRows);
  const cols = useSelector((state) => state.report.reportCols);
  const pages = useSelector((state) => state.report.reportPages);
  // console.log("row is from Redux", rows);
  // console.log("col is from Redux", cols);
  // console.log("page is from Redux", pages);

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
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Grid container>
            <Grid item xs={2} sx={{}}>
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
                      <GridOnIcon /> Grid
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
            </Grid>
            <Grid item xs={7} sx={{ p: 2 }}>
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
                <Box sx={{mt: 2}}>
                  <label>Pages: </label>
                  <Button
                    variant="contained"
                    value={pages[0].id}
                    onClick={(e) => {
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
              {/* Grid with Drag and Drop function */}
              {rows.length && cols.length ? (
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
                        {cols.map((col, index) => {
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
                        {cols.map((col) => {
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
                      {rows.map((row, index) => {
                        return (
                          <TableRow>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell align="right">
                              <Button
                                value={row.id}
                                onClick={(e) => {
                                  // console.log("cell button clicked", e.target.value)
                                  setKind("rows")
                                  setSelectedTable(e.target.value);
                                }}
                              >
                                {row.content}
                              </Button>
                            </TableCell>
                            {rows.map((row, index) => {
                              return <TableCell align="right">#</TableCell>;
                            })}
                            <TableCell />
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell align="right" width={1}>
                          <IconButton>
                            <AddIcon/>
                          </IconButton>
                        </TableCell>
                        <TableCell />
                        <TableCell/>
                        {rows.map(() => {
                          return <TableCell />
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={3}>
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
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Report;
