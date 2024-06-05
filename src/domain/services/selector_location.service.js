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

  async getAllDatas({ areas, provinces, districts, subDistricts }, { page, pageSize }) {
    try {
      const selectColumns = getSelectColumns(areas, provinces, districts);
      const { query, queryDistinct, countQuery } = buildQueries(
        selectColumns,
        { areas, provinces, districts, subDistricts },
        { page, pageSize }
      );

      const { queryResult, queryResultDistinct, totalCount } = await this._repoSelectorLocation.getAllDatas({
        query,
        queryDistinct,
        countQuery,
      });
      return {
        currentPage: parseInt(page, 10),
        totalPage: getTotalPageCount(totalCount, pageSize),
        data: queryResult,
        distinctData: queryResultDistinct,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = { newServiceSelectorLocation };

function getTotalPageCount(totalCount, pageSize) {
  return Math.ceil(totalCount / pageSize);
}

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

function buildBaseQuery() {
  return `SELECT DISTINCT [organization_code], [organization_name], [service_area_health], [province_health], [district_health], [subdistrict_health], [health_office_type_health] FROM ${DBO_HEALTH_ID_TABLE}`;
}

function buildWhereClause(conditions) {
  return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
}

function buildOrderByClause(orderByColumns) {
  return orderByColumns.length > 0 ? `ORDER BY ${orderByColumns.join(', ')}` : '';
}

function buildPaginationQuery(baseQuery, whereClause, orderByClause, { page, pageSize }) {
  const offset = (page - 1) * pageSize;
  return `
    SELECT * FROM (
      SELECT ROW_NUMBER() OVER (${orderByClause}) AS RowNum, * FROM (
        ${baseQuery} ${whereClause}
      ) AS SubQuery
    ) AS PaginatedQuery
    ${orderByClause}
    OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY
  `;
}

function buildQueries(selectColumns, { areas, provinces, districts, subDistricts }, { page, pageSize }) {
  const { queryWithPagination, countQuery } = addConditionsToQuery(
    { areas, provinces, districts, subDistricts },
    { page, pageSize }
  );

  const baseQueryDistinct = buildDistinctQuery(selectColumns);
  const queryDistinctWithConditions = addConditionToQuery(baseQueryDistinct, { areas, provinces, districts });

  return {
    query: queryWithPagination,
    queryDistinct: queryDistinctWithConditions,
    countQuery,
  };
}

function addConditionsToQuery({ areas, provinces, districts, subDistricts }, { page, pageSize }) {
  const conditions = [];
  const orderByColumns = [];

  if (areas && areas.length > 0) {
    conditions.push(`${SERVICE_AREA_HEALTH_COLUMN} IN (${areas.map((area) => `N'${area}'`).join(', ')})`);
    orderByColumns.push(SERVICE_AREA_HEALTH_COLUMN);
  }

  if (provinces && provinces.length > 0) {
    conditions.push(`${PROVINCE_HEALTH_COLUMN} IN (${provinces.map((province) => `N'${province}'`).join(', ')})`);
    orderByColumns.push(PROVINCE_HEALTH_COLUMN);
  }

  if (districts && districts.length > 0) {
    conditions.push(`${DISTRICT_HEALTH_COLUMN} IN (${districts.map((district) => `N'${district}'`).join(', ')})`);
    orderByColumns.push(DISTRICT_HEALTH_COLUMN);
  }

  if (subDistricts && subDistricts.length > 0) {
    conditions.push(
      `${SUBDISTRICT_HEALTH_COLUMN} IN (${subDistricts.map((subDistrict) => `N'${subDistrict}'`).join(', ')})`
    );
    orderByColumns.push(SUBDISTRICT_HEALTH_COLUMN);
  }

  const baseQuery = buildBaseQuery();
  const whereClause = buildWhereClause(conditions);

  const countQuery = `SELECT COUNT(*) AS totalCount FROM (${baseQuery} ${whereClause}) AS subQuery`;

  const orderByClause = buildOrderByClause(orderByColumns);
  const queryWithPagination = buildPaginationQuery(baseQuery, whereClause, orderByClause, { page, pageSize });

  return { queryWithPagination, countQuery };
}

function addConditionToQuery(query, { areas, provinces, districts }) {
  const conditions = [];

  if (areas && areas.length > 0) {
    conditions.push(`${SERVICE_AREA_HEALTH_COLUMN} IN ${getFormattedValues(areas)}`);
  }

  if (provinces && provinces.length > 0) {
    conditions.push(`${PROVINCE_HEALTH_COLUMN} IN ${getFormattedValues(provinces)}`);
  }

  if (districts && districts.length > 0) {
    conditions.push(`${DISTRICT_HEALTH_COLUMN} IN ${getFormattedValues(districts)}`);
  }

  if (conditions.length > 0) {
    return `${query} WHERE ${conditions.join(' AND ')}`;
  }

  return query;
}

function buildDistinctQuery(selectColumns) {
  if (selectColumns.includes(SUBDISTRICT_HEALTH_COLUMN)) {
    return `SELECT DISTINCT ${SUBDISTRICT_HEALTH_COLUMN} FROM ${DBO_HEALTH_ID_TABLE}`;
  } else if (selectColumns.includes(DISTRICT_HEALTH_COLUMN)) {
    return `SELECT DISTINCT ${DISTRICT_HEALTH_COLUMN} FROM ${DBO_HEALTH_ID_TABLE}`;
  } else if (selectColumns.includes(PROVINCE_HEALTH_COLUMN)) {
    return `SELECT DISTINCT ${PROVINCE_HEALTH_COLUMN} FROM ${DBO_HEALTH_ID_TABLE}`;
  }

  return '';
}

function getFormattedValues(values) {
  return `(${values.map((value) => `N'${value}'`).join(', ')})`;
}
