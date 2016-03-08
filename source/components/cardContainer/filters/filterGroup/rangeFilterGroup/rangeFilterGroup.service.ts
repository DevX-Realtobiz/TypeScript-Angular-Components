'use strict';

import * as angular from 'angular';
import * as _ from 'lodash';

import { services } from 'typescript-angular-utilities';
import __object = services.object;
import __transform = services.transform.transform;

import { IFilterOption, IFilterGroup, FilterGroup } from '../filterGroup.service';

export var moduleName: string = 'rl.ui.components.cardContainer.filters.filterGroup.rangeFilterGroup';
export var factoryName: string = 'rangeFilterGroup';

export interface IRangeFilterGroupSettings<TItemType> {
	label: string;
	type: string;
	getValue: { (item: TItemType): number } | string;
	options: IRangeFilterOptionSettings[];
}

export interface IRangeFilterOptionSettings {
	label: string;
	highInclusive?: number;
	highExclusive?: number;
	lowInclusive?: number;
	lowExclusive?: number;
}

export interface IRangeFilterOption extends IFilterOption {
	highInclusive?: number;
	highExclusive?: number;
	lowInclusive?: number;
	lowExclusive?: number;
}

export interface IRangeFilterGroup extends IFilterGroup {
	options: IRangeFilterOption[];
	serialize(): IRangeFilterValue;
}

export interface IRangeFilterValue {
	highInclusive?: number;
	highExclusive?: number;
	lowInclusive?: number;
	lowExclusive?: number;
}

class RangeFilterGroup extends FilterGroup implements IRangeFilterGroup {
	private getValue: { (item: any): number } | string;

	constructor(settings: IRangeFilterGroupSettings<any>, object: __object.IObjectUtility) {
		super(<any>settings, object);
		this.getValue = settings.getValue;
		settings.options = _.map<IRangeFilterOptionSettings, IRangeFilterOption>(settings.options, this.buildRangeOption.bind(this));
		this.initOptions();
	}

	serialize(): IRangeFilterValue {
		let activeOption: IRangeFilterOption = <any>this.activeOption;
		if (this.isNullOption(activeOption)) {
			return null;
		}
		return {
			highInclusive: activeOption.highInclusive,
			highExclusive: activeOption.highExclusive,
			lowInclusive: activeOption.lowInclusive,
			lowExclusive: activeOption.lowExclusive,
		};
	}

	private buildRangeOption(option: IRangeFilterOptionSettings): IRangeFilterOption {
		var modeOption: IRangeFilterOption = <any>option;
		modeOption.filter = (item: any): boolean => {
			var value: number = __transform.getValue(item, this.getValue);

			var result: boolean = true;

			if (_.isUndefined(option.highExclusive) === false) {
				result = value < option.highExclusive;
			} else if (_.isUndefined(option.highInclusive) === false) {
				result = value <= option.highInclusive;
			}

			if (_.isUndefined(option.lowExclusive) === false) {
				result = result && value > option.lowExclusive;
			} else if (_.isUndefined(option.lowInclusive) === false) {
				result = result && value >= option.lowInclusive;
			}

			return result;
		};

		return modeOption;
	}

	private isNullOption(option: IRangeFilterOption): boolean {
		return option.highInclusive == null
			&& option.highExclusive == null
			&& option.lowInclusive == null
			&& option.lowExclusive == null;
	}
}

export interface IRangeFilterGroupFactory {
	getInstance<TItemType>(settings: IRangeFilterGroupSettings<TItemType>): IRangeFilterGroup;
}

rangeFilterGroupFactory.$inject = [__object.serviceName];
export function rangeFilterGroupFactory(object: __object.IObjectUtility): IRangeFilterGroupFactory {
	'use strict';
	return {
		getInstance(settings: IRangeFilterGroupSettings<any>): IRangeFilterGroup {
			return new RangeFilterGroup(settings, object);
		},
	};
}

angular.module(moduleName, [__object.moduleName])
	.factory(factoryName, rangeFilterGroupFactory);
