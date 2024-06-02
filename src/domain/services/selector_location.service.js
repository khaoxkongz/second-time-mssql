const { formattedStringAreasSql } = require('../utils/format_query_string.util');
const { formattedStringProvincesSql, formattedStringDistrictsSql } = require('../utils/format_query_string.util');

const { getConditionsAndArguments } = require('../utils/format_condition_string.util');

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

    try {
      const result = await this._repoSelectorLocation.getAllDatas(conditionClause, argSelectorLocation);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { newServiceSelectorLocation };
