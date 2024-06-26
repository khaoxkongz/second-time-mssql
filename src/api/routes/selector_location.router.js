const { Router } = require('./router');

function newRouterSelectorLocation(ctrlSelectorLocation) {
  return new RouterSelectorLocation(ctrlSelectorLocation);
}

class RouterSelectorLocation extends Router {
  constructor(ctrlSelectorLocation) {
    super();

    this._router.get('/', ctrlSelectorLocation.getAllDatas.bind(ctrlSelectorLocation));
  }
}

module.exports = { newRouterSelectorLocation };
