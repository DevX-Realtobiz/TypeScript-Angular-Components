'use strict';
var angular = require('angular');
var autosaveDialog = require('./autosaveDialog/autosaveDialog.module');
exports.autosaveDialog = autosaveDialog;
var breakpoints = require('./breakpoints/breakpoints.module');
exports.breakpoints = breakpoints;
var contentProvider = require('./contentProvider/contentProvider.service');
exports.contentProvider = contentProvider;
var dialog = require('./dialog/dialog.service');
exports.dialog = dialog;
var jquery = require('./jquery/jquery.service');
exports.jquery = jquery;
var windowWrapper = require('./windowWrapper/windowWrapper.service');
exports.windowWrapper = windowWrapper;
exports.moduleName = 'rl.ui.services';
angular.module(exports.moduleName, [
    autosaveDialog.moduleName,
    breakpoints.moduleName,
    contentProvider.moduleName,
    dialog.moduleName,
    jquery.moduleName,
    windowWrapper.moduleName,
]);
//# sourceMappingURL=services.module.js.map