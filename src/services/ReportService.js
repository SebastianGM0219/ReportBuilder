import http from "../config/http-common";

const saveLog = (logInfo) => {
  // console.log("saveLog service", logInfo);
  return http.post("/saveLog", logInfo)
}

const reportHistory = (userInfo) => {
  // console.log("reportHistory service", userInfo)
  return http.post("/reportHistory", userInfo)
}

const getTables = (dbInfo) => {
  return http.post("/getTables", dbInfo);
};

const getTableData = (table) => {
  return http.post("/getTableData", {table: table});
};

const pivot = (pivotInfo) => {
  // console.log(JSON.stringify(pivotInfo));
  const config = {
    method: 'post',
    url: 'http://localhost:4000/pivot',
    headers: {
      'Content-Type': 'text/plain'
    },
    data: JSON.stringify(pivotInfo)
  };
  return http.request(config);
};

const ReportService = {
  pivot,
  getTables,
  getTableData,
  reportHistory,
  saveLog
};

export default ReportService;
