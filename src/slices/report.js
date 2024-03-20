import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import DatabaseService from '../services/DatabaseService'
import ReportService from "../services/ReportService";

const initialState = {
  reportDatabase: [],
  reportTables: [],
  reportDimTable: [],
  reportRows: [],
  reportCols: [],
  reportPages: [],
  reportTableData: {},
  reportPivotInfo: {},
  reportResultOfPivot: {},
  reportExpandedRows: [],
  reportExpandedCols: [],
  reportExpandedPages: [],
  reportHistory: [],
};

// export const connectDB = createAsyncThunk(
//   "database/connect",
//   async (dbInfo) => {
//     const res = await DatabaseService.connectDatabase(dbInfo);
//     return res.data;
//   }
// );

export const saveLog = createAsyncThunk("/saveLog", async (logInfo) => {
  console.log("report slice savelog", logInfo);
  const res = await ReportService.saveLog(logInfo);
  return res.data;
});

export const reportHistory = createAsyncThunk(
  "/reportHistory",
  async (userInfo) => {
    const res = await ReportService.reportHistory(userInfo);
    return res.data;
  }
);

export const getTables = createAsyncThunk("/getTables", async (dbInfo) => {
  const res = await ReportService.getTables(dbInfo);
  return res.data;
});

export const getTableData = createAsyncThunk("/getTableData", async (table) => {
  const res = await ReportService.getTableData(table);
  let result = {};
  result[table] = res.data.data;
  console.log(result);
  return result;
});

export const pivot = createAsyncThunk("/pivot", async (pivotInfo) => {
  const res = await ReportService.pivot(pivotInfo);
  return res.data;
});

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReportDatabase: (state, action) => {
      state.reportDatabase = action.payload;
    },

    setReportHistory: (state, action) => {
      state.reportHistory = action.payload;
    },

    setReportTables: (state, action) => {
      state.reportTables = action.payload;
    },

    setReportTableData: (state, action) => {
      state.reportTableData = action.payload;
    },

    setReportDimTable: (state, action) => {
      state.reportDimTable = action.payload;
    },

    setReportRows: (state, action) => {
      state.reportRows = action.payload;
    },

    setReportCols: (state, action) => {
      state.reportCols = action.payload;
    },

    setReportPages: (state, action) => {
      state.reportPages = action.payload;
    },

    setReportExpandedRows: (state, action) => {
      state.reportExpandedRows = action.payload;
    },

    setReportExpandedCols: (state, action) => {
      state.reportExpandedCols = action.payload;
    },

    setReportExpandedPages: (state, action) => {
      state.reportExpandedPages = action.payload;
    },

    setReportPivotInfo: (state, action) => {
      // console.log("setReportPivotInfo", action.payload);
      const { kind, data } = action.payload;
      // console.log("1233333333333333333", kind, data);
      state.reportPivotInfo[kind] = data;
      // state.reportPages = action.payload;
    },

    setSavedData: (state, action) => {
      const {
        rows,
        cols,
        pages,
        expandedRows,
        expandedCols,
        expandedPages,
        tableData,
        pivotInfo,
      } = action.payload;
      state.reportRows = rows;
      state.reportCols = cols;
      state.reportPages = pages;
      state.reportExpandedRows = expandedRows;
      state.reportExpandedCols = expandedCols;
      state.reportExpandedPages = expandedPages;
      state.reportTableData = tableData;
      state.reportPivotInfo = pivotInfo;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTables.fulfilled, (state, action) => {
        const { data, success } = action.payload;
        if (success) {
          let formattedData = [];
          data.forEach((item) => {
            formattedData.push({ id: item, content: item });
          });
          state.reportTables = formattedData;
          state.reportCols = [];
          state.reportRows = [];
          state.reportDimTable = [];
          state.reportPages = [];
        } else {
          console.log("getTables failed");
        }
      })
      .addCase(saveLog.fulfilled, (state, action) => {
        state.reportHistory.unshift(action.payload);
      })
      .addCase(reportHistory.fulfilled, (state, action) => {
        state.reportHistory = action.payload;
      })
      .addCase(getTableData.fulfilled, (state, action) => {
        for (const key in action.payload) {
          state.reportTableData[key] = action.payload[key];
        }
        return state;
      })
      .addCase(pivot.fulfilled, (state, action) => {
        state.reportResultOfPivot = action.payload.Return;
      });
  },
});

export const {
  setReportDatabase,
  setReportHistory,
  setReportRows,
  setReportCols,
  setReportPages,
  setReportDimTable,
  setReportTables,
  setReportTableData,
  setReportPivotInfo,
  setReportExpandedRows,
  setReportExpandedCols,
  setReportExpandedPages,
  setSavedData,
} = reportSlice.actions;
export default reportSlice.reducer;
