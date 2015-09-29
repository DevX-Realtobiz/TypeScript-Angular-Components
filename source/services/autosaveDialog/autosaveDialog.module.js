'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var angular = require('angular');
var autosaveDialog_service_1 = require('./autosaveDialog.service');
var autosaveDialog_controller_1 = require('./autosaveDialog.controller');
__export(require('./autosaveDialog.service'));
__export(require('./autosaveDialog.controller'));
exports.moduleName = 'rl.ui.services.autosaveDialog';
angular.module(exports.moduleName, [])
    .service(autosaveDialog_service_1.serviceName, autosaveDialog_service_1.AutosaveDialogService)
    .controller(autosaveDialog_controller_1.controllerName, autosaveDialog_controller_1.AutosaveDialogController);
//# sourceMappingURL=autosaveDialog.module.js.map