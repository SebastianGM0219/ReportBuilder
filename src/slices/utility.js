import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  treeOpened: false,
  sheetOpened: false,
  isCrossTab: false,
  currentTab: 0,
  currentSelectorTab: 0,
  currentColumn: {
    source: "",
    column: "",
    data: {
      type: "",
      isList: false,
      value: "",
    },
  },
  calcApply: false,
  parameters: [],
  codeSQL: "",
  codeSQLForUnion: "",
  edited: false,
  isUnique: false,
  uniqueTable: "",
  funcIndex: 1,
  codeViewSQL: "",
  currentAsideItem: "Data",
};

export const utilitySlice = createSlice({
  name: "utility",
  initialState,
  reducers: {
    setAllUtility: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    initAllUtility: (state, action) => {
      return {
        ...state,
        treeOpened: true,
        sheetOpened: false,
        isCrossTab: false,
        currentTab: 0,
        currentSelectorTab: 0,
        currentColumn: {
          source: "",
          column: "",
          data: {
            type: "",
            isList: false,
            value: "",
          },
        },
        calcApply: false,
        parameters: [],
        codeSQL: "",
        edited: false,
        isUnique: false,
        uniqueTable: "",
        funcIndex: 1,
      };
    },
    setTreeOpened: (state, action) => {
      state.treeOpened = action.payload;
    },
    setFuncIndex: (state, action) => {
      state.funcIndex = action.payload;
    },
    setSheetOpened: (state, action) => {
      state.sheetOpened = action.payload;
    },
    setCurTab: (state, action) => {
      state.currentTab = action.payload;
    },
    setCurSelectorTab: (state, action) => {
      state.currentSelectorTab = action.payload;
    },

    setCurColumn: (state, action) => {
      state.currentColumn = action.payload.currentColumn;
    },
    createNewParameter: (state, action) => {
      state.parameters.push(action.payload.parameter);
    },
    setCrossTab: (state, action) => {
      state.isCrossTab = action.payload;
    },
    setCodeSQL: (state, action) => {
      state.codeSQL = action.payload;
    },
    setEdited: (state, action) => {
      state.edited = action.payload;
    },
    setCodeViewSQL: (state, action) => {
      state.codeViewSQL = action.payload;
    },
    setCalcApply: (state, action) => {
      state.calcApply = action.payload;
    },
    editParameter: (state, action) => {
      const { name, value } = action.payload;
      const newState = state.parameters.map((item) => {
        if (item.name === name)
          return {
            name: item.name,
            type: item.type,
            isList: item.isList,
            default: item.default,
            value: value,
            list: item.list,
          };
        else return item;
      });
      state.parameters = newState;
    },
    setIsUnique: (state, action) => {
      state.isUnique = action.payload;
    },
    setUniqueTable: (state, action) => {
      state.uniqueTable = action.payload;
    },

    setCurrentAsideItem: (state, action) => {
      state.currentAsideItem = action.payload;
    },
  },
});

export const {
  setCurSelectorTab,
  setTreeOpened,
  setSheetOpened,
  setCurTab,
  setCurColumn,
  createNewParameter,
  setCrossTab,
  setCodeSQL,
  setEdited,
  editParameter,
  setIsUnique,
  setUniqueTable,
  setFuncIndex,
  initUtility,
  initAllUtility,
  setAllUtility,
  setCodeViewSQL,
  setCalcApply,
  setCurrentAsideItem
} = utilitySlice.actions;
export default utilitySlice.reducer;
