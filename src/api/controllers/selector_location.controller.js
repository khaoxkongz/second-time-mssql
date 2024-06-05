const response = require('../response');

function newControllerSelectorLocation(serviceSelectorLocation) {
  return new ControllerSelectorLocation(serviceSelectorLocation);
}

class ControllerSelectorLocation {
  _serviceSelectorLocation = null;

  constructor(serviceSelectorLocation) {
    this._serviceSelectorLocation = serviceSelectorLocation;
  }

  async getAllDatas(req, res) {
    const { page = 1, pageSize = 10 } = req.query;
    const { areas, provinces, districts, subDistricts } = req.body;

    try {
      const result = await this._serviceSelectorLocation.getAllDatas(
        { areas, provinces, districts, subDistricts },
        { page, pageSize }
      );
      return response.Ok(res, result);
    } catch (error) {
      const errMsg = `Failed to get data from database`;
      console.error(`${errMsg}: ${error}`);
      return response.InternalServerError(res, 'Internal Server Error');
    }
  }
}

module.exports = { newControllerSelectorLocation };
