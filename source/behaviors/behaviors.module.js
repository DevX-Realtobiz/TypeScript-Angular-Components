var angular = require('angular');
var alias = require('./alias/alias');
exports.alias = alias;
var autosave = require('./autosave/autosave');
exports.autosave = autosave;
var popover = require('./popover/popover');
exports.popover = popover;
exports.moduleName = 'rl.ui.behaviors';
angular.module(exports.moduleName, [
    alias.moduleName,
    autosave.moduleName,
    popover.moduleName,
]);
//# sourceMappingURL=behaviors.module.js.map