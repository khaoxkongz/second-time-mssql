function newRepositorySelectorLocation(databaseInstance) {
  return new RepositorySelectorLocation(databaseInstance);
}

class RepositorySelectorLocation {
  _databaseInstance = null;

  constructor(databaseInstance) {
    this._databaseInstance = databaseInstance;
  }

  async getAllDatas({ query, queryDistinct, countQuery }) {
    try {
      const [queryResult, queryResultDistinct, totalCount] = await Promise.all([
        this._databaseInstance.executeQuery({ query, inputs: [] }),
        this._databaseInstance.executeQuery({ query: queryDistinct, inputs: [] }),
        this._databaseInstance.executeQuery({ query: countQuery, inputs: [] }),
      ]);

      return { queryResult, queryResultDistinct, totalCount: totalCount[0].totalCount };
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = { newRepositorySelectorLocation };
