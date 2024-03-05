import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import TableService from "../services/TableService";
import { current } from "@reduxjs/toolkit";
import { setRelationData } from "../slices/query";

const initialState = [];
//  const dispatch = useDispatch();

export const getTables = createAsyncThunk("table/get", async () => {
  const res = await TableService.getTables();
  return res.data;
});

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    initAllTable: (state, action) => {
      const newState = state.map((item) => {
        return {
          ...item,
          isChecked: false, // Initialize isChecked to false for each item
        };
      });
      return newState;
    },

    setAllTable: (state, action) => {
      return action.payload;
    },
    updateItem: (state, action) => {
      let array = action.payload.checkedItems;
      let newState = [...state];

      for (let i = 0; i < array.length; i++) {
        const tmpState = newState.map((item) => {
          if (item.name === array[i].name) {
            const newItem = {
              name: item.name,
              isChecked: array[i].checked,
              hasKey: item.hasKey,
              columns: item.columns,
              table_type: item.table_type,
            };
            return newItem;
          }
          return item;
        });
        newState = [...tmpState];
      }
      return newState;
    },

    addUpdateItem: (state, action) => {
      let array = action.payload.newArray;
      let newState = [...state]; // Create a new array to avoid mutating the original state

      for (let i = 0; i < array.length; i++) {
        const existingItem = newState.find(
          (item) => item.name === array[i].name
        );
        if (!existingItem) {
          newState = [
            ...newState,
            {
              name: array[i].name,
              isChecked: true,
              hasKey: array[i].hasKey,
              columns: array[i].columns,
              table_type: array[i].table_type,
            },
          ];
        }
      }

      return newState;
    },
    getItem: (state, action) => {
      const newData = state.filter((item) => item.name === action.payload.text);
      return newData;
    },
    updateColumnItem: (state, action) => {
      const newState = state.map((item) => {
        if (item.name === action.payload.text) {
          const newItem = {
            name: action.payload.text,
            isChecked: item.isChecked,
            hasKey: item.hasKey,
            columns: item.columns,
            table_type: item.table_type,
          };
          return newItem;
        }
        return item;
      });
      return newState;
    },
  },
  extraReducers: {
    [getTables.fulfilled]: (state, action) => {
      return [...action.payload];
    },
  },
});
const { reducer } = tableSlice;
export const {
  updateItem,
  getItem,
  updateColumnItem,
  addUpdateItem,
  initAllTable,
  setAllTable,
} = tableSlice.actions;
export default reducer;
