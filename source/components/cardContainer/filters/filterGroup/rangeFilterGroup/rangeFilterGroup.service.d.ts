import { services } from 'typescript-angular-utilities';
import __object = services.object;
import { IFilterOption, IFilterGroup } from '../filterGroup.service';
export declare var moduleName: string;
export declare var factoryName: string;
export interface IRangeFilterGroupSettings<TItemType> {
    label: string;
    type: string;
    getValue: {
        (item: TItemType): number;
    } | string;
    options: IRangeFilterOptionSettings[];
}
export interface IRangeFilterOptionSettings {
    label: string;
    highInclusive?: number;
    highExclusive?: number;
    lowInclusive?: number;
    lowExclusive?: number;
}
export interface IRangeFilterOption extends IFilterOption {
    highInclusive?: number;
    highExclusive?: number;
    lowInclusive?: number;
    lowExclusive?: number;
}
export interface IRangeFilterGroup extends IFilterGroup {
    options: IRangeFilterOption[];
    serialize(): IRangeFilterValue;
}
export interface IRangeFilterValue {
    highInclusive?: number;
    highExclusive?: number;
    lowInclusive?: number;
    lowExclusive?: number;
}
export interface IRangeFilterGroupFactory {
    getInstance<TItemType>(settings: IRangeFilterGroupSettings<TItemType>): IRangeFilterGroup;
}
export declare function rangeFilterGroupFactory(object: __object.IObjectUtility): IRangeFilterGroupFactory;
