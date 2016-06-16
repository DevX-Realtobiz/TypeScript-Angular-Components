import { SelectFilterComponent } from './selectFilter.component';

interface ITestObj {
	value: number;
}

describe('SelectFilterComponent', (): void => {
	let selectFilter: SelectFilterComponent<ITestObj>;

	beforeEach(() => {
		selectFilter = new SelectFilterComponent<ITestObj>({ log: sinon.spy() });
		selectFilter.filter = <any>{};
	});

	it('should set the selected value and refresh the data source', (): void => {
		const dataSource: any = { refresh: sinon.spy() };
		selectFilter.source = dataSource;
		const value: ITestObj = { value: 5 };

		selectFilter.setValue(value);

		sinon.assert.calledOnce(dataSource.refresh);
		expect(selectFilter.filter.selectedValue).to.equal(value);
	});
});
