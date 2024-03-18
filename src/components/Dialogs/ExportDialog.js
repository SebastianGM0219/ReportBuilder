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
import PostAddIcon from "@mui/icons-material/PostAdd";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import NewConnectionDialog from "./NewConnectionDialog";

import {
  getTables,
  reportHistory,
  setReportDatabase,
} from "../../slices/report";

import { notifyContents } from "../Common/Notification";

import { Editor, EditorTools, EditorUtils, ProseMirror } from "@progress/kendo-react-editor";
import { savePDF } from "@progress/kendo-react-pdf";
import { InsertImage } from "./insertImageTool";
import { insertImagePlugin } from "./insertImagePlugin";
import { insertImageFiles } from "./utils";



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

// const InsertSpan = (props) => {
//   const { view } = props;
//   const nodeType = view && view.state.schema.nodes.text;
//   const canInsert = view && EditorUtils.canInsert(view.state, nodeType);
//   return (
//     <Button
//       onClick={() => {
//         const state = view.state;
//         const tr = state.tr;
//         const markType = state.schema.marks.style;
//         const mark = markType.create({ class: "testSpan" });
//         const content = state.schema.text("test");
//         tr.addStoredMark(mark);

//         // https://prosemirror.net/docs/ref/#state.Transaction.replaceSelectionWith
//         tr.replaceSelectionWith(content, true);

//         view.dispatch(tr);
//       }}
//       disabled={!canInsert}
//       onMouseDown={(e) => e.preventDefault()}
//       onPointerDown={(e) => e.preventDefault()}
//       title="Insert span"
//       // https://www.telerik.com/kendo-angular-ui/components/styling/icons/#toc-list-of-font-icons
//       icon="comment"
//     />
//   );
// };

export default function ExportDialog({
  open,
  handleExportDialogClose,
  handleExportDialogOK,
}) {
  const onImageInsert = args => {
    const {
      files,
      view,
      event
    } = args;
    const nodeType = view.state.schema.nodes.image;
    const position = event.type === 'drop' ? view.posAtCoords({
      left: event.clientX,
      top: event.clientY
    }) : null;
    insertImageFiles({
      view,
      files,
      nodeType,
      position
    });
    return files.length > 0;
  };
  const onMount = event => {
    const state = event.viewProps.state;
    const plugins = [...state.plugins, insertImagePlugin(onImageInsert)];
    return new ProseMirror.EditorView({
      mount: event.dom
    }, {
      ...event.viewProps,
      state: ProseMirror.EditorState.create({
        doc: state.doc,
        plugins
      })
    });
  };



  const dispatch = useDispatch();

  const editor = React.createRef();

  const exportPDF = () => {
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
    let element = editor.current;
    // let htmlFile = renderToString(element.view.dom);

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
          defaultContent={
            '<body style="padding:20px"><h3>CUSTOMER: Total</h3><br/><table style="border-collapse:collapse"><thead><tr><th style="background-color:rgb(245, 245, 245);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)"></th><th style="background-color:rgb(245, 245, 245);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)" colSpan="1">Total</th><th style="background-color:rgb(245, 245, 245);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)" colSpan="1">2016-2020</th><th style="background-color:rgb(245, 245, 245);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)" colSpan="1">2016</th></tr></thead><tbody style="border-bottom:1px solid rgb(199, 199, 199)"><tr style="text-align:center"><td style="border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)"></td><td style="border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)">Total</td><td style="border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)">2016-2020</td><td style="border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)">2016</td></tr><tr style="text-align:center"><td style="background-color:rgb(222, 217, 222);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)">Total</td><td style="background-color:rgb(222, 217, 222);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)">195237</td><td style="background-color:rgb(222, 217, 222);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)">49289</td><td style="background-color:rgb(222, 217, 222);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)">345</td></tr><tr style="text-align:center"><td style="background-color:rgb(222, 217, 222);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)">Hardware</td><td style="background-color:rgb(222, 217, 222);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)">90935</td><td style="background-color:rgb(222, 217, 222);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)">18106</td><td style="background-color:rgb(222, 217, 222);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)"></td></tr><tr style="text-align:center"><td style="background-color:rgb(222, 217, 222);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)">Laptops</td><td style="background-color:rgb(222, 217, 222);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)">70848</td><td style="background-color:rgb(222, 217, 222);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)">8685</td><td style="background-color:rgb(222, 217, 222);border-top:1px solid rgb(199, 199, 199);border-bottom:1px solid rgb(199, 199, 199);border-left:1px solid rgb(199, 199, 199);border-right:1px solid rgb(199, 199, 199)"></td></tr></tbody></table></body>'
          }
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
