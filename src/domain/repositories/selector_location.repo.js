const constUtilities = require('../utils/constants.util');

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

    const result = { argCondition };

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

    const result = { argCondition };

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

    const result = { argCondition };

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

    const result = { argCondition };

    try {
      // const result = await executeQuery(this._databaseInstance, argCondition);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

function sqlQueryGetAllProvinceHealth() {
  return `SELECT DISTINCT ${constUtilities.PROVINCE_HEALTH_COLUMN} FROM ${constUtilities.DBO_HEALTH_ID_TABLE} WHERE ${constUtilities.SERVICE_AREA_HEALTH_COLUMN} IN @areas`;
}

function sqlQueryGetAllDistrictHealth() {
  return `SELECT DISTINCT ${constUtilities.DISTRICT_HEALTH_COLUMN} FROM ${constUtilities.DBO_HEALTH_ID_TABLE} WHERE ${constUtilities.PROVINCE_HEALTH_COLUMN} IN @provinces`;
}

function sqlQueryGetAllSubDistrictHealth() {
  return `SELECT DISTINCT ${constUtilities.SUBDISTRICT_HEALTH_COLUMN} FROM ${constUtilities.DBO_HEALTH_ID_TABLE} WHERE ${constUtilities.DISTRICT_HEALTH_COLUMN} IN @districts`;
}

function sqlQueryGetAllDatas(conditions) {
  return `SELECT DISTINCT ${constUtilities.PROVINCE_HEALTH_COLUMN}, ${constUtilities.DISTRICT_HEALTH_COLUMN}, ${constUtilities.SUBDISTRICT_HEALTH_COLUMN} FROM ${constUtilities.DBO_HEALTH_ID_TABLE} WHERE ${conditions}`;
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

module.exports = { newRepositorySelectorLocation };
