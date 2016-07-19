import { Component, Input, Output, EventEmitter, Optional, OnInit, OnChanges, SimpleChange, ContentChild, TemplateRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { find, filter, clone } from 'lodash';

import { services } from 'typescript-angular-utilities';
import __object = services.object;
import __array = services.array;
import __guid = services.guid;
import __transform = services.transform;
import __search = services.search;

import { ValidatedInputComponent, validationInputs, baseOutputs } from '../validationInput';
import { ComponentValidator } from '../../../services/componentValidator/componentValidator.service';
import { FormComponent } from '../../form/form';
import { TypeaheadComponent } from '../typeahead/typeahead';
import { SelectComponent } from '../select/select';
import { ButtonAsyncComponent } from '../../buttons/index';
import { TypeaheadDataItemComponent } from './typeaheadDataItem';

export interface ITypeaheadListChanges {
	value: SimpleChange;
	disableSearching: SimpleChange;
	[key: string]: SimpleChange;
}

@Component({
	selector: 'rlTypeaheadList',
	template: require('./typeaheadList.html'),
	inputs: validationInputs,
	outputs: baseOutputs,
	providers: [ComponentValidator],
	directives: [TypeaheadComponent, SelectComponent, ButtonAsyncComponent, TypeaheadDataItemComponent],
})
export class TypeaheadListComponent<T> extends ValidatedInputComponent<T[]> implements OnInit, OnChanges {
	@Input() transform: __transform.ITransform<T, string>;
	@Input() getItems: { (search?: string): Promise<T[]> | Observable<T[]> };
	@Input() prefix: string;
	@Input() clientSearch: boolean;
	@Input() disableSearching: boolean;
	@Input() create: { (value: string): T };
	@Input() onAdd: { (item: T): Promise<T> | Observable<T> };
	@Input() onRemove: { (item: T): Promise<void> | Observable<void> };
	@Output() select: EventEmitter<T> = new EventEmitter<T>();

	@ContentChild(TemplateRef) template: TemplateRef<any>;

	cachedItemsArray: T[];
	cachedItems: BehaviorSubject<T[]>;

	transformService: __transform.ITransformService;
	searchUtility: __search.ISearchUtility;

	constructor(transformService: __transform.TransformService
			, @Optional() rlForm: FormComponent
			, componentValidator: ComponentValidator
			, object: __object.ObjectUtility
			, array: __array.ArrayUtility
			, guid: __guid.GuidService
			, searchService: __search.SearchUtility) {
		super(rlForm, componentValidator, object, array, guid);
		this.transformService = transformService;
		this.searchUtility = searchService;
		this.inputType = 'typeaheadList';
	}

	loadItems(search?: string): Observable<T[]> {
		if (this.clientSearch || this.disableSearching) {
			if (this.cachedItems) {
				return this.cachedItems;
			} else {
				return Observable.from(this.getItems());
			}
		} else {
			return Observable.from(this.getItems(search));
		}
	}

	searchItems = (search?: string): Observable<T[]> => {
		return this.loadItems(search).map((items: T[]): T[] => {
			return this.filter(items, search);
		});
	}

	add = (item: T): Observable<T> => {
		const action = this.asObservable(this.onAdd(item));
		action.subscribe(newItem => {
			newItem = newItem || item;
			// immutability?
			const newValue = clone(this.value);
			newValue.push(newItem);
			this.setValue(newValue);
			if (this.cachedItems) {
				this.array.remove(this.cachedItemsArray, item);
				this.cachedItems.next(this.cachedItemsArray);
			}
			return newItem;
		});
		return action;
	}

	remove = (item: T): Observable<void> => {
		const action = this.asObservable(this.onRemove(item));
		action.subscribe(() => {
			// immutability?
			const newValue = clone(this.value);
			this.array.remove(newValue, item);
			this.setValue(newValue);
			if (this.cachedItems != null) {
				this.cachedItemsArray.push(item);
				this.cachedItems.next(this.cachedItemsArray);
			}
		});
		return action;
	}

	getDisplayName(item: T): string {
		return this.transformService.getValue(item, this.transform);
	}

	ngOnInit(): void {
		super.ngOnInit();

		if (!this.onAdd) {
			this.onAdd = () => this.immediateObservable();
		}

		if (!this.onRemove) {
			this.onRemove = () => this.immediateObservable();
		}

		if (this.disableSearching) {
			this.loadCachedItems();
		}
	}

	ngOnChanges(changes: ITypeaheadListChanges): void {
		super.ngOnChanges(<any>changes);
		if (changes.disableSearching && changes.disableSearching.currentValue && !this.cachedItems) {
			this.loadCachedItems();
		}
	}

	newTemplate(): TemplateRef<any> {
		return clone(this.template);
	}

	private filter(list: T[], search: string): T[] {
		const filteredList: T[] = filter(list, item => !find(this.value, item));

		if (this.clientSearch) {
			this.cachedItems = new BehaviorSubject<T[]>(filteredList);
			return filter(filteredList, item => this.searchUtility.tokenizedSearch(item, search));
		} else {
			return filteredList;
		}
	}

	private loadCachedItems(): void {
		this.searchItems().subscribe((items: T[]): void => {
			this.cachedItems = new BehaviorSubject<T[]>(items);
		});
	}

	private asObservable(value: Promise<any> | Observable<any> | void): Observable<any> {
		if (value) {
			return Observable.from(<Promise<any> | Observable<any>>value);
		} else {
			return this.immediateObservable();
		}
	}

	private immediateObservable(data?: any): Observable<any> {
		return new BehaviorSubject(data);
	}
}