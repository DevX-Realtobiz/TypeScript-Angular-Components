// /// <reference path='../../../typings/node/node.d.ts' />
// /// <reference path='../../../typings/jquery/jquery.d.ts' />

'use strict';

import * as angular from 'angular';

export let moduleName: string = 'rl.ui.components.dialog';
export let directiveName: string = 'rlDialog';
export let controllerName: string = 'DialogController';

export interface IDialogBindings {
	autosave: boolean;
}

export class DialogController implements IDialogBindings {
	autosave: boolean;
	hasFooter: boolean;
}

let defaultAutosaveFooter: string = '<rl-autosave-dialog-footer></rl-autosave-dialog-footer>';

dialog.$inject = ['$compile'];
function dialog($compile: angular.ICompileService): angular.IDirective {
	'use strict';
	return {
		restrict: 'E',
		transclude: true,
		template: require('./dialog.html'),
		controller: controllerName,
		controllerAs: 'dialog',
		scope: {},
		bindToController: {
			autosave: '=',
		},
		link(scope: angular.IScope
			, element: angular.IAugmentedJQuery
			, attrs: angular.IAttributes
			, controller: DialogController
			, transclude: angular.ITranscludeFunction): void {
			transclude((clone: JQuery, dialogScope: angular.IScope): void => {
				let header: JQuery = clone.filter('rl-dialog-header');
				let content: JQuery = clone.filter('rl-dialog-content');
				let footer: JQuery = clone.filter('rl-dialog-footer');

				let headerArea: JQuery = element.find('.header-template');
				headerArea.append(header);

				let contentArea: JQuery = element.find('.content-template');
				contentArea.append(content);

				controller.hasFooter = (footer.length > 0);
				if (!controller.hasFooter && controller.autosave) {
					footer = $compile(defaultAutosaveFooter)(dialogScope);
					controller.hasFooter = true;
				}

				if (controller.hasFooter) {
					let footerArea: JQuery = element.find('.footer-template');
					footerArea.append(footer);
				}
			});
		},
	};
}

angular.module(moduleName, [])
	.directive(directiveName, dialog)
	.controller(controllerName, DialogController);
