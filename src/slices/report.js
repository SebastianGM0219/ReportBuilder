import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import DatabaseService from '../services/DatabaseService'
import ReportService from "../services/ReportService";

const initialState = {
  reportTables: [],
  reportDimTable: [],
  reportRows: [],
  reportCols: [],
  reportPages: [],
  reportTableData: {},
  reportPivotInfo: {},
  reportResultOfPivot: {},
};

// export const connectDB = createAsyncThunk(
//   "database/connect",
//   async (dbInfo) => {
//     const res = await DatabaseService.connectDatabase(dbInfo);
//     return res.data;
//   }
// );

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
  console.log("1111111111111111111111111111111", pivotInfo);
  const res = await ReportService.pivot(pivotInfo);
  return res.data;
});

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReportTables: (state, action) => {
      state.reportTables = action.payload;
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

    setReportPivotInfo: (state, action) => {
      // console.log("setReportPivotInfo", action.payload);
      const { kind, data } = action.payload;
      // console.log("1233333333333333333", kind, data);
      state.reportPivotInfo[kind] = data
      // state.reportPages = action.payload;
    },
  },
  extraReducers: {
    [getTables.fulfilled]: (state, action) => {
      const { data } = action.payload;
      let formattedData = [];
      data.forEach((item) => {
        formattedData.push({ id: item, content: item });
      });
      state.reportTables = formattedData;
      state.reportCols = [];
      state.reportRows = [];
      state.reportDimTable = [];
      state.reportPages = [];
      return state;
    },
    [getTableData.fulfilled]: (state, action) => {
      for (const key in action.payload) {
        // console.log(key, action.payload[key])
        state.reportTableData[key] = action.payload[key];
      }
      // console.log("getTableData fulfilled", state.reportTableData)
      return state;
    },
    [pivot.fulfilled]: (state, action) => {
      console.log("Hey, it's pivot action.payload", action.payload);
      state.reportResultOfPivot = action.payload.Return
      console.log("This is result from backend!", state.reportResultOfPivot)
    },
  },
});

export const {
  setReportRows,
  setReportCols,
  setReportPages,
  setReportDimTable,
  setReportTables,
  setReportPivotInfo,
} = reportSlice.actions;
export default reportSlice.reducer;
