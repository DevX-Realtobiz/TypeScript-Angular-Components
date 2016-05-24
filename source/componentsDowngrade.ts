import { Provider, provide, ExceptionHandler, PipeTransform } from '@angular/core';
import { UpgradeAdapter } from '@angular/upgrade';

import * as angular from 'angular';

import { ButtonComponent } from './components/button/button.ng2';
import { ButtonLinkComponent } from './components/buttonLink/buttonLink.ng2';
import { ButtonSubmitComponent } from './components/buttonSubmit/buttonSubmit.ng2';
import { CheckboxComponent } from './components/checkbox/checkbox.ng2';
import { FormComponent } from './components/form/form.ng2';
import { TextboxComponent } from './components/textbox/textbox.ng2';

import { defaultThemeToken, defaultThemeValueName, DEFAULT_THEME_PROVIDER } from './components/componentsDefaultTheme';

export const buttonComponentName: string = 'rlButtonNg';
export const buttonLinkComponentName: string = 'rlButtonLinkNg';
export const buttonSubmitComponentName: string = 'rlButtonSubmitNg';
export const checkboxComponentName: string = 'rlCheckboxNg';
export const formComponentName: string = 'rlFormNg';
export const textboxComponentName: string = 'rlTextboxNg';

export const moduleName: string = 'rl.components.downgrade';

const componentsDowngradeModule = angular.module(moduleName, []);

export function downgradeComponentsToAngular1(upgradeAdapter: UpgradeAdapter) {
	upgradeAdapter.addProvider(DEFAULT_THEME_PROVIDER);

	componentsDowngradeModule.value(defaultThemeValueName, defaultThemeToken);

	componentsDowngradeModule.directive(buttonComponentName, <any>upgradeAdapter.downgradeNg2Component(ButtonComponent));
	componentsDowngradeModule.directive(buttonLinkComponentName, <any>upgradeAdapter.downgradeNg2Component(ButtonLinkComponent));
	componentsDowngradeModule.directive(buttonSubmitComponentName, <any>upgradeAdapter.downgradeNg2Component(ButtonSubmitComponent));
	componentsDowngradeModule.directive(checkboxComponentName, <any>upgradeAdapter.downgradeNg2Component(CheckboxComponent));
	componentsDowngradeModule.directive(formComponentName, <any>upgradeAdapter.downgradeNg2Component(FormComponent));
	componentsDowngradeModule.directive(textboxComponentName, <any>upgradeAdapter.downgradeNg2Component(TextboxComponent));
}
