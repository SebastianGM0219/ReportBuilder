import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";

import {
  Box,
  Typography,
  Select,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PostAddIcon from "@mui/icons-material/PostAdd";

import NewConnectionDialog from "./NewConnectionDialog";

import {
  getTables,
  reportHistory,
  setReportDatabase,
} from "../../slices/report";

import { useCustomSnackbar } from "../../CustomSnackbarProvider";
import { notifyContents } from "../Common/Notification";

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: 1000,
}));

export default function DatabaseConnectDialog({
  open,
  handleDatabaseConnectDialogClose,
  handleDatabaseConnectDialogOK,
}) {
  const dispatch = useDispatch();
  const dbs = useSelector((state) => state.database.dbs);

  const [database, setDatabase] = React.useState("");
  const [newConnectionOpen, setNewConnectionOpen] = React.useState(false);

  const handleChange = (event) => {
    setDatabase(event.target.value);
    dispatch(setReportDatabase(event.target.value));
  };

  const handleNewConnectionOpen = () => {
    setNewConnectionOpen(!newConnectionOpen);
  };

  const snackbarWithStyle = useCustomSnackbar();

  return (
    <Dialog
      open={open}
      onClose={handleDatabaseConnectDialogClose}
      PaperProps={{ style: { width: 1000, padding: 5 } }}
    >
      <CustomDialogTitle id="customized-dialog-title">
        Database Connection Properties
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleDatabaseConnectDialogClose}
        >
          <CloseIcon />
        </IconButton>
      </CustomDialogTitle>

      <DialogContent>
        <Typography>Data Source</Typography>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Database</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={database}
              label="Database"
              onChange={handleChange}
            >
              {dbs.map((db, index) => {
                return (
                  <MenuItem value={db} key={index}>
                    {db}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Button
          style={{ marginTop: "10px" }}
          variant="contained"
          startIcon={<PostAddIcon />}
          onClick={handleNewConnectionOpen}
        >
          New Connection
        </Button>
      </DialogContent>
      <DialogActions sx={{ display: "block", padding: "4px 24px" }}>
        <Button
          variant="contained"
          sx={{ float: "right" }}
          onClick={() => {
            dispatch(getTables({ database: database })).then((res) => {
              const { success } = res.payload;
              if (success) {
                snackbarWithStyle(
                  notifyContents.databaseSelectSuccess,
                  "success"
                );
              } else {
                snackbarWithStyle(notifyContents.databaseSelectFail, "error");
              }
            });
            dispatch(reportHistory({ user_id: "0", database: database }));
            handleDatabaseConnectDialogOK();
          }}
        >
          OK
        </Button>
        <Button
          variant="contained"
          sx={{ float: "right", marginRight: "15px" }}
          onClick={handleDatabaseConnectDialogClose}
        >
          Cancel
        </Button>
      </DialogActions>
      <NewConnectionDialog
        open={newConnectionOpen}
        handleOpen={handleNewConnectionOpen}
        handleClose={handleNewConnectionOpen}
      />
    </Dialog>
  );
}
