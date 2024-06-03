const sql = require('mssql');

const { DBO_HEALTH_ID_TABLE, SERVICE_AREA_HEALTH_COLUMN } = require('../utils/constants.util');
const { PROVINCE_HEALTH_COLUMN } = require('../utils/constants.util');
const { DISTRICT_HEALTH_COLUMN, SUBDISTRICT_HEALTH_COLUMN } = require('../utils/constants.util');

function newServiceSelectorLocation(repoSelectorLocation) {
  return new ServiceSelectorLocation(repoSelectorLocation);
}

class ServiceSelectorLocation {
  _repoSelectorLocation = null;

  constructor(repoSelectorLocation) {
    this._repoSelectorLocation = repoSelectorLocation;
  }

  async getAllProviceHealth({ areas }) {
    const selectColumns = getSelectColumns(areas, [], []);

    const query = sqlQueryDistinctPattern(selectColumns, DBO_HEALTH_ID_TABLE, {
      whereServiceAreasArray: areas,
      whereServiceAreaColumn: SERVICE_AREA_HEALTH_COLUMN,
      whereProvincesArray: [],
      whereProvinceColumn: '',
      whereDistrictsArray: [],
      whereDistrictColumn: '',
    });

    const inputs = buildInputs(areas, [], []);

    try {
      const result = await this._repoSelectorLocation.getAllProvinceHealth({ query, inputs });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDistrictHealth({ provinces }) {
    const selectColumns = getSelectColumns([], provinces, []);

    const query = sqlQueryDistinctPattern(selectColumns, DBO_HEALTH_ID_TABLE, {
      whereServiceAreasArray: [],
      whereServiceAreaColumn: '',
      whereProvincesArray: provinces,
      whereProvinceColumn: PROVINCE_HEALTH_COLUMN,
      whereDistrictsArray: [],
      whereDistrictColumn: '',
    });

    const inputs = buildInputs([], provinces, []);

    try {
      const result = await this._repoSelectorLocation.getAllDistrictHealth({ query, inputs });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllSubDistrictHealth({ districts }) {
    const selectColumns = getSelectColumns([], [], districts);

    const query = sqlQueryDistinctPattern(selectColumns, DBO_HEALTH_ID_TABLE, {
      whereServiceAreasArray: [],
      whereServiceAreaColumn: '',
      whereProvincesArray: [],
      whereProvinceColumn: '',
      whereDistrictsArray: districts,
      whereDistrictColumn: DISTRICT_HEALTH_COLUMN,
    });

    const inputs = buildInputs([], [], districts);

    try {
      const result = await this._repoSelectorLocation.getAllSubDistrictHealth({ query, inputs });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDatas({ areas, provinces, districts }) {
    const selectColumns = getSelectColumns(areas, provinces, districts);

    const query = sqlQueryDistinctPattern(selectColumns, DBO_HEALTH_ID_TABLE, {
      whereServiceAreasArray: areas,
      whereServiceAreaColumn: SERVICE_AREA_HEALTH_COLUMN,
      whereProvincesArray: provinces,
      whereProvinceColumn: PROVINCE_HEALTH_COLUMN,
      whereDistrictsArray: districts,
      whereDistrictColumn: DISTRICT_HEALTH_COLUMN,
    });

    const inputs = buildInputs(areas, provinces, districts);

    try {
      const result = await this._repoSelectorLocation.getAllDatas({ query, inputs });
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { newServiceSelectorLocation };

function getSelectColumns(areas, provinces, districts) {
  const selectColumns = [];

  if (areas && areas.length > 0) {
    selectColumns.push(PROVINCE_HEALTH_COLUMN);
  }

  if (provinces && provinces.length > 0) {
    selectColumns.push(DISTRICT_HEALTH_COLUMN);
  }

  if (districts && districts.length > 0) {
    selectColumns.push(SUBDISTRICT_HEALTH_COLUMN);
  }

  return selectColumns;
}

function buildConditionClause(conditions) {
  const conditionArray = [];

  const { whereServiceAreasArray, whereProvincesArray, whereDistrictsArray } = conditions;
  const { whereServiceAreaColumn, whereProvinceColumn, whereDistrictColumn } = conditions;

  if (whereServiceAreasArray && whereServiceAreasArray.length > 0) {
    conditionArray.push(`${whereServiceAreaColumn} IN @areas`);
  }

  if (whereProvincesArray && whereProvincesArray.length > 0) {
    conditionArray.push(`${whereProvinceColumn} IN @provinces`);
  }

  if (whereDistrictsArray && whereDistrictsArray.length > 0) {
    conditionArray.push(`${whereDistrictColumn} IN @districts`);
  }

  return conditionArray.join(' OR ');
}

function sqlQueryDistinctPattern(selectColumns, formTable, conditions) {
  const selectClause = selectColumns.join(', ');
  let query = `SELECT DISTINCT ${selectClause} FROM ${formTable}`;

  const conditionClause = buildConditionClause(conditions);

  if (conditionClause) {
    query += ` WHERE ${conditionClause}`;
  }

  return query;
}

function buildInputs(areas, provinces, districts) {
  const inputs = [];

  if (areas && areas.length > 0) {
    const inputAreas = { name: 'areas', type: sql.VarChar(50), value: getFormattedServiceAreas(areas) };
    inputs.push(inputAreas);
  }

  if (provinces && provinces.length > 0) {
    const inputProvinces = { name: 'provinces', type: sql.VarChar(50), value: getFormattedProvinces(provinces) };
    inputs.push(inputProvinces);
  }

  if (districts && districts.length > 0) {
    const inputDistricts = { name: 'districts', type: sql.VarChar(50), value: getFormattedDistricts(districts) };
    inputs.push(inputDistricts);
  }

  return inputs;
}

function getFormattedServiceAreas(serviceAreas) {
  return `(${serviceAreas.map((area) => `N'${area}'`).join(', ')})`;
}

function getFormattedProvinces(provinces) {
  return `(${provinces.map((province) => `N'${province}'`).join(', ')})`;
}

function getFormattedDistricts(districts) {
  return `(${districts.map((district) => `N'${district}'`).join(', ')})`;
}
