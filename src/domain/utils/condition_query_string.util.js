const { SERVICE_AREA_HEALTH_COLUMN } = require('../utils/constants.util');
const { PROVINCE_HEALTH_COLUMN, DISTRICT_HEALTH_COLUMN } = require('../utils/constants.util');

function sqlQueryConditionAreas() {
  return `${SERVICE_AREA_HEALTH_COLUMN} IN @areas`;
}

function sqlQueryConditionProvinces() {
  return `${PROVINCE_HEALTH_COLUMN} IN @provinces`;
}

function sqlQueryConditionDistricts() {
  return `${DISTRICT_HEALTH_COLUMN} IN @districts`;
}

module.exports = {
  sqlQueryConditionAreas,
  sqlQueryConditionProvinces,
  sqlQueryConditionDistricts,
};
