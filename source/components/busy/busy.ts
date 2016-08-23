import { Component, Input } from '@angular/core';
import { isBoolean } from 'lodash';

import { DefaultTheme } from '../componentsDefaultTheme';
import { AsyncHelper, IWaitValue } from '../../services/async/async.service';

export { IWaitValue };

@Component({
	selector: 'rlBusy',
	template: require('./busy.html'),
})
export class BusyComponent {
	@Input() loading: boolean;
	@Input() size: string;

	useDefaultTheme: boolean;
	asyncHelper: AsyncHelper;

	constructor(defaultTheme: DefaultTheme
		, asyncHelper: AsyncHelper) {
		this.useDefaultTheme = defaultTheme.useDefaultTheme;
		this.asyncHelper = asyncHelper;
	}

	/*
	 * Public API for triggering the rlBusy to wait on a promise
	 */
	trigger(waitOn: IWaitValue<any>): void {
		if (waitOn == null) {
			return;
		}

		if (isBoolean(waitOn)) {
			this.loading = waitOn;
			return;
		}

		this.loading = true;
		this.asyncHelper.waitAsObservable(waitOn)
			.subscribe(null, () => this.loading = false, () => this.loading = false);
	}
}