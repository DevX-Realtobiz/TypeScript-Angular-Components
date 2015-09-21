/// <reference path='../../../typings/chai/chai.d.ts' />
/// <reference path='../../../typings/mocha/mocha.d.ts' />
/// <reference path='../../../typings/sinon/sinon.d.ts' />
/// <reference path='../../../typings/angularMocks.d.ts' />
/// <reference path='../../../typings/chaiAssertions.d.ts' />
/// <reference path='../../../libraries/typescript-angular-utilities/typings/utility.d.ts' />

/// <reference path='multiStepIndicator.ts' />

module rl.ui.components.multiStepIndicator {
	import test = utilities.services.test;

	interface IStateServiceMock {
		go: Sinon.SinonSpy;
		includes: Sinon.SinonSpy;
	}

	describe('MultiStepIndicatorController', () => {
		var scope: ng.IScope;
		var multiStepIndicator: MultiStepIndicatorController;
		var stateMock: IStateServiceMock;

		beforeEach(() => {
			angular.mock.module(moduleName);

			stateMock = {
				go: sinon.spy(),
				includes: sinon.spy((): boolean => { return false; }),
			};

			test.angularFixture.mock({
				$state: stateMock,
			});
		});

		it('should set inactive to true if no click handler or state name is provided', (): void => {
			var step: IStep = <any>{};
			buildController([step]);
			expect((<any>step).inactive).to.be.true;
		});

		it('should provide a default click handler that redirects to the specified state and sets the step to current if a state name is provided', (): void => {
			var step: IStep = <any>{ stateName: 'state' };
			buildController([step]);

			step.onClick();

			sinon.assert.calledOnce(stateMock.go);
			sinon.assert.calledWith(stateMock.go, 'state');
			expect(step.isCurrent).to.be.true;
		});

		it('should set the step to current if the specified state is already active', (): void => {
			var step1: IStep = <any>{ stateName: 'state2', isCurrent: false };
			var step2: IStep = <any>{ stateName: 'state1', isCurrent: false };
			stateMock.includes = sinon.spy((name: string): boolean => { return name === step1.stateName; });
			buildController([step1, step2]);

			expect(step1.isCurrent).to.be.true;
			expect(step2.isCurrent).to.be.false;
		});

		function buildController(steps: IStep[]): void {
			var controllerResult: test.IControllerResult<MultiStepIndicatorController>
				= test.angularFixture.controllerWithBindings<MultiStepIndicatorController>(controllerName, { steps: steps });

			scope = <ng.IScope>controllerResult.scope;
			multiStepIndicator = controllerResult.controller;
		}
	});
}
