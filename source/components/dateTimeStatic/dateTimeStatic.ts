'use strict';

// /// <reference path='../../../typings/bootstrapDateTimePicker.d.ts' />

import * as angular from 'angular';
import * as moment from 'moment';


export let moduleName: string = 'rl.ui.components.dateTimeStatic';
export let componentName: string = 'rlDateTimeStatic';
export let controllerName: string = 'DateTimeStaticController';

import { services } from 'typescript-angular-utilities';
import __date = services.date;
import __timezone = services.timezone;

export interface IDateTimeStaticBindings {
	dateValue: moment.Moment;
	includeTime: boolean;
	displayTimeZone: boolean;
}

export interface IDateTimeStaticController extends IDateTimeStaticBindings {
	displayValue: string;
}

export class DateTimeStaticController implements IDateTimeStaticController {
	dateValue: moment.Moment;
	includeTime: boolean;
	displayValue: string;
	displayTimeZone: boolean;
	timezone: string;

	static $inject: string[] = [__date.serviceName];
	constructor(private dateUtility: __date.IDateUtility) {
		if (this.dateValue != null && this.dateUtility.isDate(this.dateValue)) {
			this.dateValue = moment(this.dateValue);

			this.displayValue = this.dateValue.format(__date.defaultFormats.dateFormat);
			this.timezone = <any>this.dateValue.zoneAbbr();

			if (this.includeTime) {
				this.displayTimeZone = true;
				this.displayValue = this.displayValue + ' ' + this.dateValue.format(__date.defaultFormats.timeFormat);
			}
		}
	}
}

let dateTimeStaticComponent: angular.IComponentOptions = {
	template: require('./dateTimeStatic.html'),
	controller: controllerName,
	controllerAs: 'view',
	bindings: {
		dateValue: '<',
		includeTime: '<?',
		displayTimeZone: '<?',
	},
};

angular.module(moduleName, [])
	.component(componentName, dateTimeStaticComponent)
	.controller(controllerName, DateTimeStaticController);