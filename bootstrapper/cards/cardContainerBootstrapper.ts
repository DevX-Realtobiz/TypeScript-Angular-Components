import { Component } from '@angular/core';
import * as angular from 'angular';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ICardContainerBuilder } from '../../source/components/cardContainer/builder/index';
import { IDataSource } from '../../source/components/cardContainer/dataSources/index';
import { ISelectFilter,	IDateFilter } from '../../source/components/cardContainer/filters/index';
import { cardContainerBuilderServiceName } from '../../source/componentsDowngrade';

export const moduleName: string = 'CardTestModule';

interface ICardItem {
	name: string;
	value: number;
	date: moment.Moment;
}

class CardTestController {
	builder: ICardContainerBuilder;
	builderWithSelectFilter: ICardContainerBuilder;
	builderWithDateFilter: ICardContainerBuilder;
	builderWithSearch: ICardContainerBuilder;
	options: number[];
	selectFilter: ISelectFilter<number>;
	dateFilter: IDateFilter;
	dataSource: IDataSource<ICardItem>;

	static $inject: string[] = [cardContainerBuilderServiceName];
	constructor(cardContainerBuilderFactory: any) {
		const items: ICardItem[] = _.map(_.range(1, 101), (num: number): ICardItem => {
			const value = Math.floor(Math.random() * 2) + 1;
			return {
				name: 'Item' + num,
				value: value,
				date: moment().subtract(value, 'days'),
			};
		});

		this.options = [1, 2];

		this.builder = cardContainerBuilderFactory.getInstance();
		this.builder.dataSource.buildSimpleDataSource(_.cloneDeep(items));
		this.builder.usePaging();
		this.builder.addColumn({
			label: 'Name',
			size: 6,
			getValue: 'name',
		});
		this.builder.addColumn({
			label: 'Value',
			size: 6,
			getValue: 'value',
			template: '<b>{{myItem.value}}</b>',
		});
		this.builder.renderFilters();
		this.builder.filters.buildModeFilterGroup({
			label: 'Mode Filter',
			type: 'modeFilter',
			getValue: 'value',
			options: [
				{
					label: 'All',
					displayAll: true,
				},
				{
					label: '1',
					value: 1,
				},
				{
					label: '2',
					value: 2,
				},
			],
		});

		this.builderWithSearch = cardContainerBuilderFactory.getInstance();
		this.builderWithSearch.dataSource.buildSimpleDataSource(_.cloneDeep(items));
		this.builder.usePaging();
		this.builderWithSearch.addColumn({
			label: 'Name',
			size: 6,
			getValue: 'name',
		});
		this.builderWithSearch.addColumn({
			label: 'Value',
			size: 6,
			getValue: 'value',
			template: '<b>{{myItem.value}}</b>',
		});
		this.builderWithSearch.useSearch();

		this.builderWithSelectFilter = cardContainerBuilderFactory.getInstance();
		this.dataSource = this.builderWithSelectFilter.dataSource.buildSimpleDataSource(_.cloneDeep(items));
		this.builderWithSelectFilter.usePaging();
		this.builderWithSelectFilter.addColumn({
			label: 'Name',
			size: 6,
			getValue: 'name',
		});
		this.builderWithSelectFilter.addColumn({
			label: 'Value',
			size: 6,
			getValue: 'value',
			template: '<b>{{myItem.value}}</b>',
		});
		this.selectFilter = this.builderWithSelectFilter.filters.buildSelectFilter({
			valueSelector: 'value',
		});

		this.builderWithDateFilter = cardContainerBuilderFactory.getInstance();
		this.dataSource = this.builderWithDateFilter.dataSource.buildSimpleDataSource(_.cloneDeep(items));
		this.builderWithDateFilter.usePaging();
		this.builderWithDateFilter.addColumn({
			label: 'Name',
			size: 6,
			getValue: 'name',
		});
		this.builderWithDateFilter.addColumn({
			label: 'Date',
			size: 6,
			getValue: 'date',
			template: '<b>{{myItem.date | rlDate}}</b>',
		});
		this.dateFilter = this.builderWithDateFilter.filters.buildDateFilter({
			type: 'dateFilter',
			valueSelector: 'date',
		});
	}
}

@Component({
	selector: 'tsCardsNg1',
	template: '<ts-cards-ng1></ts-cards-ng1>'
})
export class CardsNg1BootstrapperComponent { }

angular.module(moduleName, [])
	.component('tsCardsNg1', {
		template: require('./cardsNg1.html'),
		controller: 'CardTestController',
		controllerAs: 'cards',
	})
	.controller('CardTestController', CardTestController);
