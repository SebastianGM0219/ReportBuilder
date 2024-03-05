import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "@mui/material/Button";
import { Box, Grid, Typography, Select } from "@mui/material";
import { styled } from "@mui/material/styles";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import { getTables } from "../../slices/report";

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
  const [database, setDatabase] = React.useState("");

  const handleChange = (event) => {
    setDatabase(event.target.value);
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
              <MenuItem value={"test"}>Test</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ display: "block", padding: "4px 24px" }}>
        <Button
          variant="contained"
          sx={{ float: "right" }}
          onClick={() => {
            dispatch(getTables(database));
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
    </Dialog>
  );
}
