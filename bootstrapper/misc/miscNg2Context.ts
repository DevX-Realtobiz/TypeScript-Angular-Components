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
		const subject: Subject<void> = new Subject<void>();
		setTimeout(() => subject.next(null), 1000);
		return subject;
	}

	toggle(): void {
		this.busy2.trigger(!this.busy2.loading);
	}
}