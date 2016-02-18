/// <reference path='../../../../typings/chai/chai.d.ts' />
/// <reference path='../../../../typings/mocha/mocha.d.ts' />
/// <reference path='../../../../typings/sinon/sinon.d.ts' />
/// <reference path='../../../../typings/chaiAssertions.d.ts' />

'use strict';

import { services } from 'typescript-angular-utilities';
import test = services.test;
import __observable = services.observable;
import __array = services.array;

import {
	DataSourceBase,
} from './dataSourceBase.service';

import {
	IDataSource,
	moduleName,
} from './dataSources.module';

import * as angular from 'angular';
import 'angular-mocks';

interface IDataSourceProcessorMock {
	process: Sinon.SinonSpy;
	processAndCount: Sinon.SinonSpy;
	sort: Sinon.SinonSpy;
	page: Sinon.SinonSpy;
}

describe('dataSourceBase', () => {
	var dataSourceBase: IDataSource<number>;
	var dataSourceProcessor: IDataSourceProcessorMock;

	beforeEach(() => {
		angular.mock.module(__observable.moduleName);
		angular.mock.module(__array.moduleName);
		angular.mock.module(moduleName);

		dataSourceProcessor = {
			process: sinon.spy((sorts: any, filters: any, pager: any, data: any): any => {
				return {
					count: (data != null ? data.length : 0),
					dataSet: data,
					filteredDataSet: data,
				};
			}),
			processAndCount: sinon.spy((sorts: any, filters: any, pager: any, data: any): any => {
				return {
					count: (data != null ? data.length : 0),
					dataSet: data,
					filteredDataSet: data,
				};
			}),
			sort: sinon.spy((data: any): any => { return data; }),
			page: sinon.spy((data: any): any => { return data; }),
		};

		var services: any = test.angularFixture.inject(__observable.factoryName, __array.serviceName);
		dataSourceBase = new DataSourceBase<number>(services[__observable.factoryName]
													, <any>dataSourceProcessor
													, services[__array.serviceName]);
	});

	describe('processData', (): void => {
		it('should process data', (): void => {
			dataSourceProcessor.process.reset();

			var testArray: number[] = [1, 2, 3];
			dataSourceBase.rawDataSet = testArray;
			dataSourceBase.countFilterGroups = false;
			dataSourceBase.processData();

			sinon.assert.calledOnce(dataSourceProcessor.process);
			expect(dataSourceBase.dataSet).to.equal(testArray);
			expect(dataSourceBase.filteredDataSet).to.equal(testArray);
			expect(dataSourceBase.count).to.equal(3);
		});

		it('should process and count data', (): void => {
			dataSourceProcessor.processAndCount.reset();

			var testArray: number[] = [1, 2, 3];
			dataSourceBase.rawDataSet = testArray;
			dataSourceBase.countFilterGroups = true;
			dataSourceBase.processData();

			sinon.assert.calledOnce(dataSourceProcessor.processAndCount);
			expect(dataSourceBase.dataSet).to.equal(testArray);
			expect(dataSourceBase.filteredDataSet).to.equal(testArray);
			expect(dataSourceBase.count).to.equal(3);
		});
	});

	describe('onSortChange', (): void => {
		it('should reapply sorts and pagin and signal redrawing', (): void => {
			var redrawSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(redrawSpy, 'redrawing');

			dataSourceBase.onSortChange();

			sinon.assert.calledOnce(redrawSpy);
			sinon.assert.calledOnce(<Sinon.SinonSpy>dataSourceProcessor.sort);
			sinon.assert.calledOnce(<Sinon.SinonSpy>dataSourceProcessor.page);
		});

		it('should not reapply if data is being reloaded', (): void => {
			var redrawSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(redrawSpy, 'redrawing');

			dataSourceBase.loadingDataSet = true;
			dataSourceBase.onSortChange();

			sinon.assert.notCalled(redrawSpy);
			sinon.assert.notCalled(<Sinon.SinonSpy>dataSourceProcessor.page);
			sinon.assert.notCalled(<Sinon.SinonSpy>dataSourceProcessor.sort);
		});
	});

	describe('refresh', (): void => {
		beforeEach((): void => {
			// mock process data for these tests
			dataSourceBase.processData = <any>sinon.spy();
		});

		it('should process the data and signal redrawing', (): void => {
			var redrawSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(redrawSpy, 'redrawing');

			dataSourceBase.refresh();

			sinon.assert.calledOnce(redrawSpy);
			sinon.assert.calledOnce(<Sinon.SinonSpy>dataSourceBase.processData);
		});

		it('should not refresh if data is being reloaded', (): void => {
			var redrawSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(redrawSpy, 'redrawing');

			dataSourceBase.loadingDataSet = true;
			dataSourceBase.refresh();

			sinon.assert.notCalled(redrawSpy);
			sinon.assert.notCalled(<Sinon.SinonSpy>dataSourceBase.processData);
		});
	});

	describe('remove', (): void => {
		beforeEach((): void => {
			dataSourceBase.refresh = <any>sinon.spy();
		});

		it('should remove an item and signal removed and changed', (): void => {
			var removeSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(removeSpy, 'removed');
			var changeSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(changeSpy, 'changed');

			dataSourceBase.rawDataSet = [1, 2, 3];
			dataSourceBase.remove(2);

			expect(dataSourceBase.rawDataSet).to.deep.equal([1, 3]);
			sinon.assert.calledOnce(removeSpy);
			sinon.assert.calledOnce(changeSpy);
		});

		it('should not signal remvoed or changed if item is not found', (): void => {
			var removeSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(removeSpy, 'removed');
			var changeSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(changeSpy, 'changed');

			dataSourceBase.rawDataSet = [1, 2, 3];
			dataSourceBase.remove(5);

			expect(dataSourceBase.rawDataSet).to.deep.equal([1, 2, 3]);
			sinon.assert.notCalled(removeSpy);
			sinon.assert.notCalled(changeSpy);
		});

		it('should refresh if paging is enabled', (): void => {
			dataSourceBase.rawDataSet = [1, 2, 3];
			dataSourceBase.pager = <any>{};
			dataSourceBase.remove(2);
			sinon.assert.calledOnce(<Sinon.SinonSpy>dataSourceBase.refresh);
		});

		it('should not refresh if paging is not enabled', (): void => {
			dataSourceBase.rawDataSet = [1, 2, 3];
			dataSourceBase.remove(2);
			sinon.assert.notCalled(<Sinon.SinonSpy>dataSourceBase.refresh);
		});
	});

	describe('push', (): void => {
		it('should add item and signal added and changed', (): void => {
			dataSourceBase.refresh = <any>sinon.spy();
			var addSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(addSpy, 'added');
			var changeSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(changeSpy, 'changed');

			dataSourceBase.rawDataSet = [1, 2, 3];
			dataSourceBase.push(4);

			expect(dataSourceBase.rawDataSet).to.deep.equal([1, 2, 3, 4]);
			sinon.assert.calledOnce(<Sinon.SinonSpy>dataSourceBase.refresh);
			sinon.assert.calledOnce(addSpy);
			sinon.assert.calledOnce(changeSpy);
		});
	});

	describe('replace', (): void => {
		it('should not signal replaced or changed if old item is not found', (): void => {
			var replaceSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(replaceSpy, 'replaced');
			var changeSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(changeSpy, 'changed');

			dataSourceBase.rawDataSet = [1, 2, 3];
			dataSourceBase.replace(4, 5);

			expect(dataSourceBase.rawDataSet).to.deep.equal([1, 2, 3]);
			sinon.assert.notCalled(replaceSpy);
			sinon.assert.notCalled(changeSpy);
		});

		it('should replace item and signal replaced and changed', (): void => {
			dataSourceBase.refresh = sinon.spy();
			var replaceSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(replaceSpy, 'replaced');
			var changeSpy: Sinon.SinonSpy = sinon.spy();
			dataSourceBase.watch(changeSpy, 'changed');

			dataSourceBase.rawDataSet = [1, 2, 3];
			dataSourceBase.replace(3, 4);

			expect(dataSourceBase.rawDataSet).to.deep.equal([1, 2, 4]);
			sinon.assert.calledOnce(<Sinon.SinonSpy>dataSourceBase.refresh);
			sinon.assert.calledOnce(replaceSpy);
			sinon.assert.calledOnce(changeSpy);
		});
	});
});
