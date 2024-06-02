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
    const query = sqlQueryGetAllProvinceHealth(areas);

    try {
      const result = await this._databaseInstance.request().query(query);
      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDistrictHealth(provinces) {
    const query = sqlQueryGetAllDistrictHealth(provinces);

    try {
      const result = await this._databaseInstance.request().query(query);
      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllSubDistrictHealth(districts) {
    const query = sqlQueryGetAllSubDistrictHealth(districts);

    try {
      const result = await this._databaseInstance.request().query(query);
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
        .input('areas', sql.VarChar(sql.MAX), areas ? areas : null)
        .input('provinces', sql.VarChar(sql.MAX), provinces ? provinces : null)
        .input('districts', sql.VarChar(sql.MAX), districts ? districts : null)
        .query(query);
      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  }
}

function sqlQueryGetAllProvinceHealth(areas) {
  return `
    SELECT DISTINCT ${constUtilities.PROVINCE_HEALTH_COLUMN}
    FROM ${constUtilities.DBO_HEALTH_ID_TABLE}
    WHERE ${constUtilities.SERVICE_AREA_HEALTH_COLUMN} IN (${areas})
  `;
}

function sqlQueryGetAllDistrictHealth(provinces) {
  return `
    SELECT DISTINCT ${constUtilities.DISTRICT_HEALTH_COLUMN}
    FROM ${constUtilities.DBO_HEALTH_ID_TABLE}
    WHERE ${constUtilities.PROVINCE_HEALTH_COLUMN} IN (${provinces})
  `;
}

function sqlQueryGetAllSubDistrictHealth(districts) {
  return `
    SELECT DISTINCT ${constUtilities.SUBDISTRICT_HEALTH_COLUMN}
    FROM ${constUtilities.DBO_HEALTH_ID_TABLE}
    WHERE ${constUtilities.DISTRICT_HEALTH_COLUMN} IN (${districts})
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

module.exports = { newRepositorySelectorLocation };
