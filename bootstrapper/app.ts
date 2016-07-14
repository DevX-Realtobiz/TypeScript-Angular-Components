import 'jquery';
import 'bootstrap';
import * as angular from 'angular';
import 'angular-ui-router';

import { UpgradeAdapter } from '@angular/upgrade';

import { downgrade as utilitiesDowngrade } from 'typescript-angular-utilities';

import { moduleName as componentsModule } from '../source/ui.module';
import * as componentsDowngrade from '../source/componentsDowngrade';

import { moduleName as inputModuleName } from './inputs/inputBootstrapper';
import { moduleName as buttonModuleName } from './buttons/buttonBootstrapper';
import { moduleName as popupModuleName } from './popup/popupBootstrapper';
import { moduleName as messageLogModuleName } from './messageLog/messageLogBootstrapper';
import { moduleName as cardModuleName } from './cards/cardContainerBootstrapper';
import { moduleName as tabModuleName } from './tabs/tabsBootstrapper';
import { moduleName as multStepModuleName } from './msi/msiBootstrapper.ng1';
import { moduleName as formModuleName } from './forms/formsBootstrapper';
import { moduleName as miscModuleName } from './misc/miscBootstrapper';
import { moduleName as textModuleName } from './text/text';

import { TabsBootstrapper } from './tabs/tabsNg2Bootstrapper';
import { FormsBootstrapper } from './forms/formsNg2Bootstrapper';
import { MsiBootstrapperComponent } from './msi/msiBootstrapper.ng2';
import { CardsBootstrapper } from './cards/cardsNg2Bootstrapper';
import { PopupBootstrapper } from './popup/popupNg2Bootstrapper';
import { MiscNgContextBootstrapper } from './misc/miscNg2Context';

const upgradeAdapter: UpgradeAdapter = new UpgradeAdapter();
utilitiesDowngrade.downgradeUtilitiesToAngular1(upgradeAdapter);
componentsDowngrade.downgradeComponentsToAngular1(upgradeAdapter);

const bootstrapper: angular.IComponentOptions = {
	template: require('./app.html'),
}

const moduleName: string = 'bootstrapper-app';

angular.module(moduleName, [
	componentsModule,
	'ui.router',

	utilitiesDowngrade.moduleName,
	multStepModuleName,
	inputModuleName,
	buttonModuleName,
	popupModuleName,
	messageLogModuleName,
	cardModuleName,
	tabModuleName,
	formModuleName,
	miscModuleName,
	textModuleName,
])
	.component('tsBootstrapper', bootstrapper)
	.directive('tsFormsBootstrapper', <any>upgradeAdapter.downgradeNg2Component(FormsBootstrapper))
	.directive('tsTabsBootstrapper', <any>upgradeAdapter.downgradeNg2Component(TabsBootstrapper))
	.directive('tsMsiBootstrapper', <any>upgradeAdapter.downgradeNg2Component(MsiBootstrapperComponent))
	.directive('tsCardsBootstrapper', <any>upgradeAdapter.downgradeNg2Component(CardsBootstrapper))
	.directive('tsPopupBootstrapper', <any>upgradeAdapter.downgradeNg2Component(PopupBootstrapper))
	.directive('tsMiscNgContext', <any>upgradeAdapter.downgradeNg2Component(MiscNgContextBootstrapper))
	.config(BaseRoute);

BaseRoute.$inject = ['$urlRouterProvider', '$stateProvider'];
function BaseRoute($urlRouterProvider, $stateProvider) {
	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('/', {
			url: '/',
			template: '<h3>Welcome to typescript-angular-components</h3>',
		});
}

upgradeAdapter.bootstrap(document.body, [moduleName]);
