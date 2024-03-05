import http from "../config/http-common";

const runQuery = (queryInfo) => {
  return http.post("/query", queryInfo);
};
const testQuery = (queryInfo) => {
  console.log(queryInfo);
  return http.post("/testquery", queryInfo);
};

const QueryService = {
  runQuery,
  testQuery,
};

export default QueryService;
