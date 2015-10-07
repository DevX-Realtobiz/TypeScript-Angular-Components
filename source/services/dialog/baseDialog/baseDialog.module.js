'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var angular = require('angular');
var typescript_angular_utilities_1 = require('typescript-angular-utilities');
var __promise = typescript_angular_utilities_1.services.promise;
var baseDialog_controller_1 = require('./baseDialog.controller');
var baseDialog_service_1 = require('./baseDialog.service');
__export(require('./baseDialog.controller'));
__export(require('./baseDialog.service'));
exports.moduleName = 'rl.ui.services.dialog.baseDialog';
angular.module(exports.moduleName, [__promise.moduleName])
    .controller(baseDialog_controller_1.controllerName, baseDialog_controller_1.BaseDialogController)
    .service(baseDialog_service_1.serviceName, baseDialog_service_1.BaseDialogService);
//# sourceMappingURL=baseDialog.module.js.map