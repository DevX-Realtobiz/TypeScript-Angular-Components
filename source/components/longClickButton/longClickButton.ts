// /// <reference path='../../../typings/commonjs.d.ts' />

'use strict';

import * as angular from 'angular';
import * as $ from 'jquery';

import { services } from 'typescript-angular-utilities';
import __promise = services.promise;

export var moduleName: string = 'rl.ui.components.longClickButton';
export var directiveName: string = 'rlLongClickButton';
export var controllerName: string = 'LongClickButtonController';

import __object = services.object;

export class LongClickButtonController {
	// bindings
	action: {(): angular.IPromise<any> | void};
	text: string;
	onShortClickText: string;
	type: string;
	icon: string;
	spinner: boolean;
	rightAligned: boolean;

	private interval: number = 25;
	duration: number = 1500;
	buttonText: string;
	buttonClass: string;
	width: number;
	active: boolean;
	actionProgress: number;
	private actionInterval: angular.IPromise<void>;

	static $inject: string[] = ['$scope', '$interval', '$timeout', __object.serviceName, __promise.serviceName];
	constructor($scope: angular.IScope
			, private $interval: angular.IIntervalService
			, private $timeout: angular.ITimeoutService
			, private objectUtility: __object.IObjectUtility
			, private promise: __promise.IPromiseUtility) {
		this.buttonText = this.text;
		if (this.type != null) {
			this.buttonClass = this.type;
		} else {
			this.buttonClass = 'default';
		}

		$scope.$watch((): string => { return this.buttonText; }, (): void => {
			$timeout((): void => {
				this.width = $('#actionButton').outerWidth();
			});
		});
	}

	startAction(): void {
		if (this.active || this.spinner) {
			return;
		}

		this.actionProgress = 0;
		this.active = true;

		this.actionInterval = this.$interval((): void => {
			this.actionProgress += this.interval;
			if (this.actionProgress >= this.duration) {
				this.cleanup();
				this.buttonText = this.text;
				this.trigger();
			}
		}, this.interval);
	}

	stopAction(): void {
		if (this.active) {
			if (this.actionProgress < this.duration) {
				this.warn();
			}

			this.cleanup();
		}
	}

	private cleanup(): void {
		this.$interval.cancel(this.actionInterval);
		this.actionProgress = 0;
		this.active = false;
	}

	private warn(): void {
		if (this.objectUtility.isNullOrEmpty(this.onShortClickText) === false) {
			this.buttonText = this.onShortClickText;
		}
	}

	private trigger(): void {
		if (!this.spinner) {
			this.spinner = true;

			var result: angular.IPromise<any> = <angular.IPromise<any>>this.action();
			if (this.promise.isPromise(result) && _.isFunction(result.finally)) {
				result.finally((): void => {
					this.spinner = false;
				});
			}
		}
	}
}

function longClickButton(): angular.IDirective {
	'use strict';
	return {
		restrict: 'E',
		template: require('./longClickButton.html'),
		controller: controllerName,
		controllerAs: 'button',
		scope: {},
		bindToController: {
			action: '&',
			text: '@',
			onShortClickText: '@',
			icon: '@',
			spinner: '=',
			rightAligned: '=',
			type: '@',
		},
	};
}

angular.module(moduleName, [__object.moduleName])
	.directive(directiveName, longClickButton)
	.controller(controllerName, LongClickButtonController);
