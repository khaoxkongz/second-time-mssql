const response = require('../response');

function newControllerSelectorLocation(serviceSelectorLocation) {
  return new ControllerSelectorLocation(serviceSelectorLocation);
}

class ControllerSelectorLocation {
  _serviceSelectorLocation = null;

  constructor(serviceSelectorLocation) {
    this._serviceSelectorLocation = serviceSelectorLocation;
  }

  async getAllDatasByLocation(req, res) {
    const { areas, provinces, districts } = req.body;

    if (areas === undefined && areas === null) {
      return response.MissingField(res, 'areas');
    }

    if (provinces === undefined && provinces === null) {
      return response.MissingField(res, 'provinces');
    }

    if (districts === undefined && districts === null) {
      return response.MissingField(res, 'districts');
    }

    try {
      if (areas !== undefined && areas !== null && areas.length > 0) {
        const result = await this._serviceSelectorLocation.getAllProviceHealth({ areas });
        return response.Ok(res, result);
      } else if (provinces !== undefined && provinces !== null && provinces.length > 0) {
        const result = await this._serviceSelectorLocation.getAllDistrictHealth({ provinces });
        return response.Ok(res, result);
      } else if (districts !== undefined && districts !== null && districts.length > 0) {
        const result = await this._serviceSelectorLocation.getAllSubDistrictHealth({ districts });
        return response.Ok(res, result);
      } else {
        return response.Ok(res, []);
      }
    } catch (error) {
      const errMsg = `Failed to get data from database`;
      console.error(`${errMsg}: ${error}`);
      return response.InternalServerError(res, 'Internal Server Error');
    }
  }

  async getAllDatas(req, res) {
    const { areas, provinces, districts } = req.body;

    if (areas === undefined && areas === null) {
      return response.MissingField(res, 'areas');
    }

    if (provinces === undefined && provinces === null) {
      return response.MissingField(res, 'provinces');
    }

    if (districts === undefined && districts === null) {
      return response.MissingField(res, 'districts');
    }

    try {
      const result = await this._serviceSelectorLocation.getAllDatas({ areas, provinces, districts });
      return response.Ok(res, result);
    } catch (error) {
      const errMsg = `Failed to get data from database`;
      console.error(`${errMsg}: ${error}`);
      return response.InternalServerError(res, 'Internal Server Error');
    }
  }
}

module.exports = { newControllerSelectorLocation };
