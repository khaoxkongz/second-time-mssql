const sql = require('mssql');

const { HEALTH_ID_DATABASE } = require('../../../domain/utils/constants.util');

function newDatabaseContext(config) {
  return new DatabaseContext(config);
}

class DatabaseContext {
  _config = {};
  _poolConnection = null;
  _connected = false;

  constructor(config) {
    this._config = config;
  }

  async connect() {
    try {
      if (this._connected === true) {
        console.log(`Already connected to database ${HEALTH_ID_DATABASE}`);
        return;
      }
      const _poolInstance = new sql.ConnectionPool(this._config);
      this._poolConnection = await _poolInstance.connect();
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
      await this._poolConnection.close();
      this._connected = false;
      console.log(`[TASK_3] Disconnected from database ${HEALTH_ID_DATABASE}`);
    } catch (err) {
      console.log('Database disconnection failed!', err);
    }
  }
}

async function executeQuery(databaseInstance, { query, inputs }) {
  try {
    const request = await databaseInstance.request();
    if (inputs !== undefined && inputs !== null && inputs.length > 0) {
      inputs.forEach((input) => request.input(input.name, input.type, input.value));
    }
    const result = await request.query(query);
    return result.recordsets;
  } catch (error) {
    console.log('Error executing query: ', error);
  }
}

module.exports = { newDatabaseContext, executeQuery };
