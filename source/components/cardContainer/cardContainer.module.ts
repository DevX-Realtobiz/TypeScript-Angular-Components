// /// <reference path='../../typings/angularjs/angular.d.ts' />

/// <reference path='sorts/sorts.module.ts' />

module rl.ui.components.cardContainer {
	export var moduleName: string = 'rl.ui.components.cardContainer';
	
	angular.module(moduleName, [
		sorts.moduleName,
	]);
}
