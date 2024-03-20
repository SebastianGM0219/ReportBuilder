import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";

import {
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";

import {
  Editor,
  EditorTools,
} from "@progress/kendo-react-editor";
import { savePDF } from "@progress/kendo-react-pdf";
import { InsertImage } from "./insertImageTool";

import { saveLog } from "../../slices/report";
import CloseIcon from "@mui/icons-material/Close";
const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  ForeColor,
  BackColor,
  CleanFormatting,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  NumberedList,
  BulletedList,
  Undo,
  Redo,
  FontSize,
  FontName,
  FormatBlock,
  Link,
  Unlink,
  ViewHtml,
  InsertTable,
  InsertFile,
  SelectAll,
  Print,
  Pdf,
  TableProperties,
  TableCellProperties,
  AddRowBefore,
  AddRowAfter,
  AddColumnBefore,
  AddColumnAfter,
  DeleteRow,
  DeleteColumn,
  DeleteTable,
  MergeCells,
  SplitCell,
} = EditorTools;

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: 1000,
}));

export default function ExportDialog({
  open,
  data,
  handleExportDialogClose,
  handleExportDialogOK,
}) {
  const dispatch = useDispatch();

  const pivotInfo = useSelector((state) => state.report.reportPivotInfo);

  const reportRows = useSelector((state) => state.report.reportRows);
  const reportCols = useSelector((state) => state.report.reportCols);
  const reportPages = useSelector((state) => state.report.reportPages);
  const reportExpandedRows = useSelector(
    (state) => state.report.reportExpandedRows
  );
  const reportExpandedCols = useSelector(
    (state) => state.report.reportExpandedCols
  );
  const reportExpandedPages = useSelector(
    (state) => state.report.reportExpandedPages
  );
  const reportTableData = useSelector((state) => state.report.reportTableData);
  const reportDatabase = useSelector((state) => state.report.reportDatabase);
  const saveLogDispatch = () => {
    const user_id = "0";
    const time = new Date();
    const database = reportDatabase;
    const log = {
      rows: reportRows,
      cols: reportCols,
      pages: reportPages,
      expandedRows: reportExpandedRows,
      expandedCols: reportExpandedCols,
      expandedPages: reportExpandedPages,
      tableData: reportTableData,
      pivotInfo: pivotInfo,
    };
    dispatch(
      saveLog({ user_id: user_id, time: time, database: database, log: log })
    );
  };

  // const onImageInsert = (args) => {
  //   const { files, view, event } = args;
  //   const nodeType = view.state.schema.nodes.image;
  //   const position =
  //     event.type === "drop"
  //       ? view.posAtCoords({
  //           left: event.clientX,
  //           top: event.clientY,
  //         })
  //       : null;
  //   insertImageFiles({
  //     view,
  //     files,
  //     nodeType,
  //     position,
  //   });
  //   return files.length > 0;
  // };
  // const onMount = (event) => {
  //   const state = event.viewProps.state;
  //   const plugins = [...state.plugins, insertImagePlugin(onImageInsert)];
  //   return new ProseMirror.EditorView(
  //     {
  //       mount: event.dom,
  //     },
  //     {
  //       ...event.viewProps,
  //       state: ProseMirror.EditorState.create({
  //         doc: state.doc,
  //         plugins,
  //       }),
  //     }
  //   );
  // };

  const editor = React.createRef();

  const exportPDF = () => {
    saveLogDispatch();
    let element = editor.current;
    console.log("editor.current:", element.view.dom);
    savePDF(element.view.dom, {
      paperSize: "a4",
      scale: 0.6,
      margin: 40,
      fileName: `Report for ${new Date().getFullYear()}`,
    });
  };

  const exportHTML = () => {
    saveLogDispatch();
    let element = editor.current;

    const blob = new Blob([element.view.dom.outerHTML], {
      type: "text/html",
    });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a link and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "generated_file.html";
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      open={open}
      onClose={handleExportDialogClose}
      maxWidth="lg"
      PaperProps={{ style: { width: 1200, padding: 5 } }}
    >
      <CustomDialogTitle id="customized-dialog-title">
        Edit & Export
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleExportDialogClose}
        >
          <CloseIcon />
        </IconButton>
      </CustomDialogTitle>

      <DialogContent>
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
          onClick={exportPDF}
        >
          Export to PDF
        </button>
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
          onClick={exportHTML}
        >
          Export to HTML
        </button>
        <Editor
          tools={[
            [Bold, Italic, Underline, Strikethrough],
            [Subscript, Superscript],
            ForeColor,
            BackColor,
            [CleanFormatting],
            [AlignLeft, AlignCenter, AlignRight, AlignJustify],
            [Indent, Outdent],
            [OrderedList, UnorderedList],
            [NumberedList, BulletedList],
            FontSize,
            FontName,
            FormatBlock,
            [SelectAll],
            [Undo, Redo],
            [Link, Unlink, InsertImage, ViewHtml],
            [InsertTable, InsertFile],
            [Pdf, Print],
            [TableProperties, TableCellProperties],
            [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
            [DeleteRow, DeleteColumn, DeleteTable],
            [MergeCells, SplitCell],
          ]}
          contentStyle={{
            minHeight: "320px",
            height: "100%",
          }}
          ref={editor}
          defaultContent={data}
        />
      </DialogContent>
      <DialogActions sx={{ display: "block", padding: "4px 24px" }}>
        <Button
          variant="contained"
          sx={{ float: "right" }}
          onClick={() => {
            handleExportDialogOK();
          }}
        >
          OK
        </Button>
        <Button
          variant="contained"
          sx={{ float: "right", marginRight: "15px" }}
          onClick={handleExportDialogClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
