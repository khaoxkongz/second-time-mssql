function newRepositorySelectorLocation(databaseInstance) {
  return new RepositorySelectorLocation(databaseInstance);
}

class RepositorySelectorLocation {
  _databaseInstance = null;

  constructor(databaseInstance) {
    this._databaseInstance = databaseInstance;
  }

  async getAllProvinceHealth({ query, inputs }) {
    const result = { query, inputs };

    try {
      // const result = await this._databaseInstance.executeQuery({ query, inputs });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDistrictHealth({ query, inputs }) {
    const result = { query, inputs };

    try {
      // const result = await this._databaseInstance.executeQuery({ query, inputs });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllSubDistrictHealth({ query, inputs }) {
    const result = { query, inputs };

    try {
      // const result = await this._databaseInstance.executeQuery({ query, inputs });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllDatas({ query, inputs }) {
    const result = { query, inputs };

    try {
      // const result = await this._databaseInstance.executeQuery({ query, inputs });
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { newRepositorySelectorLocation };
