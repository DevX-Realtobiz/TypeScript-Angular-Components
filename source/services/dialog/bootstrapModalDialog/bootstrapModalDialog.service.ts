'use strict';

import * as ng from 'angular';
import * as _ from 'lodash';

import { services } from 'typescript-angular-utilities';
import __promise = services.promise;

import { IDialogCloseHandler, IDialogService, IDialogImplementation, IDialogInstance, IPromptSettings } from '../dialog.service';
import { controllerName, IBootstrapModalDialogScope } from './bootstrapModalDialog.controller';

export var serviceName: string = 'uiBootstrapModelDialog';

export interface IBootstrapModalDialogService extends IDialogService<IBootstrapModalDialogSettings> { }

export interface IBootstrapModalDialogSettings extends ng.ui.bootstrap.IModalSettings {
	resolveToDialog?: boolean;
	dialogAs?: string;
}

export interface IPromptScope extends ng.IScope {
	promptOptions: IPromptSettings;
}

export class BootstrapModalDialogService implements IDialogImplementation<IBootstrapModalDialogSettings> {
	closeHandler: IDialogCloseHandler;

	static $inject: string[] = ['$uibModal', '$rootScope', __promise.serviceName];
	constructor(private $modal: ng.ui.bootstrap.IModalService
			, private $rootScope: ng.IRootScopeService
			, private promise: __promise.IPromiseUtility) { }

	open(options: IBootstrapModalDialogSettings, closeHandler?: IDialogCloseHandler): IDialogInstance {
		if (options == null) {
			options = <any>{};
		}

		let dialogInstance: IDialogInstance = {
			close(): void {},
			dismiss(): void {},
		};

		this.promise.resolvePromises(options.resolve).then((results: any): void => {
			this.closeHandler = closeHandler;
			options = this.configureModalSettings(options, results);
			let modalInstance: ng.ui.bootstrap.IModalServiceInstance = this.$modal.open(options);
			dialogInstance.close = modalInstance.close;
			dialogInstance.dismiss = modalInstance.dismiss;
		});

		return dialogInstance;
	}

	prompt(options: IPromptSettings, template: string): IDialogInstance {
		let acceptHandler: { (): void } = options.acceptHandler;
		options.acceptHandler = null;
		this.closeHandler = (): boolean => {
			acceptHandler();
			return true;
		};

		let modalScope: IPromptScope = <IPromptScope>this.$rootScope.$new();
		modalScope.promptOptions = options;

		let settings: IBootstrapModalDialogSettings = {
			scope: modalScope,
			template: template,
			controller: controllerName,
		};

		let modalInstance: ng.ui.bootstrap.IModalServiceInstance = this.$modal.open(options);

		return {
			close: modalInstance.close,
			dismiss: modalInstance.dismiss,
		};
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

	private configureModalSettings(options: IBootstrapModalDialogSettings, resolveData: any): IBootstrapModalDialogSettings {
		let modalScope: IBootstrapModalDialogScope = <IBootstrapModalDialogScope>options.scope;

		if (modalScope == null) {
			modalScope = <IBootstrapModalDialogScope>this.$rootScope.$new();
		}

		if (options.resolveToDialog) {
			if (options.dialogAs != null) {
				modalScope[options.dialogAs] = resolveData;
			}
			else {
				modalScope = <IBootstrapModalDialogScope>_.extend(modalScope, resolveData);
			}
		} else {
			modalScope.resolveData = resolveData;
		}

		modalScope.modalController = options.controller;
		options.resolve = null;
		options.controller = controllerName;
		options.scope = modalScope;
		return options;
	}
}
