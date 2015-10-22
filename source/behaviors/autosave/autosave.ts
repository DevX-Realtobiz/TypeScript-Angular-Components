'use strict';

import * as angular from 'angular';

import { services } from 'typescript-angular-utilities';

export var moduleName: string = 'rl.ui.behaviors.autosave';
export var directiveName: string = 'rlAutosave';
export var controllerName: string = 'AutosaveController';

import __autosave = services.autosave;
import __parentChild = services.parentChildBehavior;
import __objectUtility = services.object;
import __autosaveAction = services.autosaveAction;

export interface IAutosaveAttributes extends angular.IAttributes {
	rlAutosave: string;
	validate: string;
	save: string;
	debounceDuration: string;
}

export interface IAutosaveBehavior {
	autosave(): boolean;
}

export class AutosaveController {
	autosave: __autosave.IAutosaveService;

	static $inject: string[] = ['$scope'
							, '$attrs'
							, '$parse'
							, '$element'
							, '$timeout'
							, __autosave.factoryName
							, __parentChild.serviceName
							, __objectUtility.serviceName
							, __autosaveAction.serviceName];
	constructor(private $scope: angular.IScope
		, $attrs: IAutosaveAttributes
		, $parse: angular.IParseService
		, private $element: angular.IAugmentedJQuery
		, private $timeout: angular.ITimeoutService
		, autosaveFactory: __autosave.IAutosaveServiceFactory
		, parentChildBehavior: __parentChild.IParentChildBehaviorService
		, objectUtility: __objectUtility.IObjectUtility) {
		var contentForm: angular.IFormController = $element.controller('form');

		var hasValidator: boolean = objectUtility.isNullOrWhitespace($attrs.validate) === false;

		var validateExpression: angular.ICompiledExpression = $parse($attrs.validate);
		var validate: { (): boolean };

		if (hasValidator) {
			validate = (): boolean => {
				return validateExpression($scope);
			};
		}

		var saveExpression: angular.ICompiledExpression = $parse($attrs.save);
		var save: { (): angular.IPromise<void> } = (): angular.IPromise<void> => {
			return saveExpression($scope);
		};

		let debounce: number = $parse($attrs.debounceDuration)($scope);

		this.autosave = autosaveFactory.getInstance({
			save: save,
			validate: validate,
			contentForm: contentForm,
			debounceDuration: debounce,
		});

		var behavior: IAutosaveBehavior = {
			autosave: this.autosave.autosave,
		};

		// register autosave behavior and assign the value back to the parent
		var childLink: any = $parse($attrs.rlAutosave)($scope);
		parentChildBehavior.registerChildBehavior(childLink, behavior);
	}
}

export function autosave(): angular.IDirective {
	'use strict';
	return {
		restrict: 'A',
		require: ['rlAutosave', '?ngForm'],
		controller: controllerName,
		link(scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: any, controllers: any[]): void {
			let autosaveController: AutosaveController = controllers[0];
			autosaveController.autosave.setChangeListener = (callback: { (): void }): void => {
				element.on('keyup', scope.$apply(callback));
			};
			autosaveController.autosave.clearChangeListener = (): void => {
				element.off('keyup');
			};
		},
	};
}

angular.module(moduleName, [
	__autosave.moduleName,
	__autosaveAction.moduleName,
	__objectUtility.moduleName,
	__parentChild.moduleName,
])
	.directive(directiveName, autosave)
	.controller(controllerName, AutosaveController);
