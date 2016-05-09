import * as angular from 'angular';
import { services, filters } from 'typescript-angular-utilities';
import __array = services.array;
import __object = services.object;
import __synchronizedRequests = services.synchronizedRequests;
import { IAsyncDataSource, AsyncDataSource } from '../asyncDataSource.service';
import { IDataSourceProcessor } from '../dataSourceProcessor.service';
export declare var moduleName: string;
export declare var factoryName: string;
export interface ISmartDataSource<TDataType> extends IAsyncDataSource<TDataType> {
    filters: filters.ISerializableFilter<any>[];
}
export interface IServerSearchFunction<TDataType> {
    (searchParams: IServerSearchParams): angular.IPromise<IDataResult<TDataType>>;
}
export interface IServerSearchParams {
    filters: {
        [index: string]: any;
    };
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
    isEmpty?: boolean;
}
export declare class SmartDataSource<TDataType> extends AsyncDataSource<TDataType> {
    private object;
    throttled: boolean;
    appliedFilters: {
        [index: string]: any;
    };
    private _filters;
    private subscriptions;
    private throttleLimit;
    constructor(getDataSet: IServerSearchFunction<TDataType>, dataSourceProcessor: IDataSourceProcessor, array: __array.IArrayUtility, object: __object.IObjectUtility, synchronizedRequestsFactory: __synchronizedRequests.ISynchronizedRequestsFactory);
    filters: filters.IFilter[];
    onSortChange(): void;
    refresh(): void;
    protected getParams(): IServerSearchParams;
    private updateAppliedFilters();
    private setupSubscriptions();
    private onFilterChange(filter);
    protected resolveReload(result: any): void;
}
export interface ISmartDataSourceFactory {
    getInstance<TDataType>(getDataSet: IServerSearchFunction<TDataType>): IAsyncDataSource<TDataType>;
}
export declare function smartDataSourceFactory(dataSourceProcessor: IDataSourceProcessor, array: __array.IArrayUtility, object: __object.IObjectUtility, synchronizedRequestsFactory: __synchronizedRequests.ISynchronizedRequestsFactory): ISmartDataSourceFactory;
