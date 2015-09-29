import * as angular from 'angular';
import { services } from 'typescript-angular-utilities';
import __string = services.string;
export declare var sizeForBreakpointsName: string;
export interface ISizeForBreapointsAttrs extends angular.IAttributes {
    sizeForBreakpoints: string;
}
export declare function sizeForBreakpoints($parse: angular.IParseService, stringUtility: __string.IStringUtilityService): angular.IDirective;
