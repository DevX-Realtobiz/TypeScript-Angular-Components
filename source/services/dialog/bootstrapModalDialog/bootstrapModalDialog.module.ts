'use strict';

import * as angular from 'angular';

import { services } from 'typescript-angular-utilities';
import __promise = services.promise;

import { controllerName, BootstrapModalDialogController } from './bootstrapModalDialog.controller';
import { serviceName, BootstrapModalDialogService } from './bootstrapModalDialog.service';

export * from './bootstrapModalDialog.controller';
export * from './bootstrapModalDialog.service';

export var moduleName: string = 'rl.ui.services.dialog.bootstrapModalDialog';

angular.module(moduleName, [__promise.moduleName])
	.controller(controllerName, BootstrapModalDialogController)
	.service(serviceName, BootstrapModalDialogService);
