import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import DatabaseService from "../services/DatabaseService";

const initialState = {
  success: false,
  primaryKeyInfo: null,
  foreignKeyInfo: null,
  tableFieldInfo: null,
  dbs: [],
  dbInfo: [],
};

export const connectDB = createAsyncThunk(
  "database/connect",
  async (dbInfo) => {
    const res = await DatabaseService.connectDatabase(dbInfo);
    return res.data;
  }
);

const databaseSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    initAllDatabaseTable: (state, action) => {
      return {
        ...state,
        ...initialState,
      };
    },
    saveDbInformation: (state, action) => {
      state.dbInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connectDB.fulfilled, (state, action) => {
      const { success, databases } = action.payload;
      if (success) {
        state.dbs = databases;
      }
    });
  },
});

const { reducer } = databaseSlice;
export const { initAllDatabaseTable, saveDbInformation } =
  databaseSlice.actions;
export default reducer;
