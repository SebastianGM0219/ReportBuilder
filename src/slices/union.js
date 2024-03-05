import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { getMouseEventOptions } from "@testing-library/user-event/dist/utils";
import QueryService from '../services/QueryService'

export const runQuery = createAsyncThunk(
  "query/run_view",
  async (queryInfo) => {
    try {
      const res = await QueryService.runQuery(queryInfo);
      return res.data;
    } catch (error) {
      console.log('rrr');
      throw(error);
    }
  }
);
const initialState = {
  TotalTree:[],
  leftTree: [],
  rightTree: [],
  unionType: "UNION ALL",
  codeSQL: "",
  sheetContent: {
    fields: [],
    rowCount: 0,
    rows: []
  },
};
export const unionSlice = createSlice({
  name: 'union',
  initialState,
  reducers: {
    setLeftUnionData: (state, action) => {
      return {
        ...state,
        TotalTree: action.payload.left,
        leftTree: action.payload.left,
        rightTree:[],
      }    
    },
    setUnionGlobalType: (state, action) => {
       return {
        ...state,
        unionType: action.payload.unionType
       }
    },
    setCodeSQL: (state, action) => {
      return {
       ...state,
       codeSQL: action.payload.codeSQL
      }
   },
    setRightUnionData: (state, action) => {
      const  right=action.payload.right;
      return {
        ...state,
        leftTree: state.TotalTree.filter(leftItem => {
          return !right.some(rightItem => leftItem.id === rightItem.id);
        }),
//        leftTree: state.leftTree.filter(item => !right.includes(item)),
        rightTree: right
      }    
    },  

    setLeftUnionData1: (state, action) => {
      const  left=action.payload.left;

      return {
        ...state,
        rightTree: state.TotalTree.filter(leftItem => {
          return !left.some(rightItem => leftItem.id === rightItem.id);
        }),
//        leftTree: state.leftTree.filter(item => !right.includes(item)),
        leftTree: left
      }    
    },  
    removeUnionSelector: (state, action) => {

      const {id} = action.payload;
      const right = state.rightTree.filter(item => item.id!=action.payload.id)
      // console.log(right);
      // console.log(JSON.parse(JSON.stringify(state.leftTree)));
      // console.log("myguards");
      return {
        ...state,
        leftTree: state.TotalTree.filter(leftItem => {
          return !right.some(rightItem => leftItem.id === rightItem.id);
        }),
//        leftTree: state.leftTree.filter(item => !right.includes(item)),
        rightTree: right
      }    
    },  
  },
  extraReducers: {
    [runQuery.fulfilled]: (state, action) => {
      const {fields, rowCount, rows} = action.payload;

      state.sheetContent = {fields, rowCount, rows};
      return state;
    }
  }
})

export const {
  setLeftUnionData,setRightUnionData,
  setCodeSQL,
  removeUnionSelector,setLeftUnionData1,setUnionGlobalType
} = unionSlice.actions;
export default unionSlice.reducer;