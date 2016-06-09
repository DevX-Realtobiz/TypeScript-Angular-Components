import { Provider, provide, ExceptionHandler, PipeTransform } from '@angular/core';
import { UpgradeAdapter } from '@angular/upgrade';

import * as angular from 'angular';

import { services, downgrade } from 'typescript-angular-utilities';

import { BusyComponent } from './components/busy/busy';
import { ButtonComponent } from './components/button/button';
import { ButtonAsyncComponent } from './components/buttonAsync/buttonAsync';
import { ButtonLinkComponent } from './components/buttonLink/buttonLink';
import { ButtonSubmitComponent } from './components/buttonSubmit/buttonSubmit';
import { ButtonToggleComponent } from './components/buttonToggle/buttonToggle';
import { CheckboxComponent } from './components/checkbox/checkbox';
import { CommaListComponent } from './components/commaList/commaList.ng2';
import { FormComponent } from './components/form/form.ng2';
import { TextboxComponent } from './components/textbox/textbox.ng2';

import { DatePipe } from './filters/date/date.filter';

import { FormService } from './services/form/form.service.ng2';

import { defaultThemeToken, defaultThemeValueName, DEFAULT_THEME_PROVIDER } from './components/componentsDefaultTheme';

export const busyComponentName: string = 'rlBusyNg';
export const buttonComponentName: string = 'rlButtonNg';
export const buttonAsyncComponentName: string = 'rlButtonAsyncNg';
export const buttonLinkComponentName: string = 'rlButtonLinkNg';
export const buttonSubmitComponentName: string = 'rlButtonSubmitNg';
export const buttonToggleComponentName: string = 'rlButtonToggleNg';
export const checkboxComponentName: string = 'rlCheckboxNg';
export const commaListComponentName: string = 'rlCommaListNg';
export const formComponentName: string = 'rlFormNg';
export const textboxComponentName: string = 'rlTextboxNg';

export const moduleName: string = 'rl.components.downgrade';

const componentsDowngradeModule = angular.module(moduleName, []);

export function downgradeComponentsToAngular1(upgradeAdapter: UpgradeAdapter) {
	upgradeAdapter.addProvider(DEFAULT_THEME_PROVIDER);
	upgradeAdapter.addProvider(FormService);

	componentsDowngradeModule.value(defaultThemeValueName, defaultThemeToken);

	componentsDowngradeModule.filter('rlDate', downgrade.PipeDowngrader(new DatePipe(services.object.objectUtility)));

	componentsDowngradeModule.directive(busyComponentName, <any>upgradeAdapter.downgradeNg2Component(BusyComponent));
	componentsDowngradeModule.directive(buttonComponentName, <any>upgradeAdapter.downgradeNg2Component(ButtonComponent));
	componentsDowngradeModule.directive(buttonAsyncComponentName, <any>upgradeAdapter.downgradeNg2Component(ButtonAsyncComponent));
	componentsDowngradeModule.directive(buttonLinkComponentName, <any>upgradeAdapter.downgradeNg2Component(ButtonLinkComponent));
	componentsDowngradeModule.directive(buttonSubmitComponentName, <any>upgradeAdapter.downgradeNg2Component(ButtonSubmitComponent));
	componentsDowngradeModule.directive(buttonToggleComponentName, <any>upgradeAdapter.downgradeNg2Component(ButtonToggleComponent));
	componentsDowngradeModule.directive(checkboxComponentName, <any>upgradeAdapter.downgradeNg2Component(CheckboxComponent));
	componentsDowngradeModule.directive(commaListComponentName, <any>upgradeAdapter.downgradeNg2Component(CommaListComponent));
	componentsDowngradeModule.directive(formComponentName, <any>upgradeAdapter.downgradeNg2Component(FormComponent));
	componentsDowngradeModule.directive(textboxComponentName, <any>upgradeAdapter.downgradeNg2Component(TextboxComponent));
}
