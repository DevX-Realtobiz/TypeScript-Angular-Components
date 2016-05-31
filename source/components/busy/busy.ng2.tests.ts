import { Subject } from 'rxjs';

import { services } from 'typescript-angular-utilities';
import IMockedPromise = services.test.IMockedPromise;
import mock = services.test.mock;

import { BusyComponent } from './busy.ng2';

describe('busy', () => {
	let busy: BusyComponent;

	beforeEach(() => {
		busy = new BusyComponent(true);
	});

	it('should show the spinner after triggering if true', (): void => {
		busy.trigger(true);
		expect(busy.loading).to.be.true;
	});

	it('should hide the spinner after triggering if false', (): void => {
		busy.loading = true;
		busy.trigger(false);
		expect(busy.loading).to.be.false;
	});

	describe('with promise', (): void => {
		let mockPromise: IMockedPromise<any>;

		beforeEach((): void => {
			mockPromise = mock.promise();

			busy.trigger(mockPromise());

			expect(busy.loading).to.be.true;
		});

		it('should finish after promise completes', (): void => {
			mockPromise.flush(); // .then

			expect(busy.loading).to.be.false;
		});

		it('should finish after promise fails', (): void => {
			mockPromise.reject();
			mockPromise.flush(); // .then

			expect(busy.loading).to.be.false;
		});
	});

	describe('with observable', (): void => {
		let stream: Subject<void>;

		beforeEach((): void => {
			stream = new Subject<void>();

			busy.trigger(stream);

			expect(busy.loading).to.be.true;
		});

		it('should finish after an event is received', (): void => {
			stream.next(null);

			expect(busy.loading).to.be.false;
		});
	});
});
