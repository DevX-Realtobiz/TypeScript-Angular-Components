/// <reference path='../../../typings/chai/chai.d.ts' />
/// <reference path='../../../typings/mocha/mocha.d.ts' />
/// <reference path='../../../typings/sinon/sinon.d.ts' />
/// <reference path='../../../typings/chaiAssertions.d.ts' />

'use strict';

import { services } from 'typescript-angular-utilities';
import test = services.test;
import __parentChild = services.parentChildBehavior;

import {
	moduleName,
	controllerName,
	TypeaheadController,
	ISelectParams,
	IGetItemsParams,
	ITypeaheadBehavior,
} from './typeahead';

import * as angular from 'angular';
import 'angular-mocks';

import * as _ from 'lodash';

interface IWrappedItem {
	value: ITestObject;
}

interface ITestObject {
	prop: number;
}

describe('TypeaheadController', () => {
	let scope: angular.IScope;
	let typeahead: TypeaheadController;
	let $q: angular.IQService;
	let parentChild: __parentChild.IParentChildBehaviorService;

	beforeEach(() => {
		angular.mock.module(moduleName);

		let services: any = test.angularFixture.inject('$q', __parentChild.serviceName);
		$q = services.$q;
		parentChild = services[__parentChild.serviceName];
	});

	describe('transform', (): void => {
		it('should call transform on the scope if transform is provided', (): void => {
			let transform: Sinon.SinonSpy = sinon.spy((item: any): any => { return item.prop; });

			buildController(transform);

			let item: ITestObject = {
				prop: 1,
			};

			expect(typeahead.getDisplayName(item)).to.equal(1);
			sinon.assert.calledOnce(transform);
		});

		it('should return the item directly if transform is not provided', (): void => {
			buildController();

			let item: ITestObject = { prop: 1 };

			expect(typeahead.getDisplayName(item)).to.equal(item);
		});

		it('should return the item directly if the object is null', (): void => {
			let transform: Sinon.SinonSpy = sinon.spy((wrappedItem: any): any => { return wrappedItem.value.prop; });

			buildController(transform);

			expect(typeahead.getDisplayName(null)).to.be.null;
		});

		it('should use transform as a property selector if a string value is provided', (): void => {
			let transform: string = 'prop';

			buildController(transform);

			expect(typeahead.getDisplayName(item)).to.equal(item.prop);
		});
	});

	describe('loadItems', (): void => {
		let items: string[];

		beforeEach((): void => {
			items = ['Item 1', 'Item 2', 'Another item', 'A fourth item'];
		});

		it('should return an empty list if no text is entered', (): void => {
			buildController();

			let getItemsSpy: Sinon.SinonSpy = sinon.spy((): angular.IPromise<string[]> => { return $q.when(items); });
			typeahead.getItems = getItemsSpy;

			let typeahead.visibleItems: string[];

			typeahead.refresh('').then((result: string[]): void => {
				expect(result).to.be.empty;
			});

			sinon.assert.notCalled(getItemsSpy);
		});

		it('should return the result of the getItems function if useClientSearching is off', (): void => {
			buildController();

			// simulate a server-side search
			let getItemsSpy: Sinon.SinonSpy = sinon.spy((): angular.IPromise<string[]> => { return $q.when([items[0], items[1]]); });
			typeahead.getItems = getItemsSpy;

			let typeahead.visibleItems: string[];

			typeahead.refresh('Item ');

			sinon.assert.calledOnce(getItemsSpy);
			let firstArg: IGetItemsParams = getItemsSpy.firstCall.args[0];
			expect(firstArg.search).to.equal('Item ');

			scope.$digest();

			expect(typeahead.visibleItems.length).to.equal(2);
			expect(typeahead.visibleItems[0]).to.equal(items[0]);
			expect(typeahead.visibleItems[1]).to.equal(items[1]);
		});

		it('should apply the search string if useClientSearching is on', (): void => {
			buildController(null, true);

			let getItemsSpy: Sinon.SinonSpy = sinon.spy((): angular.IPromise<string[]> => { return $q.when(items); });
			typeahead.getItems = getItemsSpy;

			typeahead.refresh('A');

			sinon.assert.calledOnce(getItemsSpy);
			expect(getItemsSpy.firstCall.args).to.be.empty;

			scope.$digest();

			expect(typeahead.visibleItems.length).to.equal(2);
			expect(typeahead.visibleItems[0]).to.equal(items[2]);
			expect(typeahead.visibleItems[1]).to.equal(items[3]);
		});

		it('should cache the results of the parent getItems function and apply searches aganst the cached data if useClientSearching is on'
			, (): void => {
				buildController(null, true);

				let getItemsSpy: Sinon.SinonSpy = sinon.spy((): angular.IPromise<string[]> => { return $q.when(items); });
				typeahead.getItems = getItemsSpy;
				typeahead.refresh('A');
				scope.$digest();

				getItemsSpy.reset();

				typeahead.refresh('2');

				scope.$digest();

				sinon.assert.notCalled(getItemsSpy);

				expect(typeahead.visibleItems.length).to.equal(1);
				expect(typeahead.visibleItems[0]).to.equal(items[1]);
			});

		it('should add a special search option to the list if a create handler is provided and no match is found', (): void => {
			let createSpy: Sinon.SinonSpy = sinon.spy();
			buildController(null, true, createSpy);

			let getItemsSpy: Sinon.SinonSpy = sinon.spy((): angular.IPromise<string[]> => { return $q.when(items); });
			typeahead.getItems = getItemsSpy;

			let typeahead.visibleItems: string[];

			typeahead.refresh('A');

			scope.$digest();

			expect(typeahead.visibleItems.length).to.equal(3);
			expect(typeahead.visibleItems[0].__isSearchOption).to.be.true;
			expect(typeahead.visibleItems[1]).to.equal(items[2]);
			expect(typeahead.visibleItems[2]).to.equal(items[3]);
		});
	});

	describe('behavior', (): void => {
		it('should register a child behavior for adding items to the cached item list', (): void => {
			buildController(null, true);

			let behavior: ITypeaheadBehavior = parentChild.getChildBehavior(typeahead.childLink);

			expect(behavior).to.exist;
			expect(_.isFunction(behavior.add)).to.be.true;
			expect(_.isFunction(behavior.remove)).to.be.true;
		});

		it('should add the specified item to the cached item list', (): void => {
			buildController(null, true);

			let items: string[] = [];
			let getItemsSpy: Sinon.SinonSpy = sinon.spy((): angular.IPromise<string[]> => { return $q.when(items); });
			typeahead.getItems = getItemsSpy;
			typeahead.refresh('A');
			scope.$digest();

			let newItem: string = 'New item';

			parentChild.triggerChildBehavior(typeahead.childLink, (behavior: ITypeaheadBehavior): void => {
				behavior.add(newItem);
			});

			expect(items.length).to.equal(1);
			expect(items[0]).to.equal(newItem);
		});

		it('should remove the specified item from the cached items list', (): void => {
			buildController(null, true);

			let items: string[] = ['Item 1'];
			let getItemsSpy: Sinon.SinonSpy = sinon.spy((): angular.IPromise<string[]> => { return $q.when(items); });
			typeahead.getItems = getItemsSpy;
			typeahead.refresh('I');
			scope.$digest();

			parentChild.triggerChildBehavior(typeahead.childLink, (behavior: ITypeaheadBehavior): void => {
				behavior.remove(items[0]);
			});

			expect(items).to.be.empty;
		});
	});

	function buildController(transform?: Sinon.SinonSpy | string, useClientSearching?: boolean, create?: Sinon.SinonSpy, select?: Sinon.SinonSpy, allowCollapse: boolean): void {
		let bindings: any = {
			select: select,
			useClientSearching: useClientSearching,
			childLink: {},
			transform: transform,
			create: create,
			allowCollapse: allowCollapse,
		};

		let $attrs: any = {};

		$attrs.select = select != null ? 'select' : null;
		$attrs.create = create != null ? 'create' : null;

		let controllerResult: test.IControllerResult<TypeaheadController> =
			test.angularFixture.controllerWithBindings<TypeaheadController>(controllerName, bindings, { $attrs: $attrs });

		scope = controllerResult.scope;
		typeahead = controllerResult.controller;
		typeahead.$onInit();
	}
});
