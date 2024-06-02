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
    const argCondition = { query, input: { name: 'areas', type: 'VarChar(50)', value: areas } };

    try {
      const result = await executeQuery(this._databaseInstance, argCondition);
      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDistrictHealth(provinces) {
    const query = sqlQueryGetAllDistrictHealth();
    const argCondition = { query, input: { name: 'provinces', type: 'VarChar(50)', value: provinces } };

    try {
      const result = await executeQuery(this._databaseInstance, argCondition);
      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllSubDistrictHealth(districts) {
    const query = sqlQueryGetAllSubDistrictHealth();
    const argCondition = { query, input: { name: 'districts', type: 'VarChar(50)', value: districts } };

    try {
      const result = await executeQuery(this._databaseInstance, argCondition);
      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDatas(conditions, { areas, provinces, districts }) {
    const query = sqlQueryGetAllDatas(conditions);

    try {
      const result = await this._databaseInstance
        .request()
        .input('areas', 'VarChar(50)', areas ? areas : null)
        .input('provinces', 'VarChar(50)', provinces ? provinces : null)
        .input('districts', 'VarChar(50)', districts ? districts : null)
        .query(query);
      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  }
}

function sqlQueryGetAllProvinceHealth() {
  return `
    SELECT DISTINCT ${constUtilities.PROVINCE_HEALTH_COLUMN}
    FROM ${constUtilities.DBO_HEALTH_ID_TABLE}
    WHERE ${constUtilities.SERVICE_AREA_HEALTH_COLUMN} IN @areas
  `;
}

function sqlQueryGetAllDistrictHealth() {
  return `
    SELECT DISTINCT ${constUtilities.DISTRICT_HEALTH_COLUMN}
    FROM ${constUtilities.DBO_HEALTH_ID_TABLE}
    WHERE ${constUtilities.PROVINCE_HEALTH_COLUMN} IN @provinces
  `;
}

function sqlQueryGetAllSubDistrictHealth() {
  return `
    SELECT DISTINCT ${constUtilities.SUBDISTRICT_HEALTH_COLUMN}
    FROM ${constUtilities.DBO_HEALTH_ID_TABLE}
    WHERE ${constUtilities.DISTRICT_HEALTH_COLUMN} IN @districts
  `;
}

function sqlQueryGetAllDatas(conditions) {
  return `
    SELECT DISTINCT ${constUtilities.PROVINCE_HEALTH_COLUMN},
    ${constUtilities.DISTRICT_HEALTH_COLUMN}, ${constUtilities.SUBDISTRICT_HEALTH_COLUMN}
    FROM ${constUtilities.DBO_HEALTH_ID_TABLE}
    WHERE ${conditions}
  `;
}

async function executeQuery(databaseInstance, { query, input }) {
  if (input) {
    return await databaseInstance.request().input(input.name, input.type, input.value).query(query);
  }
  return await databaseInstance.request().query(query);
}

module.exports = { newRepositorySelectorLocation };
