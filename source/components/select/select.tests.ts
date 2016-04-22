/// <reference path='../../../typings/chai/chai.d.ts' />
/// <reference path='../../../typings/mocha/mocha.d.ts' />
/// <reference path='../../../typings/sinon/sinon.d.ts' />
/// <reference path='../../../typings/chaiAssertions.d.ts' />

'use strict';

import * as angular from 'angular';
import 'angular-mocks';

import { services } from 'typescript-angular-utilities';
import __test = services.test;

import { controllerName, SelectController, moduleName } from './select';

interface INgModelMock {
	$setViewValue: Sinon.SinonSpy;
	$viewValue?: ITestOption;
}

interface ITestOption {
	value: number;
}

describe('SelectController', () => {
	let scope: angular.IScope;
	let dropdown: SelectController;
	let ngModel: INgModelMock;
	let options: ITestOption[];
	let selectSpy: Sinon.SinonSpy;

	beforeEach(() => {
		angular.mock.module(moduleName);

		ngModel = {
			$setViewValue: sinon.spy((value: any) => ngModel.$viewValue = value),
		};

		selectSpy = sinon.spy();

		options = [
			{ value: 1 },
			{ value: 2 },
			{ value: 3 },
			{ value: 4 },
			{ value: 5 },
		];
	});

	it('should set the model view value to the selected option', (): void => {
		buildController();
		let option: ITestOption = { value: 2 };

		dropdown.selection = option;

		sinon.assert.calledOnce(ngModel.$setViewValue);
		sinon.assert.calledWith(ngModel.$setViewValue, option);
	});

	it('should fire a selected event when the selection is changed', (): void => {
		buildController();
		let option: ITestOption = { value: 2 };

		dropdown.selection = option;

		sinon.assert.calledOnce(selectSpy);
		sinon.assert.calledWith(selectSpy, { item: option });
	});

	it('should get the model view value', (): void => {
		buildController();
		let option: ITestOption = { value: 2 };

		ngModel.$viewValue = option;

		expect(dropdown.selection).to.equal(option);
	});

	describe('getOptions', (): void => {
		let getOptions: Sinon.SinonSpy;

		beforeEach((): void => {
			let $q: angular.IQService = __test.angularFixture.inject('$q').$q;

			getOptions = sinon.spy((): angular.IPromise<ITestOption[]> => {
				return $q.when(options);
			});
		});

		it('should load the options asynchronously if no options are specified and a loader is provided', (): void => {
			buildController(undefined, null, getOptions);

			expect(dropdown.options).to.not.exist;
			sinon.assert.calledOnce(getOptions);

			scope.$digest();

			expect(dropdown.options).to.equal(options);
		});

		it('should leave the options null if none are specified and no loader is provided', (): void => {
			buildController();
			expect(dropdown.options).to.not.exist;
		});

		it('should still add a null option to the options when loading options asynchronously', (): void => {
			buildController(undefined, 'None', getOptions);
			scope.$digest();

			expect(dropdown.options[0].__isNullOption).to.be.true;
		});
	});

	describe('nullOption', (): void => {
		let nullOption: string;

		beforeEach((): void => {
			nullOption = 'None';
			buildController(options, nullOption);
		});

		it('should add a special null option to the beginning of the options list', (): void => {
			expect(dropdown.options[0].__isNullOption).to.be.true;
		});

		it('should set the model view value to null if the null option is selected', (): void => {
			dropdown.selection = dropdown.options[0];

			sinon.assert.calledOnce(ngModel.$setViewValue);
			sinon.assert.calledWith(ngModel.$setViewValue, null);
		});

		it('should return the null option string for the display name of the null option', (): void => {
			let nullOptionDisplayName: string = dropdown.getDisplayName(dropdown.options[0]);
			expect(nullOptionDisplayName).to.equal(nullOption);
		});
	});

	function buildController(options?: ITestOption[], nullOption?: string, getOptions?: {(): angular.IPromise<ITestOption[]> }): void {
		let bindings: any = {
			options: options,
			nullOption: nullOption,
			getOptions: getOptions ? getOptions : sinon.spy(),
		};

		let locals: any = {
			$attrs: { $set: sinon.spy() },
		};

		let controllerResult: __test.IControllerResult<SelectController>
			= __test.angularFixture.controllerWithBindings<SelectController>(controllerName, bindings, locals);

		scope = controllerResult.scope;
		dropdown = controllerResult.controller;
		dropdown.ngModel = <any>ngModel;
		dropdown.select = selectSpy;
		dropdown.$onInit();
	}
});
