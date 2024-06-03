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

  async getAllProviceHealth(body) {
    const { areas } = body;

    const query = sqlQueryDistinctPattern([PROVINCE_HEALTH_COLUMN], DBO_HEALTH_ID_TABLE, {
      serviceAreas: areas,
      serviceAreaColumn: SERVICE_AREA_HEALTH_COLUMN,
      provinces: [],
      provinceColumn: '',
      districts: [],
      districtColumn: '',
    });

    const inputAreas = { name: 'areas', type: sql.VarChar(50), value: getFormattedServiceAreas(areas) };
    const inputs = [inputAreas];

    try {
      const result = await this._repoSelectorLocation.getAllProvinceHealth({ query, inputs });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDistrictHealth(body) {
    const { provinces } = body;

    const query = sqlQueryDistinctPattern([DISTRICT_HEALTH_COLUMN], DBO_HEALTH_ID_TABLE, {
      serviceAreas: [],
      serviceAreaColumn: '',
      provinces: provinces,
      provinceColumn: PROVINCE_HEALTH_COLUMN,
      districts: [],
      districtColumn: '',
    });

    const inputProvinces = { name: 'provinces', type: sql.VarChar(50), value: getFormattedProvinces(provinces) };
    const inputs = [inputProvinces];

    try {
      const result = await this._repoSelectorLocation.getAllDistrictHealth({ query, inputs });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllSubDistrictHealth(body) {
    const { districts } = body;

    const query = sqlQueryDistinctPattern([SUBDISTRICT_HEALTH_COLUMN], DBO_HEALTH_ID_TABLE, {
      serviceAreas: [],
      serviceAreaColumn: '',
      provinces: [],
      provinceColumn: '',
      districts: districts,
      districtColumn: DISTRICT_HEALTH_COLUMN,
    });

    const inputDistricts = { name: 'districts', type: sql.VarChar(50), value: getFormattedDistricts(districts) };
    const inputs = [inputDistricts];

    try {
      const result = await this._repoSelectorLocation.getAllSubDistrictHealth({ query, inputs });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDatas({ areas, provinces, districts }) {
    const query = sqlQueryDistinctPattern(
      [PROVINCE_HEALTH_COLUMN, DISTRICT_HEALTH_COLUMN, SUBDISTRICT_HEALTH_COLUMN],
      DBO_HEALTH_ID_TABLE,
      {
        serviceAreas: areas,
        serviceAreaColumn: SERVICE_AREA_HEALTH_COLUMN,
        provinces: provinces,
        provinceColumn: PROVINCE_HEALTH_COLUMN,
        districts: districts,
        districtColumn: DISTRICT_HEALTH_COLUMN,
      }
    );

    const inputAreas = { name: 'areas', type: sql.VarChar(50), value: getFormattedServiceAreas(areas) };
    const inputProvinces = { name: 'provinces', type: sql.VarChar(50), value: getFormattedProvinces(provinces) };
    const inputDistricts = { name: 'districts', type: sql.VarChar(50), value: getFormattedDistricts(districts) };

    const inputs = [inputAreas, inputProvinces, inputDistricts];

    try {
      const result = await this._repoSelectorLocation.getAllDatas({ query, inputs });
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { newServiceSelectorLocation };

function getFormattedServiceAreas(serviceAreas) {
  return `(${serviceAreas.map((area) => `N'${area}'`).join(', ')})`;
}

function getFormattedProvinces(provinces) {
  return `(${provinces.map((province) => `N'${province}'`).join(', ')})`;
}

function getFormattedDistricts(districts) {
  return `(${districts.map((district) => `N'${district}'`).join(', ')})`;
}

function buildConditionClause(conditions) {
  const conditionArray = [];

  if (conditions.serviceAreas && conditions.serviceAreas.length > 0) {
    conditionArray.push(`${conditions.serviceAreaColumn} IN @areas`);
  }

  if (conditions.provinces && conditions.provinces.length > 0) {
    conditionArray.push(`${conditions.provinceColumn} IN @provinces`);
  }

  if (conditions.districts && conditions.districts.length > 0) {
    conditionArray.push(`${conditions.districtColumn} IN @districts`);
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
