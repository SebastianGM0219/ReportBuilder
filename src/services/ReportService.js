import http from "../config/http-common";
import axios from "axios";

const getTables = (dbInfo) => {
  return http.post("/getTables", dbInfo);
};

const getTableData = (table) => {
  return http.post("/getTableData", {table: table});
};

const pivot = (pivotInfo) => {
  console.log(JSON.stringify(pivotInfo));
  const config = {
    method: 'post',
    url: 'http://localhost:4000/pivot',
    headers: {
      'Content-Type': 'text/plain'
    },
    data: JSON.stringify(pivotInfo)
  };
  return http.request(config);
  // return http.post("/pivot", pivotInfo);
};

const ReportService = {
  pivot,
  getTables,
  getTableData
};

export default ReportService;
