import * as angular from 'angular';
import * as _ from 'lodash';

import { services, downgrade } from 'typescript-angular-utilities';
import __object = services.object;

export var moduleName: string = 'rl.ui.components.multiStepIndicator';
export var componentName: string = 'rlMultiStepIndicator';
export var controllerName: string = 'MultiStepIndicatorController';

export interface IStep {
	title: string;
	subtitle?: string;
	onClick?: {(): angular.IPromise<void> | void};
	stateName?: string;
	count?: {(): number};
	isCompleted?: boolean | {(): boolean};
	isValid?: boolean | {(): boolean};
	isCurrent?: boolean;
}

export interface IConfiguredStep extends IStep {
	inactive: boolean;
	loading: boolean;
	hasCount: boolean;
	getCompleted(): boolean;
	getValid(): boolean;
}

export class MultiStepIndicatorController {
	steps: IConfiguredStep[];

	static $inject: string[] = ['$state', '$q', downgrade.objectServiceName];
	constructor(private $state: angular.ui.IStateService
			, private $q: angular.IQService
			, private object: __object.IObjectUtility) {
		this.configureSteps();
	}

	onClick(step: IConfiguredStep): void {
		if (!this.anyLoading()) {
			step.loading = true;
			this.$q.when(step.onClick()).then((): void => {
				step.loading = false;
			});
		}
	}

	anyLoading(): boolean {
		return _.some(this.steps, (step: IConfiguredStep): boolean => {
			return step.loading;
		});
	}

	private configureSteps(): void {
		_.each(this.steps, (step: IConfiguredStep): void => {
			step.hasCount = _.isFunction(step.count);
			step.getCompleted = (): boolean => { return this.getIsCompleted(step); };
			step.getValid = (): boolean => { return this.getIsValid(step); };

			if (!_.isFunction(step.onClick)) {
				if (this.object.isNullOrWhitespace(step.stateName)) {
					step.inactive = true;
				} else {
					step.onClick = (): angular.IPromise<void> => { return this.redirectToState(step); };

					if (this.$state.includes(step.stateName)) {
						step.isCurrent = true;
					}
				}
			}
		});
	}

	private redirectToState(step: IConfiguredStep): angular.IPromise<void> {
		return this.$state.go(step.stateName).then((): void => {
			this.clearCurrentState();
			step.isCurrent = true;
		});
	}

	private clearCurrentState(): void {
		_.each(this.steps, (step: IStep): void => {
			step.isCurrent = false;
		});
	}

	private getIsCompleted(step: IConfiguredStep): boolean {
		return _.isFunction(step.isCompleted)
			? (<{(): boolean}>step.isCompleted)()
			: <boolean>step.isCompleted;
	}

	private setIsCompleted(step: IConfiguredStep, isCompleted: boolean): void {
		if (!_.isFunction(step.isCompleted)) {
			step.isCompleted = isCompleted;
		}
	}

	private getIsValid(step: IConfiguredStep): boolean {
		if (_.isFunction(step.isValid)) {
			return (<{(): boolean}>step.isValid)();
		} else if (!_.isUndefined(step.isValid != null)) {
			return <boolean>step.isValid;
		} else {
			return true;
		}
	}
}

let multiStepIndicator: angular.IComponentOptions = {
	template: require('./multiStepIndicator.ng1.html'),
	controller: controllerName,
	controllerAs: 'breadcrumb',
	bindings: {
		steps: '=',
		numbered: '=',
		checked: '=',
	},
};

angular.module(moduleName, [downgrade.moduleName])
	.component(componentName, multiStepIndicator)
	.controller(controllerName, MultiStepIndicatorController);
