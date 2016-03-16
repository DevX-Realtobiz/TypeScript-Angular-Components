// /// <reference path='../../../typings/node/node.d.ts' />

'use strict';

import * as angular from 'angular';
import * as _ from 'lodash';

import { services } from 'typescript-angular-utilities';
import __parentChild = services.parentChildBehavior;
import __array = services.array;

import { ITypeaheadBehavior, IGetItemsParams } from '../typeahead/typeahead';

export let moduleName: string = 'rl.ui.components.typeaheadList';
export let componentName: string = 'rlTypeaheadList';
export let controllerName: string = 'TypeaheadListController';

export interface ITypeaheadListBindings {
	getItems: { (params?: IGetItemsParams): angular.IPromise<any> };
}

export class TypeaheadListController implements ITypeaheadListBindings {
	// bindings
	getItems: { (params?: IGetItemsParams): angular.IPromise<any> };

	typeaheadLink: __parentChild.IChild<ITypeaheadBehavior>;
	ngModel: angular.INgModelController;

	static $inject: string[] = [__parentChild.serviceName];
	constructor(private parentChild: __parentChild.IParentChildBehaviorService) {}

	$onInit(): void {
		//TODO
	}

	loadItems(search?: string): angular.IPromise<any> {
		return this.getItems({ search: search }).then((data: any[]): any[] => {
			return _.filter(data, (item: any): boolean => {
				return !_.find(this.ngModel.$viewValue, item);
			});
		});
	}

	add(item: any): void {
		this.ngModel.$viewValue.push(item);
		this.parentChild.triggerChildBehavior(this.typeaheadLink, (behavior: ITypeaheadBehavior): void => {
			behavior.remove(item);
		});
	}

	remove(item: any): void {
		__array.arrayUtility.remove(this.ngModel.$viewValue, item);
		this.parentChild.triggerChildBehavior(this.typeaheadLink, (behavior: ITypeaheadBehavior): void => {
			behavior.add(item);
		});
	}
}

let typeaheadList: angular.IComponentOptions = {
	require: { ngModel: 'ngModel' },
	template: require('./typeaheadList.html'),
	controller: controllerName,
	controllerAs: 'controller',
	bindings: {
		getItems: '&',
	},
};

angular.module(moduleName, [__parentChild.moduleName])
	.component(componentName, typeaheadList)
	.controller(controllerName, TypeaheadListController);
