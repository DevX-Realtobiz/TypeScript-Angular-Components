// /// <reference path='../../../../../typings/jquery/jquery.d.ts' />

import * as angular from 'angular';

import { services } from 'typescript-angular-utilities';
import __transform = services.transform.transform;

import { IColumn } from '../../column';

import { componentName as cardComponent, CardController } from '../card.ng1';

export var directiveName: string = 'rlCardHeaderColumn';
export var controllerName: string = 'CardHeaderColumnController';

export interface IHeaderScope extends angular.IScope {
	header: HeaderColumnController;
}

export interface IHeaderColumnBindings {
	column: IColumn<any>;
	item: any;
	alias: string;
}

export class HeaderColumnController {
	column: IColumn<any>;
	item: any;
	alias: string;

	value: string | number | boolean;

	renderedTemplate: JQuery;
	cardController: CardController;

	$onInit(): void {
		this.update();
		this.cardController.refresh.subscribe(this.update);
	}

	private update: { (): void } = (): void => {
		this.value = __transform.getValue(this.item, this.column.getValue);
	}
}

headerColumn.$inject = ['$compile'];
export function headerColumn($compile: angular.ICompileService): angular.IDirective {
	'use strict';
	return {
		restrict: 'E',
		require: { cardController: '^' + cardComponent },
		template: `
			<div rl-size-for-breakpoints="header.column.size" styling="::header.column.styling" title="{{::header.column.description}}">
				<div class="template-container"></div>
			</div>
		`,
		controller: controllerName,
		controllerAs: 'header',
		scope: {},
		bindToController: {
			column: '<',
			item: '<',
			alias: '<',
		},
		compile(): angular.IDirectivePrePost {
			return {
				pre(scope: IHeaderScope): void {
					let header: HeaderColumnController = scope.header;
					if (header.alias != null) {
						scope[header.alias] = header.item;
					}

					var column: IColumn<any> = header.column;
					if (column.templateUrl != null) {
						header.renderedTemplate = $compile('<div ng-include="\'' + column.templateUrl + '\'"></div>')(scope);
					} else if (column.template != null) {
						header.renderedTemplate = $compile(column.template)(scope);
					} else {
						header.renderedTemplate = $compile('<span>{{header.value}}</span>')(scope);
					}
				},
				post(scope: IHeaderScope
					, element: angular.IAugmentedJQuery): void {
					var container: JQuery = element.find('.template-container');
					container.append(scope.header.renderedTemplate);
				},
			};
		},
	};
}
