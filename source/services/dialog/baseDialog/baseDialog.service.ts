'use strict';

import * as ng from 'angular';
import * as _ from 'lodash';

import { IDialogCloseHandler, IDialogService, IDialogImplementation } from '../dialog.service';
import { controllerName, IBaseDialogScope } from './baseDialog.controller';

export var serviceName: string = 'baseDialog';

export interface IBaseDialogService extends IDialogService<ng.ui.bootstrap.IModalSettings> { }

export class BaseDialogService implements IDialogImplementation<ng.ui.bootstrap.IModalSettings> {
	closeHandler: IDialogCloseHandler;

	static $inject: string[] = ['$modal', '$rootScope'];
	constructor(private $modal: ng.ui.bootstrap.IModalService
			, private $rootScope: ng.IRootScopeService) { }

	open(options: ng.ui.bootstrap.IModalSettings, closeHandler?: IDialogCloseHandler): void {
		this.closeHandler = closeHandler;
		options = this.configureModalSettings(options);
		this.$modal.open(options);
	}

	modalClosing: { (event: ng.IAngularEvent, reason: any, explicitlyClosed: boolean): void }
		= (event: ng.IAngularEvent, reason: any, explicitlyClosed: boolean): void => {
		let canClose: boolean = true;

		if (_.isFunction(this.closeHandler)) {
			canClose = this.closeHandler(explicitlyClosed);
		}

		if (!canClose) {
			event.preventDefault();
		}
	}

	private configureModalSettings(options: ng.ui.bootstrap.IModalSettings): ng.ui.bootstrap.IModalSettings {
		if (options == null) {
			options = <any>{};
		}

		let modalScope: IBaseDialogScope = <IBaseDialogScope>options.scope;

		if (modalScope == null) {
			modalScope = <IBaseDialogScope>this.$rootScope.$new();
		}

		modalScope.modalController = options.controller;
		options.controller = controllerName;
		options.scope = modalScope;
		return options;
	}
}
