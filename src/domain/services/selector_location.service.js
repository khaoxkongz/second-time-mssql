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
    const formattedAreasSQL = `(${areas ? areas.map((area) => `N'${area}'`).join(', ') : ''})`;

    try {
      const result = await this._repoSelectorLocation.getAllProvinceHealth(formattedAreasSQL);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDistrictHealth(body) {
    const { provinces } = body;
    const formattedProvincesSQL = `(${provinces ? provinces.map((province) => `N'${province}'`).join(', ') : ''})`;

    try {
      const result = await this._repoSelectorLocation.getAllDistrictHealth(formattedProvincesSQL);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllSubDistrictHealth(body) {
    const { districts } = body;
    const formattedDistrictsSQL = `(${districts ? districts.map((district) => `N'${district}'`).join(', ') : ''})`;

    try {
      const result = await this._repoSelectorLocation.getAllSubDistrictHealth(formattedDistrictsSQL);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDatas({ areas, provinces, districts }) {
    const conditions = [];

    if (areas && areas.length > 0) {
      conditions.push(`${constUtilities.SERVICE_AREA_HEALTH_COLUMN} IN @areas`);
    }

    if (provinces && provinces.length > 0) {
      conditions.push(`${constUtilities.PROVINCE_HEALTH_COLUMN} IN @provinces`);
    }

    if (districts && districts.length > 0) {
      conditions.push(`${constUtilities.DISTRICT_HEALTH_COLUMN} IN @districts`);
    }

    const formattedAreasSQL = `(${areas ? areas.map((area) => `N'${area}'`).join(', ') : ''})`;
    const formattedProvincesSQL = `(${provinces ? provinces.map((province) => `N'${province}'`).join(', ') : ''})`;
    const formattedDistrictsSQL = `(${districts ? districts.map((district) => `N'${district}'`).join(', ') : ''})`;

    const conditionClause = conditions.length > 0 ? `${conditions.join(' OR ')}` : '';

    const argSelectorLocation = {
      areas: formattedAreasSQL,
      provinces: formattedProvincesSQL,
      districts: formattedDistrictsSQL,
    };

    // const result = { conditions: conditionClause, ...argSelectorLocation };

    try {
      const result = await this._repoSelectorLocation.getAllDatas(conditionClause, argSelectorLocation);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { newServiceSelectorLocation };
