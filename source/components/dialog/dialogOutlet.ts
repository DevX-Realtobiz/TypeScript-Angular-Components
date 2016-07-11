import 'bootstrap';
import { Component, AfterViewInit, Inject } from '@angular/core';

import { DialogRootService } from './dialogRoot.service';
import { ButtonComponent, ButtonAsyncComponent } from '../buttons/index';
import { jqueryToken } from '../../services/jquery/jquery.provider';

@Component({
	selector: 'rlDialogOutlet',
	template: require('./dialogOutlet.html'),
	directives: [ButtonComponent, ButtonAsyncComponent],
})
export class DialogOutletComponent implements AfterViewInit {
	dialogRoot: DialogRootService;
	jquery: JQueryStatic;

	constructor(dialogRoot: DialogRootService
			, @Inject(jqueryToken) jquery: JQueryStatic) {
		this.dialogRoot = dialogRoot;
		this.jquery = jquery;
		dialogRoot.openDialog.subscribe((): void => {
			jquery('.rlModal').modal('show');
		});
		dialogRoot.closeDialog.subscribe((): void => {
			jquery('.rlModal').modal('hide');
		});
	}

	dismiss(): void {
		this.dialogRoot.dismissing = true;
		this.dialogRoot.closeDialog.next(null);
	}

	ngAfterViewInit(): void {
		this.jquery('.rlModal').on('hide.bs.modal', (event: JQueryEventObject) => {
			if (this.dialogRoot.dismissing) {
				this.dialogRoot.dismissing = false;
				return;
			}

			const canClose = this.dialogRoot.onClosing();
			if (!canClose) {
				event.preventDefault();
			}
		});
	}
}