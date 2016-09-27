import { PipeTransform, Injector } from '@angular/core';
import { UpgradeAdapter } from '@angular/upgrade';

import * as angular from 'angular';

import { services, downgrade } from 'typescript-angular-utilities';

import { AbsoluteTimeComponent } from './components/inputs/absoluteTime/absoluteTime';
import { BusyComponent } from './components/busy/busy';
import {
	ButtonComponent,
	ButtonAsyncComponent,
	ButtonLinkComponent,
	ButtonLongClickComponent,
	ButtonSubmitComponent,
	ButtonToggleComponent,
} from './components/buttons/index';
import { CheckboxComponent, TextboxComponent } from './components/inputs/index';
import { CommaListComponent } from './components/commaList/commaList';
import { DialogOutletComponent } from './components/dialog/dialogOutlet';
import { FormComponent } from './components/form/form';
import { StringWithWatermarkComponent } from './components/stringWithWatermark/stringWithWatermark';

import { ColumnSearchFilter } from './components/cardContainer/filters/columnSearchFilter/columnSearchFilter.service';
import { DataPager } from './components/cardContainer/paging/index';
import { Sorter } from './components/cardContainer/sorts/sorter/sorter.service';

import { IsEmptyPipe } from './pipes/isEmpty/isEmpty.pipe';
import { TruncatePipe } from './pipes/truncate/truncate.pipe';
import { DatePipe } from './pipes/date/date.pipe';
import { LocalizeStringDatesPipe } from './pipes/localizeStringDates/localizeStringDates.pipe';

import { AutosaveActionService } from './services/autosaveAction/autosaveAction.service';
import { DocumentService } from './services/documentWrapper/documentWrapper.service';
import { WindowService } from './services/windowWrapper/windowWrapper.service';

import { BreakpointService, VisibleBreakpointService, visibleBreakpointServiceName } from './services/breakpoints/index';

import { DefaultTheme, defaultThemeValueName } from './components/componentsDefaultTheme';

export { visibleBreakpointServiceName };

export const moduleName: string = 'rl.components.downgrade';

export const autosaveActionServiceName: string = 'autosaveAction';
export const cardContainerBuilderServiceName: string = 'rlCardContainerBuilder';
export const dataPagerFactoryName: string = 'rlDataPagerFactory';
export const documentServiceName: string = 'documentWrapper';
export const columnSearchFilterName: string = 'columnSearchFilter';
export const sorterServiceName: string = 'rlSorterService';
export const windowServiceName: string = 'windowWrapper';
export const uiRouterServiceName: string = '$state';

const componentsDowngradeModule = angular.module(moduleName, []);

export function PipeDowngrader(pipe: PipeTransform) {
	// factory that returns a filter
	return () => (value: any, ...args: any[]): any => {
		return pipe.transform(value, ...args);
	};
}

export function downgradeComponentsToAngular1(upgradeAdapter: UpgradeAdapter) {
	upgradeAdapter.upgradeNg1Provider(uiRouterServiceName);

	componentsDowngradeModule.value(defaultThemeValueName, upgradeAdapter.downgradeNg2Provider('defaultThemeNg1'));

	componentsDowngradeModule.filter('isEmpty', PipeDowngrader(new IsEmptyPipe(services.object.objectUtility)));
	componentsDowngradeModule.filter('truncate', PipeDowngrader(new TruncatePipe(services.object.objectUtility)));
	componentsDowngradeModule.filter('rlDate', PipeDowngrader(new DatePipe(services.object.objectUtility)));
	componentsDowngradeModule.filter('rlLocalizeStringDates', PipeDowngrader(new LocalizeStringDatesPipe(<any>services.timezone.timezoneService)));

	componentsDowngradeModule.directive('rlAbsoluteTime', <any>upgradeAdapter.downgradeNg2Component(AbsoluteTimeComponent));
	componentsDowngradeModule.directive('rlBusyNg', <any>upgradeAdapter.downgradeNg2Component(BusyComponent));
	componentsDowngradeModule.directive('rlButtonNg', <any>upgradeAdapter.downgradeNg2Component(ButtonComponent));
	componentsDowngradeModule.directive('rlButtonAsyncNg', <any>upgradeAdapter.downgradeNg2Component(ButtonAsyncComponent));
	componentsDowngradeModule.directive('rlButtonLinkNg', <any>upgradeAdapter.downgradeNg2Component(ButtonLinkComponent));
	componentsDowngradeModule.directive('rlButtonLongClickNg', <any>upgradeAdapter.downgradeNg2Component(ButtonLongClickComponent));
	componentsDowngradeModule.directive('rlButtonSubmitNg', <any>upgradeAdapter.downgradeNg2Component(ButtonSubmitComponent));
	componentsDowngradeModule.directive('rlButtonToggleNg', <any>upgradeAdapter.downgradeNg2Component(ButtonToggleComponent));
	componentsDowngradeModule.directive('rlCheckboxNg', <any>upgradeAdapter.downgradeNg2Component(CheckboxComponent));
	componentsDowngradeModule.directive('rlCommaListNg', <any>upgradeAdapter.downgradeNg2Component(CommaListComponent));
	componentsDowngradeModule.directive('rlDialogOutlet', <any>upgradeAdapter.downgradeNg2Component(DialogOutletComponent));
	componentsDowngradeModule.directive('rlFormNg', <any>upgradeAdapter.downgradeNg2Component(FormComponent));
	componentsDowngradeModule.directive('rlTextboxNg', <any>upgradeAdapter.downgradeNg2Component(TextboxComponent));
	componentsDowngradeModule.directive('rlStringWithWatermarkNg', <any>upgradeAdapter.downgradeNg2Component(StringWithWatermarkComponent));

	componentsDowngradeModule.factory(autosaveActionServiceName, upgradeAdapter.downgradeNg2Provider(AutosaveActionService));
	componentsDowngradeModule.factory(cardContainerBuilderServiceName, upgradeAdapter.downgradeNg2Provider(cardContainerBuilderServiceName));
	componentsDowngradeModule.factory(dataPagerFactoryName, upgradeAdapter.downgradeNg2Provider(DataPager));
	componentsDowngradeModule.factory(columnSearchFilterName, upgradeAdapter.downgradeNg2Provider(ColumnSearchFilter));
	componentsDowngradeModule.factory(sorterServiceName, upgradeAdapter.downgradeNg2Provider(Sorter));
	componentsDowngradeModule.factory(documentServiceName, upgradeAdapter.downgradeNg2Provider(DocumentService));
	componentsDowngradeModule.factory(visibleBreakpointServiceName, upgradeAdapter.downgradeNg2Provider(VisibleBreakpointService));
	componentsDowngradeModule.factory(windowServiceName, upgradeAdapter.downgradeNg2Provider(WindowService));
}
