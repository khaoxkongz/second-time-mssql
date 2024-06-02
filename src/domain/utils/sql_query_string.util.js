const { DBO_HEALTH_ID_TABLE, SERVICE_AREA_HEALTH_COLUMN } = require('./constants.util');
const { PROVINCE_HEALTH_COLUMN, DISTRICT_HEALTH_COLUMN, SUBDISTRICT_HEALTH_COLUMN } = require('./constants.util');

function sqlQueryGetAllProvinceHealth() {
  return `SELECT DISTINCT ${PROVINCE_HEALTH_COLUMN} FROM ${DBO_HEALTH_ID_TABLE} WHERE ${SERVICE_AREA_HEALTH_COLUMN} IN @areas`;
}

function sqlQueryGetAllDistrictHealth() {
  return `SELECT DISTINCT ${DISTRICT_HEALTH_COLUMN} FROM ${DBO_HEALTH_ID_TABLE} WHERE ${PROVINCE_HEALTH_COLUMN} IN @provinces`;
}

function sqlQueryGetAllSubDistrictHealth() {
  return `SELECT DISTINCT ${SUBDISTRICT_HEALTH_COLUMN} FROM ${DBO_HEALTH_ID_TABLE} WHERE ${DISTRICT_HEALTH_COLUMN} IN @districts`;
}

function sqlQueryGetAllDatas(conditions) {
  return `SELECT DISTINCT ${PROVINCE_HEALTH_COLUMN}, ${DISTRICT_HEALTH_COLUMN}, ${SUBDISTRICT_HEALTH_COLUMN} FROM ${DBO_HEALTH_ID_TABLE} WHERE ${conditions}`;
}

module.exports = {
  sqlQueryGetAllProvinceHealth,
  sqlQueryGetAllDistrictHealth,
  sqlQueryGetAllSubDistrictHealth,
  sqlQueryGetAllDatas,
};
