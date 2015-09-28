// /// <reference path='../../../../typings/commonjs.d.ts' />

'use strict';

import * as angular from 'angular';
import * as _ from 'lodash';

import { services } from 'typescript-angular-utilities';
import __boolean = services.boolean;

import { IDataSource } from '../dataSources/dataSources.module';
import { CardContainerController } from '../cardContainer';

export var moduleName: string = 'rl.ui.components.cardContainer.selectionControl';
export var directiveName: string = 'rlCardContainer';
export var controllerName: string = 'CardContainerController';

export class SelectionControlController {
	selectedItems: number;
	pagingEnabled: boolean;
	dataSource: IDataSource<any>;
	private cardContainerController: CardContainerController;

	static $inject: string[] = ['$scope', '$element', __boolean.serviceName];
	constructor(private $scope: angular.IScope
			, $element: angular.IAugmentedJQuery
			, bool: __boolean.IBooleanUtility) {
		this.cardContainerController = $element.controller('rlCardContainer');
		this.selectedItems = this.cardContainerController.numberSelected;
		this.pagingEnabled = bool.toBool(this.cardContainerController.pager);
		this.dataSource = this.cardContainerController.dataSource;

		$scope.$watch((): number => { return this.cardContainerController.numberSelected; }, (value: number): void => {
			this.selectedItems = value;
		});
	}

	selectPage(): void {
		_.each(this.dataSource.dataSet, (item: any): void => {
			item.viewData.selected = true;
		});

		this.$scope.$emit('selectionChanged'); //*events?
	}

	selectAll(): void {
		_.each(this.dataSource.filteredDataSet, (item: any): void => {
			item.viewData.selected = true;
		});

		this.$scope.$emit('selectionChanged'); //*events?
	}

	clearPage(): void {
		_.each(this.dataSource.dataSet, (item: any): void => {
			item.viewData.selected = false;
		});

		this.$scope.$emit('selectionChanged'); //*events?
	}

	clearAll(): void {
		_.each(this.dataSource.filteredDataSet, (item: any): void => {
			item.viewData.selected = false;
		});

		this.$scope.$emit('selectionChanged'); //*events?
	}
}

export function selectionControl(): angular.IDirective {
	'use strict';
	return {
		restrict: 'E',
		require: '^^rlCardContainer',
		template: require('./selectionControl.html'),
		controller: controllerName,
		controllerAs: 'selection',
	};
}

angular.module(moduleName, [__boolean.moduleName])
	.directive(directiveName, selectionControl)
	.controller(controllerName, SelectionControlController);
