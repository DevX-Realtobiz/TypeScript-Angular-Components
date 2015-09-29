'use strict';

import * as angular from 'angular';

export var moduleName: string = 'rl.ui.components.lazyLoad';
export var directiveName: string = 'rlLazyLoad';
export var controllerName: string = 'LazyLoadController';

export class LazyLoadController {
	show: boolean;
	init: boolean = false;

	static $inject: string[] = ['$scope'];
	constructor($scope: angular.IScope) {
		var unbind: Function = $scope.$watch((): boolean => { return this.show; }, (value: boolean): void => {
			if (value) {
				this.init = true;
				unbind();
			}
		});
	}
}

function lazyLoad(): angular.IDirective {
	'use strict';
	return {
		restrict: 'E',
		transclude: true,
		template: `
			<div ng-if="lazyLoad.init">
				<div ng-show="lazyLoad.show">
					<div ng-transclude></div>
				</div>
			</div>
		`,
		controller: controllerName,
		controllerAs: 'lazyLoad',
		scope: {},
		bindToController: {
			show: '=',
		},
	};
}

angular.module(moduleName, [])
	.directive(directiveName, lazyLoad)
	.controller(controllerName, LazyLoadController);
