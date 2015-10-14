'use strict';
var _ = require('lodash');
var typescript_angular_utilities_1 = require('typescript-angular-utilities');
var __promise = typescript_angular_utilities_1.services.promise;
var baseDialog_controller_1 = require('./baseDialog.controller');
exports.serviceName = 'baseDialog';
var BaseDialogService = (function () {
    function BaseDialogService($modal, $rootScope, promise) {
        var _this = this;
        this.$modal = $modal;
        this.$rootScope = $rootScope;
        this.promise = promise;
        this.modalClosing = function (event, reason, explicitlyClosed) {
            var canClose = true;
            if (_.isFunction(_this.closeHandler)) {
                canClose = _this.closeHandler(explicitlyClosed);
            }
            if (!canClose) {
                event.preventDefault();
            }
        };
    }
    BaseDialogService.prototype.open = function (options, closeHandler) {
        var _this = this;
        if (options == null) {
            options = {};
        }
        this.promise.resolvePromises(options.resolve).then(function (results) {
            _this.closeHandler = closeHandler;
            options = _this.configureModalSettings(options, results);
            _this.$modal.open(options);
        });
    };
    BaseDialogService.prototype.configureModalSettings = function (options, resolveData) {
        var modalScope = options.scope;
        if (modalScope == null) {
            modalScope = this.$rootScope.$new();
        }
        if (options.resolveToDialog) {
            if (options.dialogAs != null) {
                modalScope[options.dialogAs] = resolveData;
            }
            else {
                modalScope = _.extend(modalScope, resolveData);
            }
        }
        else {
            modalScope.resolveData = resolveData;
        }
        modalScope.modalController = options.controller;
        options.resolve = null;
        options.controller = baseDialog_controller_1.controllerName;
        options.scope = modalScope;
        return options;
    };
    BaseDialogService.$inject = ['$modal', '$rootScope', __promise.serviceName];
    return BaseDialogService;
})();
exports.BaseDialogService = BaseDialogService;
//# sourceMappingURL=baseDialog.service.js.map