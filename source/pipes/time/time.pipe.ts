import { Pipe, PipeTransform, Inject } from '@angular/core';
import * as moment from 'moment';

import { services } from 'typescript-angular-utilities';
import __dateFormats = services.date.defaultFormats;
import __object = services.object;

@Pipe({ name: 'rlTime' })
export class TimePipe implements PipeTransform {
	private object: __object.IObjectUtility;

	constructor( @Inject(__object.objectToken) object: __object.IObjectUtility) {
		this.object = object;
	}

	transform(date?: moment.Moment): string {
		if (this.object.isNullOrEmpty(date)) {
			return '';
		}

		const momentDate: moment.Moment = moment(date);
		return momentDate.format(__dateFormats.timeFormat);
	}
}
