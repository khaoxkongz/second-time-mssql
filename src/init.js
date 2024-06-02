const { newSelectorLocationRepository } = require('./domain/repositories/selector_location.repo');
const { newSelectorLocationService } = require('./domain/services/selector_location.service');
const { newControllerSelectorLocation } = require('./api/controllers/selector_location.controller');

function init(server, arg) {
  const repoSelectorLocation = newSelectorLocationRepository(arg.databaseInstance);
  const serviceSelectorLocation = newSelectorLocationService(repoSelectorLocation);
  const ctrlSelectorLocation = newControllerSelectorLocation(serviceSelectorLocation);

  return new server({
    databaseInstance: arg.databaseInstance,
    ctrlSelectorLocation,
  });
}

module.exports = { init };
