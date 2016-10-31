import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { services } from 'typescript-angular-utilities';
import ObjectUtility = services.object.ObjectUtility;
import DateUtility = services.date.DateUtility;
import TransformService = services.transform.TransformService;

import { IColumn } from '../column';
import { IDataSource, ObservableDataSource } from '../dataSources/index';
import { Sorter } from '../sorts/index';
import {
	IFilter,
	FilterGroup,
	IFilterGroup,
	IFilterGroupSettings,
	ModeFilterGroup,
	IModeFilterGroup,
	IModeFilterGroupSettings,
	RangeFilterGroup,
	IRangeFilterGroup,
	IRangeFilterGroupSettings,
	SelectFilter,
	ISelectFilterSettings,
	IDateFilter,
	DateFilter,
	IDateFilterSettings,
} from '../filters/index';
import {} from '../paging/index';

export enum CardContainerType {
	standard,
	selectable,
}

export interface ICardContainerProperties {
	search?: boolean;
	paging?: boolean;
	maxColumnSorts?: number;
	permanentFooters?: boolean;
	disableSelection?: { (item: any): string };
}

export interface ICardContainerInstance { }

export interface ICardContainerConstructor<TDataType> {
	search?: boolean;
	paging?: boolean;
	maxColumnSorts?: number;
	permanentFooters?: boolean;
	disableSelection?: { (item: any): string };
	columns: IColumn<TDataType>[];
	dataSource: IDataSource<TDataType>;
	filters: IFilter<TDataType, any>[];
}

@Injectable()
export class CardContainerBuilderService {
	private injector: Injector;

	constructor(injector: Injector) {
		this.injector = injector;
	}

	getInstance(settings: ICardContainerProperties): ICardContainerInstance {
		return <any>{
			search: settings.search,
			paging: settings.paging,
			maxColumnSorts: settings.maxColumnSorts,
			permanentFooters: settings.permanentFooters,
			disableSelection: settings.disableSelection,
			columns: [],
			filters: [],
		};
	}

	addColumn<TDataType>(container: ICardContainerInstance, column: IColumn<TDataType>): void {
		(container as ICardContainerConstructor<TDataType>).columns.push(column);
	}

	// data sources
	buildObservableDataSource<TDataType>(container: ICardContainerInstance, data$: Observable<TDataType[]>): IDataSource<TDataType> {
		const dataSource = new ObservableDataSource(data$);
		(container as ICardContainerConstructor<TDataType>).dataSource = dataSource;
		return dataSource;
	}

	// filters
	buildFilterGroup<TDataType>(container: ICardContainerInstance, settings: IFilterGroupSettings<TDataType>): IFilterGroup<TDataType> {
		const filter: IFilterGroup<TDataType> = new FilterGroup<TDataType>(settings);
		(container as ICardContainerConstructor<TDataType>).filters.push(filter);
		return filter;
	}

	buildModeFilterGroup<TDataType>(container: ICardContainerInstance, settings: IModeFilterGroupSettings<TDataType>): IModeFilterGroup<TDataType> {
		const transformService: TransformService = this.injector.get(TransformService);
		const filter: IModeFilterGroup<TDataType> = new ModeFilterGroup<TDataType>(settings, transformService);
		(container as ICardContainerConstructor<TDataType>).filters.push(filter);
		return filter;
	}

	buildRangeFilterGroup<TDataType>(container: ICardContainerInstance, settings: IRangeFilterGroupSettings<TDataType>): IRangeFilterGroup<TDataType> {
		const transformService: TransformService = this.injector.get(TransformService);
		const filter: IRangeFilterGroup<TDataType> = new RangeFilterGroup<TDataType>(settings, transformService);
		(container as ICardContainerConstructor<TDataType>).filters.push(filter);
		return filter;
	}

	buildSelectFilter<TDataType, TFilterType>(container: ICardContainerInstance, settings: ISelectFilterSettings<TDataType, TFilterType>): SelectFilter<TDataType, TFilterType> {
		const transformService: TransformService = this.injector.get(TransformService);
		const objectUtility: ObjectUtility = this.injector.get(ObjectUtility);
		const filter: SelectFilter<TDataType, TFilterType> = new SelectFilter(settings, objectUtility, transformService);
		(container as ICardContainerConstructor<TDataType>).filters.push(filter);
		return filter;
	}

	buildDateFilter<TDataType>(container: ICardContainerInstance, settings: IDateFilterSettings<TDataType>): IDateFilter<TDataType> {
		const dateUtility: DateUtility = this.injector.get(DateUtility);
		const transformService: TransformService = this.injector.get(TransformService);
		const filter: IDateFilter<TDataType> = new DateFilter<TDataType>(settings, dateUtility, transformService);
		(container as ICardContainerConstructor<TDataType>).filters.push(filter);
		return filter;
	}
}
