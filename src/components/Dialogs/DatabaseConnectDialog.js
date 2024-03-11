import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useSnackbar } from "notistack";

import Button from "@mui/material/Button";
import { Box, Grid, Typography, Select } from "@mui/material";
import { styled } from "@mui/material/styles";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PostAddIcon from '@mui/icons-material/PostAdd';

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import NewConnectionDialog from "./NewConnectionDialog";

import { getTables } from "../../slices/report";

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
  const dbs = useSelector(state => state.database.dbs);

  const [database, setDatabase] = React.useState("");
  const [newConnectionOpen, setNewConnectionOpen] = React.useState(false); 

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event) => {
    console.log("selected Database", event.target.value)
    setDatabase(event.target.value);
  };

  const handleNewConnectionOpen = () => {
    setNewConnectionOpen(!newConnectionOpen);
  }

  const snackbarWithStyle = (content, variant) => {
    enqueueSnackbar(content, {
      variant: variant,
      style: { width: "350px" },
      autoHideDuration: 3000,
      anchorOrigin: { vertical: "top", horizontal: "right" },
    });
  };

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
              {dbs.map(db => {
                return (<MenuItem value={db}>{db}</MenuItem>)
              })}
              {/* <MenuItem value={"test"}>Test</MenuItem> */}
            </Select>
          </FormControl>
        </Box>
        <Button style={{marginTop: "10px"}} variant="contained" startIcon={<PostAddIcon />} onClick={handleNewConnectionOpen}>
          New Connection
        </Button>
      </DialogContent>
      <DialogActions sx={{ display: "block", padding: "4px 24px" }}>
        <Button
          variant="contained"
          sx={{ float: "right" }}
          onClick={() => {
            dispatch(getTables(database))
             .then(res => {
              const {success} = res.payload;
              console.log("$$$$$$$$$getTables Response", success)
              if(success) {
                snackbarWithStyle(notifyContents.databaseSelectSuccess, "success");
              } else {
                snackbarWithStyle(notifyContents.databaseSelectFail, "fail");
              }
             });
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
      <NewConnectionDialog open={newConnectionOpen} handleOpen={handleNewConnectionOpen} handleClose={handleNewConnectionOpen}/>
    </Dialog>
  );
}
