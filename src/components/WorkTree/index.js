import * as React from "react";
import { useSelector } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import MuiDrawer from "@mui/material/Drawer";

// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { Tooltip } from "@mui/material";

import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import GridOnIcon from "@mui/icons-material/GridOn";
import report, {
  setReportRows,
  setReportTableData,
  setReportTables,
  setSavedData,
} from "../../slices/report";
import { useDispatch } from "react-redux";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
  const theme = useTheme();
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    colorForDarkMode,
    bgColorForDarkMode,
    ...other
  } = props;

  const styleProps = {
    "--tree-view-color":
      theme.palette.mode !== "dark" ? color : colorForDarkMode,
    "--tree-view-bg-color":
      theme.palette.mode !== "dark" ? bgColor : bgColorForDarkMode,
  };

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.5,
            pr: 0,
          }}
        >
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={styleProps}
      {...other}
      ref={ref}
    />
  );
});

const WorkTree = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(true);
  const [tabValue, setTabValue] = React.useState(0);
  const [treeData, setTreeData] = React.useState([]);
  const reportHistory = useSelector((state) => state.report.reportHistory);

  React.useEffect(() => {
    const groupedData = reportHistory.reduce((acc, obj) => {
      console.log("WorkTree groupedData", reportHistory)
      const date = obj.time.split("T")[0];

      if (acc[date]) {
        acc[date].push(obj);
      } else {
        acc[date] = [obj];
      }

      return acc;
    }, {});

    const sortedGroupedData = Object.keys(groupedData)
      .sort((a, b) => new Date(b) - new Date(a))
      .reduce((acc, date) => {
        acc[date] = groupedData[date];
        return acc;
      }, {});

    const tmpTreeData = Object.keys(sortedGroupedData).map((date) => ({
      date,
      children: sortedGroupedData[date],
    }));

    setTreeData(tmpTreeData);
  }, [reportHistory]);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{ style: { position: "relative" } }}
    >
      <Box
        style={{
          width: "100%",
          backgroundColor: "#C5C1C5",
          paddingLeft: "10px",
          fontWeight: "900",
        }}
      >
        {open ? "Repository" : "Repo..."}
      </Box>
      <DrawerHeader>
        <IconButton onClick={handleDrawerOpen}>
          {!open ? (
            <KeyboardDoubleArrowRightIcon />
          ) : (
            <KeyboardDoubleArrowLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      {open ? (
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {treeData.map((parent, index) => {
            return (
              <StyledTreeItem
                key={index}
                nodeId={index.toString()}
                labelText={parent.date}
                labelIcon={FolderOpenIcon}
              >
                {parent.children.map((child, childIndex) => (
                  // <Tooltip
                  //   title={`${JSON.stringify(child.log).slice(0, 100)}...`}
                  //   placement="top-start"
                  // >
                    <StyledTreeItem
                      key={`${index}_${childIndex}`}
                      nodeId={`${index}_${childIndex}`}
                      labelText={JSON.stringify(child.time)}
                      onClick={() => {
                        dispatch(setSavedData(child.log));
                      }}
                    />
                  // </Tooltip>
                ))}
              </StyledTreeItem>
            );
          })}
          {/* <StyledTreeItem
            nodeId="1"
            labelText="Folders"
            labelIcon={FolderOpenIcon}
          >
            <StyledTreeItem
              nodeId="2"
              labelText="table"
              labelIcon={GridOnIcon}
            />
          </StyledTreeItem>
          <StyledTreeItem
            nodeId="5"
            labelText="Folders"
            labelIcon={FolderOpenIcon}
          >
            <StyledTreeItem
              nodeId="10"
              labelText="table"
              labelIcon={GridOnIcon}
            />
            <StyledTreeItem
              nodeId="6"
              labelText="Folders"
              labelIcon={FolderOpenIcon}
            >
              <StyledTreeItem
                nodeId="8"
                labelText="table"
                labelIcon={GridOnIcon}
              />
            </StyledTreeItem>
          </StyledTreeItem> */}
        </TreeView>
      ) : (
        <div></div>
      )}
    </Drawer>
  );
};

export default WorkTree;
