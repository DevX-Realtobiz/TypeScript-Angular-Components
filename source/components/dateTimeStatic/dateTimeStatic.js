'use strict';
// /// <reference path='../../../typings/bootstrapDateTimePicker.d.ts' />
var angular = require('angular');
var moment = require('moment');
exports.moduleName = 'rl.ui.components.dateTimeStatic';
exports.componentName = 'rlDateTimeStatic';
exports.controllerName = 'DateTimeStaticController';
var typescript_angular_utilities_1 = require('typescript-angular-utilities');
var __date = typescript_angular_utilities_1.services.date;
var DateTimeStaticController = (function () {
    function DateTimeStaticController(dateUtility) {
        this.dateUtility = dateUtility;
        this.displayValue = '';
        if (this.dateValue != null && this.dateUtility.isDate(this.dateValue)) {
            this.displayValue = moment(this.dateValue).format('MM/DD/YYYY');
            if (this.includeTime) {
                this.displayTimeZone = true;
                this.displayValue = this.displayValue + moment(this.dateValue).format(' h:mm a');
            }
        }
    }
    DateTimeStaticController.$inject = [__date.serviceName];
    return DateTimeStaticController;
}());
exports.DateTimeStaticController = DateTimeStaticController;
var dateTimeStaticComponent = {
    template: require('./dateTimeStatic.html'),
    controller: exports.controllerName,
    controllerAs: 'view',
    bindings: {
        dateValue: '<',
        includeTime: '<?',
        displayTimeZone: '<?',
    },
};
angular.module(exports.moduleName, [])
    .component(exports.componentName, dateTimeStaticComponent)
    .controller(exports.controllerName, DateTimeStaticController);
//# sourceMappingURL=dateTimeStatic.js.map