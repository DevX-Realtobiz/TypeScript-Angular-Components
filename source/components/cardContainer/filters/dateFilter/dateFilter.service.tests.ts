import * as moment from 'moment';

import { services } from 'typescript-angular-utilities';
import __date = services.date;
import __transform = services.transform;

import { DateFilter, IDateFilter } from './dateFilter.service';

interface ITestObj {
	value: moment.Moment;
}

describe('DateFilter', (): void => {
	let dateFilter: IDateFilter;

	beforeEach(() => {
		dateFilter = new DateFilter({
			type: 'dateFilter',
			valueSelector: 'value',
		}, __date.dateUtility, __transform.transform);
	});

	it('dateFilter should return true', (): void => {
		let item: ITestObj = { value: moment('2000-01-01T05:16:00.000') };
		let item2: ITestObj = { value: moment('2000-03-01T00:00:00.000') };
		let item3: ITestObj = { value: moment('1999-11-25T08:00:00.000') };

		dateFilter.dateFrom = moment('2000-01-01T05:16:00.000');

		expect(dateFilter.filter(item)).to.be.true;
		expect(dateFilter.filter(item2)).to.be.false;

		dateFilter.dateTo = moment('1999-11-15T05:16:00.000');
		dateFilter.dateRange = true;

		expect(dateFilter.filter(item)).to.be.true;
		expect(dateFilter.filter(item2)).to.be.false;
		expect(dateFilter.filter(item3)).to.be.true;

		//checking dateFrom null;
		dateFilter.dateFrom = null;
		expect(dateFilter.filter(item)).to.be.true;
	});
});