import { services } from 'typescript-angular-utilities';
import test = services.test;

import {
	PagerController,
	moduleName,
	controllerName,
} from './pager.ng1';

import * as angular from 'angular';
import 'angular-mocks';
import * as Rx from 'rxjs';

interface IDataPagerMock {
	pageSize: number;
	pageNumber: number;
	pageSizeChanges: Rx.Subject<number>;
}

interface IDataSourceMock {
	count: number;
	countChanges: Rx.Subject<number>;
	setCount(count: number): void;
	pager: IDataPagerMock;
}

describe('PagerController', () => {
	let scope: angular.IScope;
	let pager: PagerController;
	let dataPager: IDataPagerMock;
	let dataSource: IDataSourceMock;

	beforeEach(() => {
		angular.mock.module(moduleName);
	});

	describe('first', (): void => {
		it('should set the current page to the first page', (): void => {
			buildController();

			pager.currentPage = 5;

			pager.first();

			expect(pager.currentPage).to.equal(1);
		});
	});

	describe('previous', (): void => {
		beforeEach((): void => {
			buildController();
		});

		it('should decrement the current page if it is not on the first page', (): void => {
			pager.currentPage = 5;

			pager.previous();

			expect(pager.currentPage).to.equal(4);
		});

		it('should stay on the current page if it is on the first page', (): void => {
			pager.currentPage = 1;

			pager.previous();

			expect(pager.currentPage).to.equal(1);
		});
	});

	describe('next', (): void => {
		beforeEach((): void => {
			buildController(5);
		});

		it('should increment the current page if it is not on the last page', (): void => {
			pager.currentPage = 1;

			pager.next();

			expect(pager.currentPage).to.equal(2);
		});

		it('should stay on the current page if it is on the last page', (): void => {
			pager.currentPage = 5;

			pager.next();

			expect(pager.currentPage).to.equal(5);
		});
	});

	describe('goto', (): void => {
		beforeEach((): void => {
			buildController(5);
			pager.currentPage = 5;
		});

		it('should go to the specified page if the page exists', (): void => {
			pager.goto(3);
			expect(pager.currentPage).to.equal(3);
		});

		it('should stay on the current page if the specified page is before the first page', (): void => {
			pager.goto(0);
			expect(pager.currentPage).to.equal(5);
		});

		it('should stay on the current page if the specified page is after the last page', (): void => {
			pager.goto(6);
			expect(pager.currentPage).to.equal(5);
		});
	});

	describe('last', (): void => {
		it('should go to the last page', (): void => {
			buildController(5);

			pager.currentPage = 1;

			pager.last();

			expect(pager.currentPage).to.equal(5);
		});
	});

	describe('currentPage', (): void => {
		it('should update the pageNumber on the pager when the currentPage changes', (): void => {
			buildController(5);
			pager.currentPage = 2;

			expect(dataPager.pageNumber).to.equal(2);

			pager.currentPage = 4;

			expect(dataPager.pageNumber).to.equal(4);
		});
	});

	describe('updatePageCount', (): void => {
		it('should set the last page to the item count divided by the page size rounded up', (): void => {
			buildController();
			dataPager.pageSize = 3;
			dataSource.setCount(10);

			// 10 / 3 = 3.3333...
			pager.last();
			expect(pager.currentPage).to.equal(4);
		});

		it('should update the last page when the data source count changes', (): void => {
			buildController(1);
			pager.last();
			expect(pager.currentPage).to.equal(1);

			dataSource.setCount(5);

			pager.last();
			expect(pager.currentPage).to.equal(5);
		});

		it('should update the last page when the page size changes', (): void => {
			buildController(10);
			pager.last();
			expect(pager.currentPage).to.equal(10);

			// increasing the page size to 5 decreases the number of pages to 2
			dataPager.pageSize = 5;
			dataPager.pageSizeChanges.next(5);

			pager.last();
			expect(pager.currentPage).to.equal(2);
		});

		it('should update the current page when the last page changes', (): void => {
			buildController(5);
			pager.currentPage = 5;

			dataSource.setCount(8);

			expect(pager.currentPage).to.equal(1);
		});
	});

	describe('updatePaging', (): void => {
		describe('canGoBack', (): void => {
			beforeEach((): void => {
				buildController(5);
			});

			it('should be false if on the first page', (): void => {
				pager.currentPage = 1;
				expect(pager.canGoBack).to.be.false;
			});

			it('should be true if not on the first page', (): void => {
				pager.currentPage = 5;
				expect(pager.canGoBack).to.be.true;
			});
		});

		describe('canGoForward', (): void => {
			beforeEach((): void => {
				buildController(5);
			});

			it('should be false if on the last page', (): void => {
				pager.currentPage = 5;
				expect(pager.canGoForward).to.be.false;
			});

			it('should be true if not on the last page', (): void => {
				pager.currentPage = 1;
				expect(pager.canGoForward).to.be.true;
			});
		});

		describe('pages', (): void => {
			it('should generate a range of pages equal to the visible page count centered around the current page', (): void => {
				buildController(5, 5);
				pager.currentPage = 3;

				expect(pager.pages).to.have.length(5);
				expect(pager.pages[0]).to.equal(1);
				expect(pager.pages[1]).to.equal(2);
				expect(pager.pages[2]).to.equal(3);
				expect(pager.pages[3]).to.equal(4);
				expect(pager.pages[4]).to.equal(5);

				buildController(5, 3);
				pager.currentPage = 3;

				expect(pager.pages).to.have.length(3);
				expect(pager.pages[0]).to.equal(2);
				expect(pager.pages[1]).to.equal(3);
				expect(pager.pages[2]).to.equal(4);
			});

			it('should show more pages after the current page if the current page is too close to the first page', (): void => {
				buildController(8, 5);
				pager.currentPage = 2;

				expect(pager.pages).to.have.length(5);
				expect(pager.pages[0]).to.equal(1);
				expect(pager.pages[1]).to.equal(2);
				expect(pager.pages[2]).to.equal(3);
				expect(pager.pages[3]).to.equal(4);
				expect(pager.pages[4]).to.equal(5);
			});

			it('should show more pages before the current page if the current page is too close to the last page', (): void => {
				buildController(8, 5);
				pager.currentPage = 7;

				expect(pager.pages).to.have.length(5);
				expect(pager.pages[0]).to.equal(4);
				expect(pager.pages[1]).to.equal(5);
				expect(pager.pages[2]).to.equal(6);
				expect(pager.pages[3]).to.equal(7);
				expect(pager.pages[4]).to.equal(8);
			});

			it('should show all pages if the page count is greater than the number of pages', (): void => {
				buildController(3, 5);
				pager.currentPage = 3;

				expect(pager.pages).to.have.length(3);
				expect(pager.pages[0]).to.equal(1);
				expect(pager.pages[1]).to.equal(2);
				expect(pager.pages[2]).to.equal(3);
			});

			it('should show an additional page after the current page if an even number of visible pages is specified', (): void => {
				buildController(5, 4);
				pager.currentPage = 3;

				expect(pager.pages).to.have.length(4);
				expect(pager.pages[0]).to.equal(2);
				expect(pager.pages[1]).to.equal(3);
				expect(pager.pages[2]).to.equal(4);
				expect(pager.pages[3]).to.equal(5);
			});
		});
	});

	function buildController(lastPage?: number, pageCount?: number): void {
		dataPager = {
			pageSize: 1,
			pageNumber: 1,
			pageSizeChanges: new Rx.Subject<number>(),
		};

		dataSource = {
			count: lastPage,
			countChanges: new Rx.Subject<number>(),
			setCount(count: number): void {
				dataSource.count = count;
				dataSource.countChanges.next(count);
			},
			pager: dataPager,
		};

		const bindings: any = {
			pageCount: pageCount,
			cardContainer: {
				dataSource: dataSource,
			},
		};

		const controllerResult: test.IControllerResult<PagerController>
			= test.angularFixture.controllerWithBindings<PagerController>(controllerName, bindings);

		scope = controllerResult.scope;
		pager = controllerResult.controller;
		pager.$onInit();

		if (lastPage != null) {
			scope.$digest();
		}
	}
});
