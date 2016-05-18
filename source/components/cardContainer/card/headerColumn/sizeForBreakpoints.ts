'use strict';

import * as angular from 'angular';

import { services, downgrade } from 'typescript-angular-utilities';
import __string = services.string;

import { xs, sm, md, lg } from '../../../../services/breakpoints/breakpoint';
import { IBreakpointSize } from '../../column';

export var sizeForBreakpointsName: string = 'rlSizeForBreakpoints';

export interface ISizeForBreapointsAttrs extends angular.IAttributes {
	rlSizeForBreakpoints: string;
	styling: string;
}

sizeForBreakpoints.$inject = ['$parse', downgrade.stringServiceName];
export function sizeForBreakpoints($parse: angular.IParseService, stringUtility: __string.IStringUtility): angular.IDirective {
	'use strict';
	return {
		restrict: 'A',
		link: linkDirective
	};

	function linkDirective(scope: angular.IScope
		, element: angular.IAugmentedJQuery
		, attributes: ISizeForBreapointsAttrs): void {
		var sizes: IBreakpointSize = $parse(attributes.rlSizeForBreakpoints)(scope);
		var styling: string = $parse(attributes.styling)(scope);
		var classes: any[] = [];
		classes.push(getColumnClass(sizes, xs));
		classes.push(getColumnClass(sizes, sm));
		classes.push(getColumnClass(sizes, md));
		classes.push(getColumnClass(sizes, lg));

		element.addClass(classes.join(' '));
		if (styling != null) {
			element.addClass(styling);
		}

	}

	function getColumnClass(columnSizes: IBreakpointSize, attribute: string): string {
		var value: number | string = columnSizes[attribute];
		if (value > 0 && value !== 'hidden') {
			return stringUtility.substitute('col-{0}-{1}', attribute, <string>value);
		} else {
			return 'hidden-' + attribute;
		}
	}
}
