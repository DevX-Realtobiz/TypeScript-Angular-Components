import { Component, Directive, ElementRef, Injector } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';
import * as angular from 'angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import 'moment-timezone';

import { services } from 'typescript-angular-utilities';
import __timezone = services.timezone;
import __validation = services.validation;

export const moduleName: string = 'InputTestModule';

interface ITestItem {
	name: string;
	value?: number;
}

class InputTestController {
	set: ITestItem[];
	options: ITestItem[];
	typeaheadList: ITestItem[];
	useSearch: boolean;
	date: moment.Moment;
	date2: moment.Moment;
	validate1: number;
	validate2: number;
	greaterThanFive1: __validation.IValidationHandler;
	greaterThanFive2: __validation.IValidationHandler;
	lessThanTen: __validation.IValidationHandler;

	static $inject: string[] = ['$q'];
	constructor(private $q: angular.IQService) {}

	$onInit(): void {
		this.options = [
			{ name: 'item1', value: 1 },
			{ name: 'item2', value: 2 },
			{ name: 'item3', value: 3 },
			{ name: 'item4', value: 4 },
			{ name: 'item5', value: 5 },
		];

		this.typeaheadList = [this.options[0], this.options[4]];
		this.useSearch = true;

		this.date = moment('2016-04-01T12:00:00.000-08:00').tz('US/Pacific');
		__timezone.timezoneService.setCurrentTimezone('-08:00');

		this.greaterThanFive1 = {
			validate: (): boolean => this.validate1 > 5,
			errorMessage: 'Must be greater than 5',
		};
		this.greaterThanFive2 = {
			validate: (): boolean => this.validate2 > 5,
			errorMessage: 'Must be greater than 5',
		};
		this.lessThanTen = {
			validate: (): boolean => this.validate2 < 10,
			errorMessage: 'Must be less than 10',
		};
	}

	select(value: ITestItem): void {
		this.set.push(value);
	}

	create(value: string): ITestItem {
		return {
			name: value,
		};
	}

	getOptions(): angular.IPromise<ITestItem[]> {
		return this.$q.when(_.clone(this.options));
	}

	logDates(): void {
		const format = 'YYYY-MM-DDTHH:mm:ssZ';
		console.log(this.date.format(format));
		console.log(this.date2.format(format));
	}

	log(message: string): void {
		console.log(message);
	}
}

@Component({
	selector: 'tsInputsNg1Bootstrapper',
	template: '<tsInputsNg1></tsInputsNg1>'
})
export class InputsNg1BootstrapperComponent {}

@Directive({
	selector: 'tsInputsNg1'
})
export class InputsNg1Directive extends UpgradeComponent {
	constructor(elementRef: ElementRef, injector: Injector) {
		super('tsInputsNg1', elementRef, injector);
	}
}

angular.module(moduleName, [])
	.component('tsInputsNg1', {
		template: require('./inputsNg1.html'),
		controller: 'InputTestController',
		controllerAs: 'input',
	})
	.controller('InputTestController', InputTestController);
