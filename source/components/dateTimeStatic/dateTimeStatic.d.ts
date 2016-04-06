export declare let moduleName: string;
export declare let componentName: string;
export declare let controllerName: string;
import { services } from 'typescript-angular-utilities';
import __date = services.date;
export interface IDateTimeStaticBindings {
    dateValue: moment.Moment;
    includeTime: boolean;
    displayTimeZone: boolean;
}
export interface IDateTimeStaticController extends IDateTimeStaticBindings {
    displayValue: string;
}
export declare class DateTimeStaticController implements IDateTimeStaticController {
    private dateUtility;
    dateValue: moment.Moment;
    includeTime: boolean;
    displayValue: string;
    displayTimeZone: boolean;
    timezone: string;
    static $inject: string[];
    constructor(dateUtility: __date.IDateUtility);
}
