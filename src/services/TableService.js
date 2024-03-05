import http from '../config/http-common'

const getTables = () => {
  return http.get('/tables');
}

const getForeignTables = () => {
  return http.get('/foreigntables');
}

const TableService = {
  getTables,
  getForeignTables
}

export default TableService;