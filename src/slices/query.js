import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import QueryService from '../services/QueryService'
import {getItem} from '../slices/table'
import table from '../slices/table'
import { useDispatch, useSelector } from "react-redux";
import { deleteSpace } from '../functions/string'
import { current } from '@reduxjs/toolkit';
import store from "../store";
const initialState = {
  selectFields: [],
  calcFieldArray:{},
  clickField:{},
  calcApplyStatus: true,
  operatorType: '',
  relationFields: [
    {
      LTable: [],
      RTable: [],
      LFields: [""],
      RFields: [""],
      Operator: [0],
      joinType: 0
    }
  ],
  sortFields: [
    {
      id: 'none',
      text: 'none',
      parent: 0,
      data: {}
    }
  ],
  filterFields: [
    {
      filterVariant: [],
      filterValue: {
        isParam: false,
        default: "",
        parameter: ""
      },
      operator: -1,
      type: ""
    }
  ],
  fieldCalcDrop: [
    {
      filterVariant: [],
      filterValue: {
        isParam: false,
        default: "",
        parameter: ""
      },
      operator: -1,
      type: ""
    }
  ],
  propertyFields: [
    {

    }
  ],
  crosstabSelectorFields: [

  ],
  crosstabColumnFields: [
    {
      id: 'none',
      text: 'none',
      parent: 0,
      data: {}
    }
  ],
  crosstabValueFields: [
    {
      id: 'none',
      text: 'none',
      parent: 0,
      data: {}
    }
  ],
  joinCommand: "",
  sheetContent: {
    fields: [],
    rowCount: 0,
    rows: []
  },
  foreginTable: [],
};

export const runQuery = createAsyncThunk(
  "query/run",
  async (queryInfo) => {
    try {
      const res = await QueryService.runQuery(queryInfo);
      return res.data;
    } catch (error) {
   
      throw(error);
    }
  }
);


export const testQuery = createAsyncThunk(
  "query/testrun",
  async (queryInfo) => {
    try {
      const res = await QueryService.testQuery(queryInfo);
      return res.data.res;
    } catch (error) {
      console.log('rrr');
      throw(error);
    }
  }
);

export const pivot = createAsyncThunk(
  "query/pivot",
  async (pivotInfo) => {
    try {
      const res = await QueryService.testQuery(pivotInfo);
      console.log("pivot res", res)
      return res.data.res;
    } catch (error) {
      console.log('pivot error');
      throw(error);
    }
  }
);


export const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    set: (state, action) => {
      state.selectFields = action.payload;

    },
    setAllState:(state, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
    setCalcFieldArray: (state, action) => {
      state.calcFieldArray[action.payload.id] = action.payload.value;

      let flag = true;
      for (let key in state.calcFieldArray) {
        if (state.calcFieldArray[key] !== true) {
          flag = false;
        }
      }
      state.calcApplyStatus = flag && action.payload.value;


    },
    initAllState:(state, action) => {
      return {
        ...state,
        selectFields: [],
        clickField:{},
        operatorType: '',
        relationFields: [
          {
            LTable: [],
            RTable: [],
            LFields: [""],
            RFields: [""],
            Operator: [0],
            joinType: 0
          }
        ],
        sortFields: [
          {
            id: 'none',
            text: 'none',
            parent: 0,
            data: {}
          }
        ],
        
        filterFields: [
          {
            filterVariant: [],
            filterValue: {
              isParam: false,
              default: "",
              parameter: ""
            },
            operator: -1,
            type: ""
          }
        ],
        fieldCalcDrop: [
          {
            filterVariant: [],
            filterValue: {
              isParam: false,
              default: "",
              parameter: ""
            },
            operator: -1,
            type: ""
          }
        ],
        propertyFields: [
          {
          }
        ],        
        crosstabSelectorFields: [
        ],
        crosstabColumnFields: [
          {
            id: 'none',
            text: 'none',
            parent: 0,
            data: {}
          }
        ],
        crosstabValueFields: [
          {
            id: 'none',
            text: 'none',
            parent: 0,
            data: {}
          }
        ],
        joinCommand: "",
        sheetContent: {
          fields: [],
          rowCount: 0,
          rows: []
        }
      }
    },
    initRelation:(state, action) => {
      return {
        ...state,
        relationFields: [
          {
            LTable: [],
            RTable: [],
            LFields: [""],
            RFields: [""],
            Operator: [0],
            joinType: 0
          }
        ]
      }
    },
    resetBasedOnCommand: (state, action) => {
      const {command,tables} = action.payload;
 ///     state.joinCommand = command;
 
      let sqlQuery = command;
      sqlQuery = deleteSpace(sqlQuery);

      const selectRegex = /SELECT(.*?)FROM/i;
      const selectMatch = sqlQuery.match(selectRegex);
      const select = selectMatch ? selectMatch[1].trim() : '';

      //handle select


      const fromRegex = /FROM(.*?)(LEFT JOIN|INNER JOIN|RIGHT JOIN|FULL JOIN|WHERE|ORDER BY|;)/i;
      const fromMatch = sqlQuery.match(fromRegex);
      let from = fromMatch ? fromMatch[1].trim() : '';

      if(from === '') {
        const fromRegex = /FROM(.*)/i;
        const fromMatch = sqlQuery.match(fromRegex);
        from = fromMatch ? fromMatch[1].trim() : '';
      }

      const joinRegex = /(LEFT JOIN|INNER JOIN|RIGHT JOIN|FULL JOIN)(.*?)(?=(?:WHERE|ORDER BY|LEFT JOIN|INNER JOIN|RIGHT JOIN|FULL JOIN|;)|$)/gi;
      const joinMatch = sqlQuery.match(joinRegex);  
      const joinConditions = [];
      let match;
      while ((match = joinRegex.exec(sqlQuery)) !== null) {
        joinConditions.push(match[0].trim());
      }

      let j;
      console.log(joinConditions);
      for(let i = 0; i < joinConditions.length; i++) {
          let tempRTable=[];
          let tempLTable=[];
          let tempOperator= [], tempRField = [], tempLField = [];
          const joinConditionRegex = /(?:LEFT JOIN|INNER JOIN|RIGHT JOIN|FULL JOIN)\s+(\w+)\s+ON\s+(.*)/i;
          const joinConditionMatch = joinConditions[i].match(joinConditionRegex);

          tempRTable.push(joinConditionMatch[1]);        

          const conditions = joinConditionMatch[2];
          const conditionsArray = conditions.split(/\b\s+(AND|OR)\s+\b/);
          const logicalOperatorsRegex = /AND|OR/ig;
          const logicalOperatorsArray = conditions.match(logicalOperatorsRegex);
          let tempJoinType;

          for(j = 0; j < conditionsArray.length; j++) {
            if(j%2===0) {
              const tempJoinType = conditionsArray[j].split(/\b\s+(=|!=)\s+\b/);
              const left_temp = tempJoinType[0];
              const type = tempJoinType[1];
              const right_temp = tempJoinType[2];
              
              if(left_temp.split(".")[0] === joinConditionMatch[1]) {
                tempRField.push(left_temp)          
                tempLTable.push(right_temp.split(".")[0])
                tempLField.push(right_temp)
                if(type === "=") {
                  tempOperator.push(0);
                } else {
                  tempOperator.push(1);
                }
              } else {
                tempRField.push(right_temp)          
                tempLTable.push(left_temp.split(".")[0])
                tempLField.push(left_temp)

                if(type === "=") {
                  tempOperator.push(0);
                }
                else {
                  tempOperator.push(1);              
                }
              }
            }
          }
          if(joinConditions[i].includes("LEFT JOIN")) {
            tempJoinType = 0;
          }
          if(joinConditions[i].includes("RIGHT JOIN")) {
            tempJoinType = 1;
          }
          if(joinConditions[i].includes("INNER JOIN")) {
            tempJoinType = 2;
          }
          if(joinConditions[i].includes("FULL JOIN")) {
            tempJoinType = 3;
          }

          joinConditionMatch[1].split("=");        

          const newRelationField = {
            LTable: tempLTable,
            RTable: tempRTable,
            LFields: tempLField,
            RFields: tempRField,
            Operator: tempOperator,
            joinType: tempJoinType
          };
          if (state.relationFields[state.relationFields.length-1].RTable.length === 0) {
            state.relationFields= [...state.relationFields.slice(1), newRelationField];
          } else {
            state.relationFields= [...state.relationFields, newRelationField];
          }
        }

        const whereRegex = /WHERE(.*?)ORDER BY/i;
        const whereMatch = sqlQuery.match(whereRegex);
        let where = whereMatch ? whereMatch[1].trim() : '';
        if(where === '') {
          const whereRegex = /WHERE(.*)/i;
          const whereMatch = sqlQuery.match(whereRegex);
          where = whereMatch ? whereMatch[1].trim() : '';
        }

        const orderByRegex = /ORDER BY(.*)/i;
        const orderByMatch = sqlQuery.match(orderByRegex);
        const orderBy = orderByMatch ? orderByMatch[1].trim() : '';
        const select_new = select.trim(); 
        const field_array=select_new.split(",").map(item => item.trim());

/*        for(let i = 0; i < field_array.length; i++) {
           const parent = field_array[i].split(".")[0];
           const child = field_array[i].split(".")[1];
           const search = tables.filter(item => item.name === parent);
           const column = search[0].columns.filter(item => item.name === child)[0];
           const item= search[0];

           state.selectFields = [
              ...state.selectFields,
              {
                id: item.name + '-' + column.name + '-' + column.type,
                droppable: false,
                parent: 0,
                text: column.name,
                data: {
                  type: column.type,
                  isKey: column.isKey,
                  table: item.name,
                  header_name: column.name,
                  field: column.name,
                  columnId: column.name,
                  aggreType: 'none',
                  hasKey: column.isKey,
                }
              }
            ];
        }*/

        const extractedValues = {
          field_array,
          from,
          joinConditions,
          where,
          orderBy
        };
    },
    addRelation: (state, action) => {
      const tableArray = [];
      state.relationFields.forEach((item, i) => {
        if(i === 0) {
          tableArray.push(item.LTable[0]);
        }
        if(i < state.relationFields.length) {
          tableArray.push(item.RTable[0]);
        } 
      });
      state.relationFields.push({
        LTable: tableArray,
        RTable: [],
        LFields: [""],
        RFields: [""],
        Operator: [0],
        joinType: 0
      });
    },    
    initForeignTable: (state, action) => {
      state.foreginTable = action.payload.foreginTable;
    },
    addField: (state, action) => {
      state.relationFields[action.payload].LFields.push("");
      state.relationFields[action.payload].RFields.push("");
      state.relationFields[action.payload].Operator.push(0);
    },
    removeField: (state, action) => {
      const { index, i } = action.payload;
      if (i > -1) {
        state.relationFields[index].LFields.splice(i, 1);
        state.relationFields[index].RFields.splice(i, 1);
        state.relationFields[index].Operator.splice(i, 1);
      }
    },

    removeJoinRelation: (state, action) => {
      const { index } = action.payload;      
      state.relationFields.splice(index,1);
      if(state.relationFields.length==0)
      {
        state.relationFields =  [
          {
            LTable: [],
            RTable: [],
            LFields: [""],
            RFields: [""],
            Operator: [0],
            joinType: 0
          }
        ];
      }
      // if (i > -1) {
      //   state.relationFields[index].LFields.splice(i, 1);
      //   state.relationFields[index].RFields.splice(i, 1);
      //   state.relationFields[index].Operator.splice(i, 1);
      // }
    },
    AddRelationData: (state, action) => {
      const {leftTable, rightTable, leftField, rightField} = action.payload;
      if (state.relationFields[state.relationFields.length-1].RTable.length === 0) {
        const newRelationField = {
          LTable: leftTable,
          RTable: rightTable,
          LFields: leftField,
          RFields: rightField,
          Operator: [0],
          joinType: 0
        };
        return {
          ...state,
          relationFields: [...state.relationFields.slice(1), newRelationField]
        };
      }      
      else{
        const newRelationField = {
          LTable: leftTable,
          RTable: rightTable,
          LFields: leftField,
          RFields: rightField,
          Operator: [0],
          joinType: 0
        };
  
        return {
          ...state,
          relationFields: [...state.relationFields, newRelationField]
        };
      }

    },
    setRelationData: (state, action) => {
      const {index, type, table, field} = action.payload;
      if(type === "left") {
        console.log(JSON.parse(JSON.stringify(state.relationFields)));
        state.relationFields[index].LTable = table;
        state.relationFields[index].LFields = field;
      }
      else {
        state.relationFields[index].RTable = table;
        state.relationFields[index].RFields = field;
      }
    },
    setOperator: (state, action) => {
      const {relationIndex, fieldIndex, operator} = action.payload;
      state.relationFields[relationIndex].Operator[fieldIndex] = operator;
    },
    setOperatorType: (state, action) => {
      state.operatorType = action.payload;
    },
    setJoinType: (state, action) => {
      const {value, index} = action.payload;
      state.relationFields[index].joinType = value;
    },
    setSortData: (state, action) => {
      state.sortFields = action.payload;
    },
    setSortType: (state, action) => {
      const {id, sortType} = action.payload;
      state.sortFields.forEach(item => {
        if(item.id === id) {
          item.data.sortType = sortType;
        }
      })
    },
    setFilterVariant: (state, action) => {
      const {index, filterVariant} = action.payload;
      const { data:{ type } } = filterVariant[0];
      state.filterFields[index].filterVariant = filterVariant;
      state.filterFields[index].operator = 0;
      state.filterFields[index].type = type;
    },
    setFieldCalcDrop: (state, action) => {
      const {index, FieldCalcDrop} = action.payload;
      const { data:{ type } } = FieldCalcDrop[0];
      state.fieldCalcDrop[index].filterVariant = FieldCalcDrop;
      state.fieldCalcDrop[index].operator = 0;
      state.fieldCalcDrop[index].type = type;

    },
    removeFieldCalcDrop: (state, action) => {
      const { id } = action.payload;
//      let removedIndex = -1;
      const newState = state.fieldCalcDrop.filter(item =>  (item.filterVariant && item.filterVariant.length === 0) || item.filterVariant && item.filterVariant[0] &&item.filterVariant[0].id !==id);
      state.fieldCalcDrop = newState;

    },
    addNewFilter: (state, action) => {
      state.filterFields.push({
        filterVariant: [],
        filterValue: {
          isParam: false,
          default: "",
          parameter: ""
        },
        operator: -1,
        type: ""
      });
    },
    addNewFieldDropCalc: (state, action) => {
      state.fieldCalcDrop.push({
        filterVariant: [],
        filterValue: {
          isParam: false,
          default: "",
          parameter: ""
        },
        operator: -1,
        type: ""
      });
    },
    initFilter:(state,action) => {
//      state.filterFields.push({filterVariant:[]});
        return  {...state,
          filterFields:
          [{
          filterVariant: [],
          filterValue: {
            isParam: false,
            default: "",
            parameter: ""
          },
          operator: -1,
          type: ""}]};
    },
    removeFilter: (state, action) => {
      const { id } = action.payload;
      let removedIndex = -1;
      const newState = state.filterFields.filter((item, index) => {
        if(index!==state.filterFields.length-1 && item.filterVariant[0].id===id) removedIndex = index;
        if(index===state.filterFields.length-1 || item.filterVariant[0].id!==id) return item;
      });

      const command = state.joinCommand;
      const andOrArray = command.match(/\bAND\b|\bOR\b/g);

      if(newState.length !== state.filterFields.length){
        let newCommand = "";
        if(andOrArray === null) newCommand = ""; 
        else if(andOrArray.length > 0) newCommand="{1}";
        
        if(andOrArray !== null && andOrArray.length > 1) {
          if(removedIndex === 0) removedIndex=1;
          const removedArray = andOrArray.slice(0, removedIndex-1).concat(andOrArray.slice(removedIndex-0));
          removedArray.forEach( (item, index) => {
            newCommand += ` ${item} {${index+2}}`;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
          })
        }           
        state.joinCommand = newCommand;
      }

      state.filterFields = newState;
    },
    setFilterOperator: (state, action) => {
      const { index, value } = action.payload;
      state.filterFields[index].operator = value;
    },
    setFilterValue: (state, action) => {
      const {index, filterValue} = action.payload;
      state.filterFields[index].filterValue = filterValue;
    },
    setFieldValue: (state, action) => {
      const {index, name, type} = action.payload;
//      state.filterFields[index].filterValue = filterValue;
    },
    removeSelector: (state, action) => {
      const { id } = action.payload;
      // const find = state.selectFields.filter(item => item.id === id);
      // const jsonData = JSON.stringify(find);
      // const parsedData = JSON.parse(jsonData);
      // const tableValue = parsedData[0].data.table;
      const newState_filter = state.selectFields.filter(item => item.id !== id).map(item => item.data.table);
      const uniqueArray = [...new Set(newState_filter)];
      const relation = state.relationFields.filter(item => uniqueArray.includes(item.RTable[0])  && uniqueArray.includes(item.LTable[0]) );      
      const newState = state.selectFields.filter(item => item.id !== id);
//      state.calcFieldArray[item.id]
      console.log("removeSelector");
      console.log(newState);

      state.selectFields = newState;
      state.relationFields = relation;
      if(relation.length===0) {
        state.relationFields.push({
          LTable: [],
          RTable: [],
          LFields: [""],
          RFields: [""],
          Operator: [0],
          joinType: 0
        });
      }
      if(state.clickField &&id === state.clickField.id) {
        state.clickField = {};
      }
    },

    setValueSelector: (state, action) => {
/*      const { id } = action.payload;
//      const newState = state.selectFields.filter(item => item.id !== id);
     
      state.selectFields = newState;
*/
       const { id, name, aggreType} = action.payload;
      
       const updatedFields = state.selectFields.map(item => {
        if (item.id === id) {
          return {...item, data: { ...item.data, header_name: name, aggreType: aggreType}};          
        }
        return item;
      });

      state.selectFields = updatedFields;
    }, 
    setValueSelectorInCalc: (state, action) => {
/*      const { id } = action.payload;
//      const newState = state.selectFields.filter(item => item.id !== id);
     
      state.selectFields = newState;
*/
        const { id, name,field,  command, dropbox, columnId, table, type} = action.payload;
          
        const updatedFields = state.selectFields.map(item => {
        if (item.id === id) {
          return {...item, data: { ...item.data, header_name: name, command: command, dropbox: dropbox, columnId: columnId, table: table, type: type, field: field}};          
        }
        return item;
        });
        state.selectFields = updatedFields;
    }, 
    setSourceColumnSelector: (state, action) => {
      const{id, source, sourceColumn,field, type} = action.payload;
      const updatedFields = state.selectFields.map(item => {
        if (item.id === state.clickField.id) {
          return {...item, data: { ...item.data, table: source,field: field,type:type}, text: sourceColumn};          
        }
        return item;
      });
      state.selectFields = updatedFields;
    },
    setAutoJoinRelation: (state, action) => {

    },
    clickSelector: (state, action) => {
      const { id } = action.payload;
      const newState = state.selectFields.find(item => item.id === id);
      state.clickField = newState; 
      if(state.clickField && state.clickField.data&&action.payload.id.includes("function"))
      {
        if (!state.clickField?.data?.dropbox) {
          state.clickField.data = {...state.clickField.data,command: "", dropbox:
            [
            {
              filterVariant: [],
              filterValue: {
                isParam: false,
                default: "",
                parameter: ""
              },
              operator: -1,
              type: ""
            }
          ]};
        }
        state.fieldCalcDrop = state.clickField.data.dropbox;        
      }
    },
    setJoinCommand: (state, action) => {
      state.joinCommand = action.payload;
    },
    setColumnData: (state, action) => {
      state.crosstabColumnFields = action.payload;
    },    
    setCrossTabSelector: (state, action) => {
      state.crosstabSelectorFields = action.payload;
    },
    setCrossTabValue: (state, action) => {
      state.crosstabValueFields = action.payload;
    },
    setFieldCalCommand: (state, action) => {

    },
    formatCrossFields: (state, action) => {
      state.crosstabSelectorFields = state.selectFields;
      state.crosstabColumnFields = [
        {
          id: 'none',
          text: 'none',
          parent: 0,
          data: {}
        }
      ];
      state.crosstabValueFields = [
        {
          id: 'none',
          text: 'none',
          parent: 0,
          data: {}
        }
      ];
    },
    removeSortField: (state, action) => {
      const { id } = action.payload;
      const newState = state.sortFields.filter(item => item.id !== id);
      state.sortFields = newState;
    }
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
  set, 
  setSourceColumnSelector,
  clickSelector,
  removeSelector,
  addRelation, 
  addField,
  removeField,
  setRelationData, 
  setOperator, 
  setJoinType,
  setSortData, 
  setSortType,
  setOperatorType,
  setFilterVariant,
  setFieldCalcDrop,
  addNewFilter,
  removeFilter,
  setFilterOperator,
  setFilterValue,
  setFieldValue,
  setJoinCommand,
  setColumnData,
  setCrossTabSelector,
  setCrossTabValue,
  formatCrossFields,
  removeSortField,
  setValueSelector,
  setValueSelectorInCalc,  
  addNewFieldDropCalc,
  initAllState,
  initRelation,
  AddRelationData,
  initForeignTable,
  removeJoinRelation,
  resetBasedOnCommand,
  initFilter,
  removeFieldCalcDrop,
  setAllState,
  setCalcFieldArray
} = querySlice.actions;
export default querySlice.reducer;




