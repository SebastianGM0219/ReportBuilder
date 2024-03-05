import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import DatabaseService from '../services/DatabaseService'

const initialState = {
  success: false,
  primaryKeyInfo: null,
  foreignKeyInfo: null,
  tableFieldInfo: null,
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
  name: 'database',
  initialState,
  reducers:{
      initAllDatabaseTable:(state, action) => {
        return {
          ...state,
          ...initialState
        }
      },
      saveDbInformation: (state, action) => {
        state.dbInfo = action.payload;
      }
    },
  extraReducers: {
    [connectDB.fulfilled]: (state, action) => {
      state = action.payload
      // state.primaryKeyInfo = action.payload.primaryKeyInfo; // Assuming primary key information is included in the response
      // state.foreignKeyInfo = action.payload.foreignKeyInfo; // Assuming foreign key information is included in the response
      // state.tableFieldInfo = action.payload.tableFieldInfo; // Assuming table and field information is included in the response

      // state.primaryKeyInfo = action.payload.primaryKeyInfo; // Assuming primary key information is included in the response
      // state.foreignKeyInfo = action.payload.foreignKeyInfo; // Assuming foreign key information is included in the response
      // state.tableFieldInfo = action.payload.tableFieldInfo; // Assuming table and field information is included in the response
      return state;
    }
  }
})  

const {reducer} = databaseSlice;
export const {initAllDatabaseTable, saveDbInformation} = databaseSlice.actions;
export default reducer;