import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";

import {
  Button,
  Box,
  Grid,
  Select,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Checkbox
} from "@mui/material";

import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import {
  setReportPivotInfo,
  setReportExpandedRows,
  setReportExpandedCols,
  setReportExpandedPages,
} from "../../slices/report";

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: 1000,
}));

// Convert flat array to tree structure
const convertToTree = (arr, parent) => {
  const tree = {};
  if (arr !== undefined) {
    arr.forEach((item) => {
      if (item.parent_id === parent) {
        tree[item.id] = {
          ...item,
          children: convertToTree(arr, item.id),
        };
      }
    });
  }
  return Object.values(tree);
};

const uniquizeArrayOfObjects = (arrayOfObjects, key) => {
  const uniqueMap = new Map();
  for (const obj of arrayOfObjects) {
    uniqueMap.set(obj[key], obj);
  }
  return Array.from(uniqueMap.values());
};

export default function SelectMembersDialog({
  open,
  table,
  kind,
  handleSelectMembersDialogClose,
  handleSelectMembersDialogOK,
}) {
  const dispatch = useDispatch();

  const [checked, setChecked] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [rightChecked, setRightChecked] = React.useState([]);

  const tableData = useSelector((state) => state.report.reportTableData)[table];
  const treeData = convertToTree(tableData, null);

  const [member, setMember] = React.useState("Name");

  React.useEffect(() => {
    setSelected([]);
  }, [kind]);

  const handleMemberChange = (event) => {
    setMember(event.target.value);
  };

  const handleOKButtonClicked = () => {
    let tmpDim = [];
    let tmpPivotValue = [];
    // console.log("****************kind, selectd", kind, selected);

    selected.forEach((node) => {
      if (node.member !== undefined)
        tmpPivotValue.push([
          { dimension: table, member: node.name, relation: node.member },
        ]);
      else tmpPivotValue.push([{ dimension: table, member: node.name }]);
    });

    selected.forEach((node) => {
      let text;

      switch (node.member) {
        case "IChildren":
          text = `Children of ${node.name}(Inclusive)`;
          break;
        case "Children":
          text = `Children of ${node.name}`;
          break;
        case "IDescendants":
          text = `Descendants of ${node.name}(Inclusive)`;
          break;
        case "Descendants":
          text = `Descendants of ${node.name}`;
          break;
        default:
          text = node.name;
          break;
      }
      if (node.member !== undefined)
        tmpDim.push({
          id: table,
          content: text,
          dimension: table,
          member: node.name,
          relation: node.member,
        });
      else
        tmpDim.push({
          id: table,
          content: text,
          dimension: table,
          member: node.name,
        });
    });

    switch (kind) {
      case "rows":
        dispatch(setReportExpandedRows(tmpDim));
        break;
      case "cols":
        dispatch(setReportExpandedCols(tmpDim));
        break;
      default:
        dispatch(setReportExpandedPages(tmpDim));
        break;
    }

    dispatch(setReportPivotInfo({ kind, data: tmpPivotValue }));
    setSelected([]);
    setChecked([]);
    handleSelectMembersDialogOK();
  };

  const handleToggleCheck = (event, node) => {
    let newChecked;
    if (event.target.checked) {
      newChecked = [...checked, { id: node.id, name: node.name }];
    } else {
      newChecked = checked.filter((item) => {
        return item.id !== node.id;
      });
    }
    newChecked = uniquizeArrayOfObjects(newChecked, "id");
    setChecked(newChecked);
  };

  const nodeExistedInChecked = (checked, nodes) => {
    return checked.some((obj) => obj["id"] === nodes.id);
  };

  const handleToggleRight = (event, node) => {
    let newChecked;
    if (event.target.checked) {
      newChecked = [...rightChecked, { id: node.id, name: node.name }];
    } else {
      newChecked = rightChecked.filter((item) => {
        return item.id !== node.id;
      });
    }
    newChecked = uniquizeArrayOfObjects(newChecked, "id");
    setRightChecked(newChecked);
  };

  const renderTree = (nodes) => {
    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id.toString()}
        label={
          <>
            <Checkbox
              checked={nodeExistedInChecked(checked, nodes)}
              onChange={(e) => {
                handleToggleCheck(e, nodes);
              }}
            />
            {nodes.name}
          </>
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  const handleCheckedRight = () => {
    let checkedWithMember = [...selected];
    if (member !== "Name") {
      checked.forEach((node) => {
        checkedWithMember.push({ ...node, member: member });
      });
    } else {
      checkedWithMember = [...checkedWithMember, ...checked];
    }
    checkedWithMember = uniquizeArrayOfObjects(checkedWithMember, "id");
    setSelected(checkedWithMember);
    setRightChecked([]);
  };

  const handleCheckedLeft = () => {
    let newSelected;
    newSelected = selected.filter((item) => {
      return !rightChecked.some((node) => node.id === item.id);
    });
    setSelected(newSelected);
    setRightChecked([]);
  };

  return (
    <Dialog
      open={open}
      onClose={handleSelectMembersDialogClose}
      fullWidth={true}
      maxWidth="lg"
      PaperProps={{ style: { width: 1000, padding: 5 } }}
    >
      <CustomDialogTitle id="customized-dialog-title">
        Select Members
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleSelectMembersDialogClose}
        >
          <CloseIcon />
        </IconButton>
      </CustomDialogTitle>

      <DialogContent>
        <Box>
          <Grid container>
            <Grid item xs={8}>
              <Box sx={{ minWidth: 120, mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Members</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={member}
                    label="Database"
                    onChange={handleMemberChange}
                  >
                    <MenuItem value={"Name"}>Name</MenuItem>
                    <MenuItem value={"Children"}>Children</MenuItem>
                    <MenuItem value={"IChildren"}>Children(Inclusive)</MenuItem>
                    <MenuItem value={"Descendants"}>Descendants</MenuItem>
                    <MenuItem value={"IDescendants"}>
                      Descendants(Inclusive)
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ width: "100%", height: "150px", overflow: "auto" }}>
                <TreeView
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                >
                  {open ? treeData.map((node) => renderTree(node)) : <></>}
                </TreeView>
              </Box>
            </Grid>
            <Grid item xs={1} sx={{display: 'flex', alignItems: 'center'}}>
              <Grid container>
                <Box sx={{display: 'flex', alignItems:'center', flexWrap:'wrap', flexDirection:'column'}}>
                <Button
                  sx={{ my: 0.5 }}
                  variant="text"
                  size="small"
                  onClick={handleCheckedRight}
                  aria-label="move selected right"
                >
                  &gt;
                </Button>
                <Button
                  sx={{ my: 0.5 }}
                  variant="text"
                  size="small"
                  onClick={handleCheckedLeft}
                  aria-label="move selected left"
                >
                  &lt;
                </Button>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Box>
                <List
                  dense
                  component="div"
                  role="list"
                  sx={{ overflow: "auto" }}
                >
                  {selected.map((node) => {
                    const labelId = `transfer-list-item-${node.id}-label`;
                    let text;
                    if (node.hasOwnProperty("member")) {
                      switch (node.member) {
                        case "IChildren":
                          text = `Children of ${node.name}(Inclusive)`;
                          break;
                        case "Children":
                          text = `Children of ${node.name}`;
                          break;
                        case "IDescendants":
                          text = `Descendants of ${node.name}(Inclusive)`;
                          break;
                        case "Descendants":
                          text = `Descendants of ${node.name}`;
                          break;
                        default:
                          text = node.name;
                          break;
                      }
                    } else {
                      text = node.name;
                    }
                    return (
                      <ListItemButton
                        key={node.id}
                        role="listitem"
                        onClick={(e) => handleToggleRight(e, node)}
                      >
                        <ListItemIcon>
                          <Checkbox
                            checked={nodeExistedInChecked(rightChecked, node)}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </ListItemIcon>

                        <ListItemText id={labelId} primary={text} />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ display: "block", padding: "4px 24px" }}>
        <Button
          variant="contained"
          sx={{ float: "right" }}
          onClick={handleOKButtonClicked}
        >
          OK
        </Button>
        <Button
          variant="contained"
          sx={{ float: "right", marginRight: "15px" }}
          onClick={handleSelectMembersDialogClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
