import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import { Box, Typography, IconButton } from "@mui/material";

import MuiDrawer from "@mui/material/Drawer";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";

import { setSavedData } from "../../slices/report";

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
  const [treeData, setTreeData] = React.useState([]);
  const reportHistory = useSelector((state) => state.report.reportHistory);

  React.useEffect(() => {
    //Group report history by date
    const groupedData = reportHistory.reduce((acc, obj) => {
      const date = obj.time.split("T")[0];

      if (acc[date]) {
        acc[date].push(obj);
      } else {
        acc[date] = [obj];
      }

      return acc;
    }, {});

    //Sort grouped report history by date
    const sortedGroupedData = Object.keys(groupedData)
      .sort((a, b) => new Date(b) - new Date(a))
      .reduce((acc, date) => {
        acc[date] = groupedData[date];
        return acc;
      }, {});

    //Make sorted report history to tree data to display
    const tmpTreeData = Object.keys(sortedGroupedData).map((date) => ({
      date,
      children: sortedGroupedData[date],
    }));

    setTreeData(tmpTreeData);
  }, [reportHistory]);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{ style: { position: "relative" } }}
    >
      <Box
        style={styles.title}
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
                  <StyledTreeItem
                    key={`${index}_${childIndex}`}
                    nodeId={`${index}_${childIndex}`}
                    labelText={JSON.stringify(child.time)}
                    onClick={() => {
                      dispatch(setSavedData(child.log));
                    }}
                  />
                ))}
              </StyledTreeItem>
            );
          })}
        </TreeView>
      ) : (
        <div></div>
      )}
    </Drawer>
  );
};

const styles = {
  title: {
    width: "100%",
    backgroundColor: "#C5C1C5",
    paddingLeft: "10px",
    fontWeight: "900",
  },
};

export default WorkTree;