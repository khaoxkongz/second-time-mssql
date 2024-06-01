const { newSelectorLocationRepository } = require('./domain/repositories/selector_location.repo');
const { newSelectorLocationService } = require('./domain/services/selector_location.service');
const { newSelectorLocationCtrl } = require('./api/controllers/selector_location.controller');

function init(server, arg) {
  const selectorLocationRepo = newSelectorLocationRepository(arg.databaseInstance);
  const selectorLocationService = newSelectorLocationService(selectorLocationRepo);
  const selectorLocationCtrl = newSelectorLocationCtrl(selectorLocationService);

  return new server({
    databaseInstance: arg.databaseInstance,
    selectorLocationCtrl,
  });
}

module.exports = { init };
