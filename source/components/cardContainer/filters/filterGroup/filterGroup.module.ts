// uses typings/angularjs
// uses typescript-angular-utilities

// /// <reference path='../../../typings/angularjs/angular.d.ts' />
// /// <reference path='../../../libraries/typescript-angular-utilities/typings/utility.d.ts' />

/// <reference path='filterOption/filterOption.ts' />
/// <reference path='filterGroup.service.ts' />

module rl.ui.components.cardContainer.filters.filterGroup {
	'use strict';

	export var moduleName: string = 'rl.ui.components.cardContainer.filters.filterGroup';
	
	angular.module(moduleName, [
		rl.utilities.services.object.moduleName,
		
		filterOption.moduleName,
	])
		.factory(factoryName, filterGroupFactory);
}
