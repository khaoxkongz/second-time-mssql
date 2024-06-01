const constUtilities = require('../utils/constants.util');

function newServiceSelectorLocation(selectorLocationRepo) {
  return new ServiceSelectorLocation(selectorLocationRepo);
}

class ServiceSelectorLocation {
  _repoSelectorLocation = null;

  constructor(selectorLocationRepo) {
    this._repoSelectorLocation = selectorLocationRepo;
  }

  async getAllProviceHealth(body) {
    const { areas } = body;
    try {
      const data = `(${areas ? areas.map((area) => `N'${area}'`).join(', ') : ''})`;
      console.log(data);
      // const result = await this._selectorLocationRepo.getAllProvinceHealth(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDistrictHealth(body) {
    const { provinces } = body;
    try {
      const data = `(${provinces ? provinces.map((province) => `N'${province}'`).join(', ') : ''})`;
      console.log(data);
      // const result = await this._selectorLocationRepo.getAllDistrictHealth(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllSubDistrictHealth(body) {
    const { districts } = body;
    try {
      const data = `(${districts ? districts.map((district) => `N'${district}'`).join(', ') : ''})`;
      console.log(data);
      // const result = await this._selectorLocationRepo.getAllSubDistrictHealth(data);
      return data;
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

    const dataAreas = `(${areas ? areas.map((area) => `N'${area}'`).join(', ') : ''})`;
    const dataProvinces = `(${provinces ? provinces.map((province) => `N'${province}'`).join(', ') : ''})`;
    const dataDistricts = `(${districts ? districts.map((district) => `N'${district}'`).join(', ') : ''})`;

    const conditionClause = conditions.length > 0 ? `WHERE ${conditions.join(' OR ')}` : '';

    try {
      // const result = await this._selectorLocationRepo.getAllDatas(conditionClause, {
      //   areas: dataAreas,
      //   provinces: dataProvinces,
      //   districts: dataDistricts,
      // });
      const result = {
        conditions: conditionClause,
        areas: dataAreas,
        provinces: dataProvinces,
        districts: dataDistricts,
      };
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { newSelectorLocationService: newServiceSelectorLocation };
