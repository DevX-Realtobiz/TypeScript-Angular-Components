import { Component, Inject } from '@angular/core';
import { mapValues } from 'lodash';

import { services } from 'typescript-angular-utilities';
import __date = services.date;
import __transform = services.transform;
import __timezone = services.timezone;
import __object = services.object;

import { SIMPLE_CARD_DIRECTIVES } from '../../source/components/simpleCardList/index';
import { CheckboxComponent } from '../../source/components/inputs/checkbox/checkbox';
import { TextboxComponent } from '../../source/components/inputs/textbox/textbox';
import { DateFilter } from '../../source/components/cardContainer/filters/dateFilter/dateFilter.service';
import { DateFilterComponent } from '../../source/components/cardContainer/filters/dateFilter/dateFilter.component';
import { FilterGroup } from '../../source/components/cardContainer/filters/filterGroup/filterGroup.service';
import { ModeFilterGroup } from '../../source/components/cardContainer/filters/filterGroup/modeFilterGroup/modeFilterGroup.service';
import { RangeFilterGroup } from '../../source/components/cardContainer/filters/filterGroup/rangeFilterGroup/rangeFilterGroup.service';
import { FilterGroupComponent } from '../../source/components/cardContainer/filters/filterGroup/filterGroup.component';
import { SelectFilter } from '../../source/components/cardContainer/filters/selectFilter/selectFilter.service';
import { SelectFilterComponent } from '../../source/components/cardContainer/filters/selectFilter/selectFilter.component';

@Component({
	selector: 'tsCardsBootstrapper',
	template: require('./cardsNg2.html'),
	directives: [
		SIMPLE_CARD_DIRECTIVES,
		CheckboxComponent,
		TextboxComponent,
		DateFilterComponent,
		FilterGroupComponent,
		SelectFilterComponent,
	],
})
export class CardsBootstrapper {
	alwaysOpen: boolean = false;
	options: number[];
	dateFilter: DateFilter;
	filterGroup: FilterGroup;
	modeFilterGroup: ModeFilterGroup;
	rangeFilterGroup: RangeFilterGroup;
	selectFilter: SelectFilter<any, any>;

	constructor(@Inject(__timezone.timezoneToken) timezone: __timezone.ITimezoneService) {
		timezone.setCurrentTimezone('-05:00');

		this.options = [1, 2, 3, 4, 5];

		this.dateFilter = new DateFilter({
			type: 'dateFilter',
			valueSelector: 'date',
		}, __date.dateUtility, __transform.transform);

		this.filterGroup = new FilterGroup({
			type: 'testGroup',
			label: 'Filter Group',
			options: [
				{
					label: 'Show',
					filter: item => item.show,
					serialize: () => 'show',
				},
				{
					label: 'Hide',
					filter: item => !item.show,
					serialize: () => 'hide',
				},
			],
		}, __object.objectUtility);

		this.modeFilterGroup = new ModeFilterGroup({
			type: 'testModeGroup',
			label: 'Mode Filter Group',
			getValue: 'value',
			options: [
				{
					label: 'All',
					displayAll: true,
				},
				{
					label: 'Value 1',
					value: 1,
				},
			],
		}, __object.objectUtility, __transform.transform);

		this.rangeFilterGroup = new RangeFilterGroup({
			type: 'testRangeGroup',
			label: 'Range Filter Group',
			getValue: 'value',
			options: [
				{
					label: '5 - 10',
					highInclusive: 10,
					lowInclusive: 5,
				},
				{
					label: '< 5',
					highExclusive: 5,
				},
			],
		}, __object.objectUtility, __transform.transform);

		this.selectFilter = new SelectFilter({
			valueSelector: 'value',
		}, __object.objectUtility, __transform.transform);

		this.dateFilter.subscribe(value => console.log(mapValues(value, date => date != null ? date.format(__date.defaultFormats.dateTimeFormat) : null)));
		this.filterGroup.subscribe(value => console.log(value));
		this.modeFilterGroup.subscribe(value => console.log(value));
		this.rangeFilterGroup.subscribe(value => console.log(value));
		this.selectFilter.subscribe(value => console.log(value));
	}

	submitAsync: { (data: any): Promise<void> } = (data: any) => {
		return new Promise<void>((resolve: Function, reject: Function): void => {
			setTimeout(() => {
				console.log(data);
				resolve();
			}, 1000);
		});
	}
}