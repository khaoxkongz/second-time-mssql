const sql = require('mssql');

const { config } = require('../../../domain/configs/db.config');
const { HEALTH_ID_DATABASE } = require('../../../domain/utils/constants.util');

function newDatabaseContext() {
  const databaseInstance = new sql.ConnectionPool(config);
  return new DatabaseContext(databaseInstance);
}

class DatabaseContext {
  _poolInstance = null;
  _connected = false;

  constructor(databaseInstance) {
    this._poolInstance = databaseInstance;
  }

  async connect() {
    try {
      if (this._connected === true) {
        console.log(`Already connected to database ${HEALTH_ID_DATABASE}`);
        return;
      }
      await this._poolInstance.connect();
      this._connected = true;
      console.log(`[TASK_1] Connected to database ${HEALTH_ID_DATABASE}`);
    } catch (err) {
      console.log('[TASK_1] Database Connection Failed! Bad Config: ', err);
    }
  }

  async disconnect() {
    try {
      if (this._connected === false) {
        console.log(`Already disconnected from database ${HEALTH_ID_DATABASE}`);
        return;
      }
      await this._poolInstance.close();
      this._connected = false;
      console.log(`[TASK_3] Disconnected from database ${HEALTH_ID_DATABASE}`);
    } catch (err) {
      console.log('Database disconnection failed!', err);
    }
  }

  async executeQuery({ query, inputs }) {
    try {
      const request = await this._poolInstance.request();
      if (inputs !== undefined && inputs !== null && inputs.length > 0) {
        inputs.forEach((input) => request.input(input.name, input.type, input.value));
      }
      const result = await request.query(query);
      return result.recordsets;
    } catch (error) {
      console.log('Error executing query: ', error);
    }
  }
}

module.exports = { newDatabaseContext };
