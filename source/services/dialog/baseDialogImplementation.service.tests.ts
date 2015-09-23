/// <reference path='../../../typings/chai/chai.d.ts' />
/// <reference path='../../../typings/mocha/mocha.d.ts' />
/// <reference path='../../../typings/sinon/sinon.d.ts' />
/// <reference path='../../../typings/angularMocks.d.ts' />
/// <reference path='../../../typings/chaiAssertions.d.ts' />
/// <reference path='../../../libraries/typescript-angular-utilities/typings/utility.d.ts' />

/// <reference path='dialog.service.ts' />
/// <reference path='baseDialogImplementation.service.ts' />

module rl.ui.services.dialog {
	import test = rl.utilities.services.test;

	interface IModalMock {
		open: Sinon.SinonSpy;
	}

	describe('baseDialog', () => {
		var baseDialog: BaseDialogService;
		var $modal: IModalMock;

		beforeEach(() => {
			angular.mock.module(moduleName);

			$modal = {
				open: sinon.spy(),
			};

			test.angularFixture.mock({
				$modal: $modal,
			});

			var services: any = test.angularFixture.inject(baseDialogServiceName);
			baseDialog = services[baseDialogServiceName];
		});

		it('should call the closeHandler when the dialog closes', (): void => {
			let closeHandler: Sinon.SinonSpy = sinon.spy((): boolean => { return true; });
			baseDialog.open(null, closeHandler);

			baseDialog.modalClosing(null, null, true);

			sinon.assert.calledOnce(closeHandler);
			sinon.assert.calledWith(closeHandler, true);
		});

		it('should prevent the dialog from closing if the close handler returns false', (): void => {
			let closeHandler: Sinon.SinonSpy = sinon.spy((): boolean => { return false; });
			baseDialog.open(null, closeHandler);

			var event: any = {
				preventDefault: sinon.spy(),
			};

			baseDialog.modalClosing(event, null, false);

			sinon.assert.calledOnce(closeHandler);
			sinon.assert.calledOnce(event.preventDefault);
		});
	});
}
