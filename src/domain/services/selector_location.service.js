const constUtilities = require('../utils/constants.util');

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
    const formattedAreasSQL = formattedStringAreasSql(areas);

    try {
      const result = await this._repoSelectorLocation.getAllProvinceHealth(formattedAreasSQL);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDistrictHealth(body) {
    const { provinces } = body;
    const formattedProvincesSQL = formattedStringProvincesSql(provinces);

    try {
      const result = await this._repoSelectorLocation.getAllDistrictHealth(formattedProvincesSQL);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllSubDistrictHealth(body) {
    const { districts } = body;
    const formattedDistrictsSQL = formattedStringDistrictsSql(districts);

    try {
      const result = await this._repoSelectorLocation.getAllSubDistrictHealth(formattedDistrictsSQL);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDatas({ areas, provinces, districts }) {
    const { conditionClause, argSelectorLocation } = getConditionsAndArguments(areas, provinces, districts);

    // const result = { conditions: conditionClause, ...argSelectorLocation };

    try {
      const result = await this._repoSelectorLocation.getAllDatas(conditionClause, argSelectorLocation);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

function formattedStringAreasSql(areas) {
  if (areas === null || areas === undefined || areas.length === 0) {
    return '';
  }

  return areas.map((area) => `N'${area}'`).join(', ');
}

function formattedStringProvincesSql(provinces) {
  if (provinces === null || provinces === undefined || provinces.length === 0) {
    return '';
  }

  return provinces.map((province) => `N'${province}'`).join(', ');
}

function formattedStringDistrictsSql(districts) {
  if (districts === null || districts === undefined || districts.length === 0) {
    return '';
  }

  return districts.map((district) => `N'${district}'`).join(', ');
}

function formattedConditionAreas() {
  return `${constUtilities.SERVICE_AREA_HEALTH_COLUMN} IN @areas`;
}

function formattedConditionProvinces() {
  return `${constUtilities.PROVINCE_HEALTH_COLUMN} IN @provinces`;
}

function formattedConditionDistricts() {
  return `${constUtilities.DISTRICT_HEALTH_COLUMN} IN @districts`;
}

function formattedConditionClause(conditions) {
  if (conditions === null || conditions === undefined || conditions.length === 0) {
    return '';
  }

  return conditions.join(' OR ');
}

function getConditionsAndArguments(areas, provinces, districts) {
  const conditions = [];

  const conditionAreas = formattedConditionAreas();
  const conditionProvinces = formattedConditionProvinces();
  const conditionDistricts = formattedConditionDistricts();

  if (areas && areas.length > 0) {
    conditions.push(conditionAreas);
  }

  if (provinces && provinces.length > 0) {
    conditions.push(conditionProvinces);
  }

  if (districts && districts.length > 0) {
    conditions.push(conditionDistricts);
  }

  const formattedAreasSQL = formattedStringAreasSql(areas);
  const formattedProvincesSQL = formattedStringProvincesSql(provinces);
  const formattedDistrictsSQL = formattedStringDistrictsSql(districts);

  const conditionClause = formattedConditionClause(conditions);

  const argSelectorLocation = {
    areas: formattedAreasSQL,
    provinces: formattedProvincesSQL,
    districts: formattedDistrictsSQL,
  };

  return { conditionClause, argSelectorLocation };
}

module.exports = { newServiceSelectorLocation };
