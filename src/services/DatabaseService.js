import http from '../config/http-common'

const connectDatabase = (dbInfo) => {
  return http.post('/database' ,dbInfo);
}

const DatabaseService = {
  connectDatabase
}

export default DatabaseService;