import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "@mui/material/Button";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import {
  setReportRows,
  setReportCols,
  setReportPages,
  setReportDimTable,
  setReportPivotInfo
} from "../../slices/report";

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: 1000,
}));

const initialData = [
  { id: "task-1", content: "Task 1" },
  { id: "task-2", content: "Task 2" },
  // More tasks...
];

const initTables = [
  { id: "sales", content: "sales" },
  { id: "period", content: "period" },
  { id: "product", content: "product" },
  { id: "customer", content: "customer" },
];
const initPages = [{ id: "sales", content: "sales" }];
const initRows = [{ id: "", content: "" }];

export default function DimensionLayoutDialog({
  open,
  handleDimensionLayoutDialogClose,
  handleDimensionLayoutDialogOK,
}) {
  const dispatch = useDispatch();

  let reduxTables = useSelector((state) => state.report.reportTables);
  let reduxDimTable = useSelector((state) => state.report.reportDimTable);
  let reduxRows = useSelector((state) => state.report.reportRows);
  let reduxCols = useSelector((state) => state.report.reportCols);
  let reduxPages = useSelector((state) => state.report.reportPages);

  const [tables, setTables] = React.useState([...reduxTables]);
  const [dimTable, setDimTable] = React.useState([...reduxDimTable]);
  const [pages, setPages] = React.useState([...reduxPages]);
  const [rows, setRows] = React.useState([...reduxRows]);
  const [cols, setCols] = React.useState([...reduxCols]);

  React.useEffect(() => {
    setTables([...reduxTables]);
  }, [reduxTables]);
  React.useEffect(() => {
    setDimTable([...reduxDimTable]);
  }, [reduxDimTable]);
  React.useEffect(() => {
    setRows([...reduxRows]);
  }, [reduxRows]);
  React.useEffect(() => {
    setCols([...reduxCols]);
  }, [reduxCols]);
  React.useEffect(() => {
    setPages([...reduxPages]);
  }, [reduxPages]);

  const pivotInfo = {};

  const onDragEnd = (result) => {
    // console.log("onDragEnd", result);
    if (!result.destination) return;
    const { source, destination } = result;
    let sourceItems, destinationItems, setSourceItems, setDestinationItems;
    switch (source.droppableId) {
      case "pages":
        sourceItems = pages;
        setSourceItems = setPages;
        break;
      case "dimTable":
        sourceItems = dimTable;
        setSourceItems = setDimTable;
        break;
      case "allTables":
        sourceItems = tables;
        setSourceItems = setTables;
        break;
      case "rows":
        sourceItems = rows;
        setSourceItems = setRows;
        break;
      case "cols":
        sourceItems = cols;
        setSourceItems = setCols;
        break;
      default:
        break;
    }
    switch (destination.droppableId) {
      case "pages":
        destinationItems = pages;
        setDestinationItems = setPages;
        break;
      case "dimTable":
        destinationItems = dimTable;
        setDestinationItems = setDimTable;
        break;
      case "allTables":
        destinationItems = tables;
        setDestinationItems = setTables;
        break;
      case "rows":
        destinationItems = rows;
        setDestinationItems = setRows;
        break;
      case "cols":
        destinationItems = cols;
        setDestinationItems = setCols;
        break;
      default:
        break;
    }
    // console.log("source, destination", sourceItems, destinationItems)
    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceItems.splice(source.index, 1);
      // sourceItems.filter((item) => {
      //   return item.id !== source.droppableId
      // })
      destinationItems.splice(destination.index, 0, removed);
      setDestinationItems(destinationItems);
      setSourceItems(sourceItems);
    } else {
      const copiedItems = [...sourceItems];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setSourceItems(copiedItems);
    }
  };

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
      <Dialog
        open={open}
        onClose={handleDimensionLayoutDialogClose}
        PaperProps={{ style: { width: 1000, padding: 5 } }}
      >
        <CustomDialogTitle id="customized-dialog-title">
          Dimension Layout
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleDimensionLayoutDialogClose}
          >
            <CloseIcon />
          </IconButton>
        </CustomDialogTitle>

        <DialogContent>
          <Box>
            <Grid container>
              <Grid item xs={6}>
                <Box sx={{ fontWeight: 1000 }}>Grid</Box>
                <Box>Grid Name</Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ fontWeight: 1000 }}>Database Connection</Box>
                <Box>Reporting</Box>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography>
              Drag dimensions to rows, columns, pages or the Point of View. The
              use of Attribute dimensions is optional.
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontWeight: 1000 }}>
              Attribute Dimension
            </Typography>
            <Box
              sx={{
                border: "1px solid grey",
                width: "100%",
                height: "70px",
                overflow: "auto",
              }}
            >
              <Droppable key={"dimTable"} droppableId={"dimTable"}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ minHeight: "60px" }}
                  >
                    <Box>
                      {dimTable.map((item, index) => {
                        return (
                          <Draggable
                            key={`${item.id}`}
                            draggableId={`${item.id}`}
                            index={index}
                          >
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Box>{item.content}</Box>
                                {provided.placeholder}
                              </Box>
                            )}
                          </Draggable>
                        );
                      })}
                    </Box>
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          </Box>
          {/* Ponit Of View Drag and Drop */}
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontWeight: 1000 }}>Point of View</Typography>
            <Box
              sx={{
                border: "1px solid grey",
                width: "100%",
                height: "70px",
                overflow: "auto",
              }}
            >
              <Droppable key={"allTables"} droppableId={"allTables"}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ minHeight: "60px" }}
                  >
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {tables.map((item, index) => {
                        return (
                          <Draggable
                            key={`${item.id}`}
                            draggableId={`${item.id}`}
                            index={index}
                          >
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ width: "20%" }}
                              >
                                <Box>{item.content}</Box>
                              </Box>
                            )}
                          </Draggable>
                        );
                      })}
                    </Box>
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          </Box>
          {/* Pages Drag and Drop */}
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontWeight: 1000 }}>Pages</Typography>
            <Box
              sx={{
                border: "1px solid grey",
                width: "100%",
                height: "70px",
                overflow: "auto",
              }}
            >
              <Droppable key={"pages"} droppableId={"pages"}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ minHeight: "60px" }}
                  >
                    <Box>
                      {pages.map((item, index) => {
                        return (
                          <Draggable
                            key={`${item.id}`}
                            draggableId={`${item.id}`}
                            index={index}
                          >
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Box>{item.content}</Box>
                                {provided.placeholder}
                              </Box>
                            )}
                          </Draggable>
                        );
                      })}
                    </Box>
                    {provided.placeholder}

                    {/* {console.log(provided.placeholder)} */}
                  </Box>
                )}
              </Droppable>
            </Box>
          </Box>
          {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}> */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Rows Drag and Drop */}
            <Box sx={{ mt: 2, mr: 2, width: "100%" }}>
              <Typography sx={{ fontWeight: 1000 }}>Rows</Typography>
              <Box
                sx={{
                  border: "1px solid grey",
                  height: "70px",
                  overflowY: "auto",
                }}
              >
                <Droppable key={"rows"} droppableId={"rows"}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{ minHeight: "60px" }}
                    >
                      {provided.placeholder}
                      <Box>
                        {rows.map((item, index) => {
                          return (
                            <Draggable
                              key={`${item.id}`}
                              draggableId={`${item.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Box>{item.content}</Box>
                                  {provided.placeholder}
                                </Box>
                              )}
                            </Draggable>
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </Droppable>
              </Box>
            </Box>
            {/* Cols Drag and Drop */}
            <Box sx={{ mt: 2, ml: 2, width: "100%" }}>
              <Typography sx={{ fontWeight: 1000 }}>Cols</Typography>
              <Box
                sx={{
                  border: "1px solid grey",
                  height: "70px",
                  overflowY: "auto",
                }}
              >
                <Droppable key={"cols"} droppableId={"cols"}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{ minHeight: "60px" }}
                    >
                      {provided.placeholder}
                      <Box>
                        {cols.map((item, index) => {
                          return (
                            <Draggable
                              key={`${item.id}`}
                              draggableId={`${item.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Box>{item.content}</Box>
                                </Box>
                              )}
                            </Draggable>
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </Droppable>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "block", padding: "4px 24px" }}>
          <Button
            variant="contained"
            sx={{ float: "right" }}
            onClick={() => {
              // dispatch(setReportPivotInfo({factTable:dimTable}));
              dispatch(setReportDimTable(dimTable));
              dispatch(setReportRows(rows));
              dispatch(setReportCols(cols));
              dispatch(setReportPages(pages));
              handleDimensionLayoutDialogOK();
            }}
          >
            OK
          </Button>
          <Button
            variant="contained"
            sx={{ float: "right", marginRight: "15px" }}
            onClick={handleDimensionLayoutDialogClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </DragDropContext>
  );
}
