// /// <reference path='../../typings/angularjs/angular.d.ts' />
// /// <reference path='../../../libraries/typescript-angular-utilities/typings/utility.d.ts' />

/// <reference path='visibleBreakpoint.service.ts' />
/// <reference path='breakpoints.service.ts' />

module rl.ui.services.breakpoints {
	export var moduleName: string = 'rl.ui.services.breakpoints';
	
	angular.module(moduleName, [
		rl.utilities.services.observable.moduleName,
	])
		.service(visibleBreakpointServiceName, VisibleBreakpointService)
		.service(breakpointServiceName, BreakpointService);
}
