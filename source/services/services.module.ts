'use strict';

import * as angular from 'angular';

import * as autosave from './autosave/autosave.service';
import * as autosaveAction from './autosaveAction/autosaveAction.service';
import * as autosaveDialog from './autosaveDialog/autosaveDialog.module';
import * as breakpoints from './breakpoints/breakpoints.module';
import * as componentValidator from './componentValidator/componentValidator.service';
import * as contentProvider from './contentProvider/contentProvider.service';
import * as dialog from './dialog/dialog.service';
import * as documentWrapper from './documentWrapper/documentWrapper.service';
import * as jquery from './jquery/jquery.service';
import * as templateLoader from './templateLoader/templateLoader.service';
import * as windowWrapper from './windowWrapper/windowWrapper.service';

export {
	autosave,
	autosaveAction,
	autosaveDialog,
	breakpoints,
	componentValidator,
	contentProvider,
	dialog,
	documentWrapper,
	jquery,
	templateLoader,
	windowWrapper,
};

export var moduleName: string = 'rl.ui.services';

angular.module(moduleName, [
	autosave.moduleName,
	autosaveAction.moduleName,
	autosaveDialog.moduleName,
	breakpoints.moduleName,
	componentValidator.moduleName,
	contentProvider.moduleName,
	dialog.moduleName,
	documentWrapper.moduleName,
	jquery.moduleName,
	templateLoader.moduleName,
	windowWrapper.moduleName,
]);
