/// <reference path='../../../typings/chai/chai.d.ts' />
/// <reference path='../../../typings/mocha/mocha.d.ts' />
/// <reference path='../../../typings/sinon/sinon.d.ts' />
/// <reference path='../../../typings/chaiAssertions.d.ts' />

'use strict';

import { services } from 'typescript-angular-utilities';

import {
	moduleName,
	controllerName,
	LazyLoadController,
} from './lazyLoad';

import * as angular from 'angular';
import 'angular-mocks';

import test = services.test;

interface ITestObject {
	prop: string;
}

describe('LazyLoadController', () => {
	var scope: angular.IScope;
	var lazyLoad: LazyLoadController;

	beforeEach(() => {
		angular.mock.module(moduleName);
	});

	it('should set init true when the expression first evaluates to true', (): void => {
		buildController(false);
		scope.$digest();

		expect(lazyLoad.init).to.be.false;

		lazyLoad.show = true;
		scope.$digest();

		expect(lazyLoad.init).to.be.true;

		lazyLoad.show = false;
		scope.$digest();

		expect(lazyLoad.init).to.be.true;
	});

	function buildController(expression: boolean): void {
		var controllerResult: test.IControllerResult<LazyLoadController>
			= test.angularFixture.controllerWithBindings<LazyLoadController>(controllerName, { show: expression });

		scope = <angular.IScope>controllerResult.scope;
		lazyLoad = controllerResult.controller;
	}
});
