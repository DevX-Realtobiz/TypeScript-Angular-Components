'use strict';

import * as angular from 'angular';
import * as _ from 'lodash';
import * as Rx from 'rx';

import { services, filters } from 'typescript-angular-utilities';
import __observable = services.observable;
import __array = services.array;
import __object = services.object;
import __synchronizedRequests = services.synchronizedRequests;

import { IAsyncDataSource, AsyncDataSource, IDataSetFunction } from '../asyncDataSource.service';
import { IDataSourceProcessor, processorServiceName } from '../dataSourceProcessor.service';
import { ISort, SortDirection } from '../../sorts/sort';

export var moduleName: string = 'rl.ui.components.cardContainer.dataSources.smartDataSource';
export var factoryName: string = 'smartDataSource';

export interface ISmartDataSource<TDataType> extends IAsyncDataSource<TDataType> {
	filters: filters.ISerializableFilter<any>[];
}

export interface IServerSearchFunction<TDataType> {
	(searchParams: IServerSearchParams): angular.IPromise<IDataResult<TDataType>>;
}

export interface IServerSearchParams {
	filters: {[index: string]: any};
	sorts: ISortParams[];
	paging: IPagingParams;
}

export interface ISortParams {
	column: string;
	direction: string;
}

export interface IPagingParams {
	pageNumber: number;
	pageSize: number;
}

export interface IDataResult<TDataType> {
	dataSet: TDataType[];
	count: number;
}

export class SmartDataSource<TDataType> extends AsyncDataSource<TDataType> {
	throttled: boolean;
	appliedFilters: { [index: string]: any };
	private _filters: filters.IFilter[];
	private subscriptions: Rx.Subscriber[];

	constructor(getDataSet: IServerSearchFunction<TDataType>
			, observableFactory: __observable.IObservableServiceFactory
			, dataSourceProcessor: IDataSourceProcessor
			, array: __array.IArrayUtility
			, private object: __object.IObjectUtility
			, synchronizedRequestsFactory: __synchronizedRequests.ISynchronizedRequestsFactory) {
		super(<any>getDataSet, observableFactory, dataSourceProcessor, array, synchronizedRequestsFactory);
	}

	get filters(): filters.IFilter[] {
		return this._filters;
	}

	set filters(value: filters.IFilter[]) {
		this._filters = value;
		this.setupSubscriptions();
	}

	onSortChange(): void {
		if (this.throttled) {
			this.reload();
		} else {
			super.onSortChange();
		}
	}

	refresh(): void {
		if (this.throttled) {
			this.reload();
		} else {
			super.refresh();
		}
	}

	protected getParams(): IServerSearchParams {
		this.updateAppliedFilters();
		return {
			filters: this.appliedFilters,
			sorts: _.map(this.sorts, (sort: ISort): ISortParams => {
				return {
					column: sort.column.label,
					direction: SortDirection.getFullName(sort.direction),
				};
			}),
			paging: {
				pageNumber: this.pager.pageNumber,
				pageSize: this.pager.pageSize,
			},
		};
	}

	private updateAppliedFilters(): void {
		let filterDictionary: { [index: string]: filters.IFilter } = this.array.toDictionary(this.filters, (filter: filters.ISerializableFilter<any>): string => {
			return filter.type;
		});
		this.appliedFilters = _.mapValues(filterDictionary, (filter: filters.ISerializableFilter<any>): any => {
			if (_.isFunction(filter.serialize)) {
				return filter.serialize();
			}
			return null;
		});
	}

	private setupSubscriptions() {
		_.each(this.subscriptions, (subscription: Rx.Subscriber): void => {
			subscription.dispose();
		});
		this.subscriptions = [];
		_.each(this.filters, (filter: filters.ISerializableFilter<any>): void => {
			this.subscriptions.push(filter.subscribe((): void => { this.onFilterChange(filter); }));
		});
	}

	private onFilterChange(filter: filters.ISerializableFilter<any>): void {
		if (_.has(this.appliedFilters, filter.type)) {
			this.reload();
		}
	}

	protected resolveReload(result: any): void {
		let data: IDataResult<TDataType> = <IDataResult<TDataType>>result;
		this.throttled = (data.count > data.dataSet.length);
		super.resolveReload(data.dataSet);
		this.count = data.count;
	}
}

export interface ISmartDataSourceFactory {
	getInstance<TDataType>(getDataSet: IServerSearchFunction<TDataType>): IAsyncDataSource<TDataType>;
}

smartDataSourceFactory.$inject = [__observable.factoryName, processorServiceName, __array.serviceName, __object.serviceName,  __synchronizedRequests.factoryName];
export function smartDataSourceFactory(observableFactory: __observable.IObservableServiceFactory
												, dataSourceProcessor: IDataSourceProcessor
												, array: __array.IArrayUtility
												, object: __object.IObjectUtility
												, synchronizedRequestsFactory: __synchronizedRequests.ISynchronizedRequestsFactory): ISmartDataSourceFactory {
	'use strict';
	return {
		getInstance<TDataType>(getDataSet: IServerSearchFunction<TDataType>): IAsyncDataSource<TDataType> {
			return new SmartDataSource<TDataType>(getDataSet, observableFactory, dataSourceProcessor, array, object, synchronizedRequestsFactory);
		},
	};
}

angular.module(moduleName, [])
	.factory(factoryName, smartDataSourceFactory);
