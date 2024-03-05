import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = [];

const savedataSlice = createSlice({
  name: 'savedata', 
  initialState,
  reducers: {
    saveFunc: (state, action) => {
      state.push(action.payload);
      state.push(action.payload);
    }
  },
  
})
const { reducer } = savedataSlice;

export const {saveFunc} = savedataSlice.actions;
export default reducer;