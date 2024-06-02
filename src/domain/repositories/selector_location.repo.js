const { sqlQueryGetAllDatas, sqlQueryGetAllSubDistrictHealth } = require('../utils/sql_query_string.util');
const { sqlQueryGetAllProvinceHealth, sqlQueryGetAllDistrictHealth } = require('../utils/sql_query_string.util');

// const { executeQuery } = require('../../data/sources/mssql/mssql.database');

function newRepositorySelectorLocation(databaseInstance) {
  return new RepositorySelectorLocation(databaseInstance);
}

class RepositorySelectorLocation {
  _databaseInstance = null;

  constructor(databaseInstance) {
    this._databaseInstance = databaseInstance;
  }

  async getAllProvinceHealth(areas) {
    const query = sqlQueryGetAllProvinceHealth();
    const inputAreas = { name: 'areas', type: 'VarChar(50)', value: areas };
    const argCondition = { query, inputs: [inputAreas] };

    const result = { ...argCondition };

    try {
      // const result = await executeQuery(this._databaseInstance, argCondition);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDistrictHealth(provinces) {
    const query = sqlQueryGetAllDistrictHealth();
    const inputProvinces = { name: 'provinces', type: 'VarChar(50)', value: provinces };
    const argCondition = { query, inputs: [inputProvinces] };

    const result = { ...argCondition };

    try {
      // const result = await executeQuery(this._databaseInstance, argCondition);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllSubDistrictHealth(districts) {
    const query = sqlQueryGetAllSubDistrictHealth();
    const inputDistricts = { name: 'districts', type: 'VarChar(50)', value: districts };
    const argCondition = { query, inputs: [inputDistricts] };

    const result = { ...argCondition };

    try {
      // const result = await executeQuery(this._databaseInstance, argCondition);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDatas(conditions, { areas, provinces, districts }) {
    const query = sqlQueryGetAllDatas(conditions);

    const inputAreas = { name: 'areas', type: 'VarChar(50)', value: areas };
    const inputProvinces = { name: 'provinces', type: 'VarChar(50)', value: provinces };
    const inputDistricts = { name: 'districts', type: 'VarChar(50)', value: districts };

    const argCondition = { query, inputs: [inputAreas, inputProvinces, inputDistricts] };

    const result = { ...argCondition };

    try {
      // const result = await executeQuery(this._databaseInstance, argCondition);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { newRepositorySelectorLocation };
