import * as ui from 'angular-ui-router';

import { services } from 'typescript-angular-utilities';
import __test = services.test;
import mock = __test.mock;
import fakeAsync = __test.fakeAsync;
import IMockedPromise = __test.IMockedPromise;

import { MultiStepIndicatorComponent, IStep, IConfiguredStep } from './multiStepIndicator';

describe('MultiStepIndicatorComponent', () => {
    let msi: MultiStepIndicatorComponent;
    let stateMock: any;

    beforeEach(() => {
        stateMock = {
            go: mock.promise(),
            includes: sinon.spy(),
        };

        msi = new MultiStepIndicatorComponent(stateMock);
    });

    it('should set isActive to false if neither a click handler nor state name are provided', (): void => {
        let step: IStep = <IConfiguredStep>{};

        msi.steps = <IConfiguredStep[]>[step];
        msi.ngOnInit();

        expect((<IConfiguredStep>step).isActive).to.be.false;
    });

    it('should set isActive to true if both a click handler and state name are provided', (): void => {
        let step: IStep = <any>{ onClick: () => mock.promise(), stateName: 'state' };

        msi.steps = <IConfiguredStep[]>[step];
        msi.ngOnInit();

        expect((<IConfiguredStep>step).isActive).to.be.true;
    });

    it('should provide a default click handler that redirects to the specified state and sets the step to current if a state name is provided', fakeAsync((): void => {
        let step: IStep = <any>{ stateName: 'state' };

        msi.steps = <IConfiguredStep[]>[step];
        msi.ngOnInit();

        step.onClick();

        sinon.assert.calledOnce(stateMock.go);
        sinon.assert.calledWith(stateMock.go, 'state');

        stateMock.go.flush();

        expect(step.isCurrent).to.be.true;
    }));

    it('should set the step to current if the specified state is already active', (): void => {
        let activeState = 'activeState';
        let step1: IStep = <any>{ stateName: activeState };
        let step2: IStep = <any>{ stateName: 'inactiveState' };

        stateMock.includes = sinon.spy((name: string): boolean => name === activeState);
        msi.steps = <IConfiguredStep[]>[step1, step2];
        msi.ngOnInit();

        expect(step1.isCurrent).to.be.true;
        expect(step2.isCurrent).to.be.false;
    });

    it('should show a spinner on the step and disable all clicks when the step is loading', fakeAsync((): void => {
        let step1: IStep = <any>{ onClick: mock.promise() };
        let step2: IStep = <any>{ onClick: sinon.spy() };

        msi.steps = <IConfiguredStep[]>[step1, step2];
        msi.ngOnInit();

        msi.onClick(<IConfiguredStep>step1);
        msi.onClick(<IConfiguredStep>step2);

        expect((<IConfiguredStep>step1).isLoading).to.be.true;
        expect((<IConfiguredStep>step2).isLoading).to.be.false;

        (<IMockedPromise<any>>step1.onClick).flush();

        sinon.assert.calledOnce(<Sinon.SinonSpy>step1.onClick);
        sinon.assert.notCalled(<Sinon.SinonSpy>step2.onClick);
    }));

    it('should clear the spinner when the promise resolves', fakeAsync((): void => {
        let step: IStep = <any>{ onClick: mock.promise() };

        msi.steps = <IConfiguredStep[]>[step];
        msi.ngOnInit();

        msi.onClick(<IConfiguredStep>step);

        expect((<IConfiguredStep>step).isLoading).to.be.true;

        (<IMockedPromise<any>>step.onClick).flush();

        sinon.assert.calledOnce(<Sinon.SinonSpy>step.onClick);
        expect((<IConfiguredStep>step).isLoading).to.be.false;
    }));

    it('should clear the spinner when the promise rejects', fakeAsync((): void => {
        let step: IStep = <any>{ onClick: mock.rejectedPromise() };

        msi.steps = <IConfiguredStep[]>[step];
        msi.ngOnInit();

        msi.onClick(<IConfiguredStep>step);

        expect((<IConfiguredStep>step).isLoading).to.be.true;

        (<IMockedPromise<any>>step.onClick).flush();

        sinon.assert.calledOnce(<Sinon.SinonSpy>step.onClick);
        expect((<IConfiguredStep>step).isLoading).to.be.false;
    }));

    it('should allow isCompleted to be supplied as a bool or a function', (): void => {
    	let step1: IStep = <any>{ isCompleted: true, };
    	let step2: IStep = <any>{ isCompleted: sinon.spy((): boolean => { return true; }), };

        msi.steps = <IConfiguredStep[]>[step1, step2];
        msi.ngOnInit();

    	expect((<IConfiguredStep>step1).getCompleted()).to.be.true;
    	expect((<IConfiguredStep>step2).getCompleted()).to.be.true;
    	sinon.assert.calledOnce(<Sinon.SinonSpy>step2.isCompleted);
    });

    it('should allow isValid to be supplied as a bool or a function', (): void => {
    	let step1: IStep = <any>{ isValid: true, };
    	let step2: IStep = <any>{ isValid: sinon.spy((): boolean => { return true; }), };

        msi.steps = <IConfiguredStep[]>[step1, step2];
        msi.ngOnInit();

    	expect((<IConfiguredStep>step1).getValid()).to.be.true;
    	expect((<IConfiguredStep>step2).getValid()).to.be.true;
    	sinon.assert.calledOnce(<Sinon.SinonSpy>step2.isValid);
    });
});
