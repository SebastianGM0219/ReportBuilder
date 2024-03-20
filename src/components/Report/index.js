import * as React from "react";
import { styled } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Typography,
  Tab,
  Tabs,
  Grid,
  Button,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import AddIcon from "@mui/icons-material/Add";
import GridOnIcon from "@mui/icons-material/GridOn";

import CommonTools from "../CommonTools";
import WorkTree from "../WorkTree";
import DimensionLayoutDialog from "../Dialogs/DimensionLayoutDialog";
import DatabaseConnectDialog from "../Dialogs/DatabaseConnectDialog";
import SelectMembersDialog from "../Dialogs/SelectMembersDialog";

import { getTableData, setReportPivotInfo } from "../../slices/report";

const useStyles = makeStyles()((theme) => {
  return {
    grid: {
      border: "3px solid #908C91",
      height: "100%",
    },
    main: {
      minHeight: "75vh",
    },
    tab: {
      fontWeight: 700,
    },
    layoutItem: {
      borderBottom: "1px solid grey",
    },
    title: {
      width: "100%",
      backgroundColor: "#C5C1C5",
      paddingLeft: "10px",
      fontWeight: "900",
    },
  };
});

const LayoutItem = ({ name }) => {
  return (
    <ListItem
      sx={{ borderBottom: "1px solid grey" }}
      secondaryAction={
        <IconButton>
          <AddIcon />
        </IconButton>
      }
    >
      <ListItemText>{name}</ListItemText>
    </ListItem>
  );
};

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

  const displayRows = expandedRows.length ? expandedRows : rows;
  const displayCols = expandedCols.length ? expandedCols : cols;

  React.useEffect(() => {
    if (pages.length) setSelectedPage(pages[0].id);
  }, [pages]);

  React.useEffect(() => {
    if (expandedPages.length) setSelectedPage(pages[0].id);
  }, [expandedPages]);

  const handleSelectedPageChanged = (e) => {
    dispatch(setReportPivotInfo({ kind: "pages", data: [[e.target.value]] }));
    setSelectedPage(e.target.value);
  };

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
        <Tab label="Report Generator" className={classes.tab} />
      </Tabs>
      <CommonTools />
      <Box sx={{ display: "flex" }}>
        <WorkTree />
        <Box component="main" sx={{ flexGrow: 1 }} className={classes.main}>
          <Box className={classes.title}>Report Builder</Box>
          <Grid container>
            <Grid item xs={2}>
              <Box className={classes.grid} style={{ marginRight: "7px" }}>
                <List>
                  <LayoutItem name="Header" />
                  <ListItem
                    className={classes.layoutItem}
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
                          width: "11%",
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
                        <GridOnIcon />{" "}
                        <Typography
                          sx={{
                            marginLeft: "10px",
                            fontWeight: "600",
                            fontSize: "18px",
                          }}
                        >
                          {" "}
                          Grid{" "}
                        </Typography>
                      </MenuItem>
                    </Menu>
                    <ListItemText>Body</ListItemText>
                  </ListItem>
                  <LayoutItem name="Footer" />
                </List>
              </Box>
            </Grid>
            <Grid item xs={7}>
              <Box className={classes.grid} style={{ padding: "10px" }}>
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
                        setSelectedTable(e.target.value);
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
                      {expandedPages.map((page, index) => (
                        <MenuItem key={index} value={page}>
                          {page.content}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <></>
                )}

                {/* Grid function */}
                {displayRows.length && displayCols.length ? (
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell />
                          {displayCols.map((col, index) => {
                            return (
                              <TableCell align="right" key={index}>
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
                          {displayCols.map((col, index) => {
                            return (
                              <TableCell align="right" key={index}>
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
                        {displayRows.map((row, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
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
                              {displayRows.map((row, index) => {
                                return <TableCell align="right" key={index}>#</TableCell>;
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
                          {displayRows.map((row, index) => {
                            return <TableCell key={index}/>;
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
      <DatabaseConnectDialog
        open={databaseConnectDialog}
        handleDatabaseConnectDialogClose={handleDatabaseConnectDialogClose}
        handleDatabaseConnectDialogOK={handleDatabaseConnectDialogOK}
      />
      <SelectMembersDialog
        open={selectMembersDialog}
        kind={kind}
        table={selectedTable}
        handleSelectMembersDialogClose={handleSelectMembersDialogClose}
        handleSelectMembersDialogOK={handleSelectMembersDialogOK}
      />
    </Box>
  );
};

export default Report;
