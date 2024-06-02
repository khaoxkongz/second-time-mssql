const { sqlQueryConditionAreas } = require('./condition_query_string.util');
const { sqlQueryConditionProvinces, sqlQueryConditionDistricts } = require('./condition_query_string.util');

const { formattedStringAreasSql } = require('./format_query_string.util');
const { formattedStringProvincesSql, formattedStringDistrictsSql } = require('./format_query_string.util');

function formattedConditionClause(conditions) {
  if (conditions === null || conditions === undefined || conditions.length === 0) {
    return '';
  }

  return conditions.join(' OR ');
}

function getConditionsAndArguments(areas, provinces, districts) {
  const conditions = [];

  const conditionAreas = sqlQueryConditionAreas();
  const conditionProvinces = sqlQueryConditionProvinces();
  const conditionDistricts = sqlQueryConditionDistricts();

  if (areas !== null && areas !== undefined && areas.length > 0) {
    conditions.push(conditionAreas);
  }

  if (provinces !== null && provinces !== undefined && provinces.length > 0) {
    conditions.push(conditionProvinces);
  }

  if (districts !== null && districts !== undefined && districts.length > 0) {
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

module.exports = { getConditionsAndArguments };
