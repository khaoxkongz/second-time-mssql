const { newRepositorySelectorLocation } = require('./domain/repositories/selector_location.repo');
const { newServiceSelectorLocation } = require('./domain/services/selector_location.service');
const { newControllerSelectorLocation } = require('./api/controllers/selector_location.controller');

function init(server, arg) {
  const repoSelectorLocation = newRepositorySelectorLocation(arg.databaseInstance);
  const serviceSelectorLocation = newServiceSelectorLocation(repoSelectorLocation);
  const ctrlSelectorLocation = newControllerSelectorLocation(serviceSelectorLocation);

  return new server({
    databaseInstance: arg.databaseInstance,
    ctrlSelectorLocation,
  });
}

module.exports = { init };
