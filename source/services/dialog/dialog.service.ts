// /// <reference path='../../../typings/angularjs/angular.d.ts' />
// /// <reference path='../../../typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts' />

/// <reference path='baseDialogImplementation.service.ts' />

module rl.ui.services.dialog {
	'use strict';

	export var moduleName: string = 'rl.ui.services.dialog';
	export var serviceName: string = 'dialog';

	export interface IDialogImplementation<TDialogSettings> {
		open(options: TDialogSettings): void;
	}

	export interface IDialogService<TDialogSettings> {
		open(options: TDialogSettings): void;
	}

	export class DialogService<TDialogSettings> implements IDialogService<TDialogSettings> {
		constructor(private dialog: IDialogImplementation<TDialogSettings>) { }

		open(options: TDialogSettings): void {
			this.dialog.open(options);
		}
	}

	export interface IDialogServiceProvider<TDialogSettings> extends ng.IServiceProvider {
		setImplementation(dialogImplementation: IDialogImplementation<TDialogSettings>): void;
		$get(): IDialogService<TDialogSettings>;
	}

	dialogServiceProvider.$inject = [baseDialogServiceName];
	export function dialogServiceProvider<TDialogSettings>(baseDialog: BaseDialogService): IDialogServiceProvider<TDialogSettings> {
		'use strict';

		return {
			dialogImplementation: baseDialog,
			setImplementation: (dialogImplementation: IDialogImplementation<TDialogSettings>): void => {
				this.dialogImplementation = dialogImplementation;
			},
			$get: (): IDialogImplementation<TDialogSettings> => {
				return new DialogService<TDialogSettings>(this.dialogImplementation);
			},
		};
	}

	angular.module(moduleName, [])
		.service(baseDialogServiceName, BaseDialogService)
		.provider(serviceName, dialogServiceProvider);
}
