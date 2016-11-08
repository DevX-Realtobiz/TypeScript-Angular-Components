import { Component, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { BusyComponent } from '../../source/components/busy/busy';

@Component({
	selector: 'tsMiscNgContext',
	template: require('./miscNg2Context.html'),
})
export class MiscNgContextBootstrapper {
	@ViewChild('busy2') busy2: BusyComponent;
	width: number = 100;
	value: number = 0;

	wait(): Observable<void> {
		return Observable.of(null).delay(1000);
	}

	toggle(): void {
		this.busy2.waitOn(!this.busy2.loading);
	}
}
