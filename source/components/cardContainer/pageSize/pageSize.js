// /// <reference path='../../../../typings/commonjs.d.ts' />
'use strict';
var angular = require('angular');
exports.moduleName = 'rl.ui.components.cardContainer.pageSize';
exports.directiveName = 'rlPageSize';
exports.controllerName = 'PageSizeController';
exports.availablePageSizes = [10, 25, 50, 100];
exports.defaultPageSize = 10;
var PageSizeController = (function () {
    function PageSizeController($scope, $element) {
        var _this = this;
        this.selectedPageSize = exports.defaultPageSize;
        this.pageSizes = exports.availablePageSizes;
        this.hasPageFilter = true;
        this.cardContainerController = $element.controller('rlCardContainer');
        var pager = this.cardContainerController.pager;
        if (pager == null) {
            this.hasPageFilter = false;
        }
        else {
            $scope.$watch(function () { return _this.selectedPageSize; }, function (newPageSize) {
                if (pager != null) {
                    pager.pageSize = newPageSize;
                    _this.cardContainerController.dataSource.refresh();
                }
            });
        }
    }
    PageSizeController.$inject = ['$scope', '$element'];
    return PageSizeController;
})();
exports.PageSizeController = PageSizeController;
function pageSize() {
    'use strict';
    return {
        restrict: 'E',
        require: '^^rlCardContainer',
        template: require('./pageSize.html'),
        controller: exports.controllerName,
        controllerAs: 'controller',
    };
}
exports.pageSize = pageSize;
angular.module(exports.moduleName, [])
    .directive(exports.directiveName, pageSize)
    .controller(exports.controllerName, PageSizeController);
//# sourceMappingURL=pageSize.js.map