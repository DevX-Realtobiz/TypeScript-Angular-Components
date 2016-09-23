import * as angular from 'angular';

import 'angular-ui-bootstrap';
import 'angular-sanitize';
import 'angular-animate';

import { downgrade as utilitiesDowngrade } from 'typescript-angular-utilities';
import * as componentsDowngrade from './componentsDowngrade';

import '../libraries/angular-bootstrap-slider/slider';

import * as behaviors from './behaviors/behaviors.module';
import * as components from './components/components.module';
import * as downgrade from './componentsDowngrade';
import * as pipes from './pipes/index';
import * as services from './services/services.module';
import * as types from './types/types.module';

export { behaviors, components, downgrade, pipes, services, types };

export var moduleName: string = 'rl.ui';

angular.module(moduleName, [
	'ui.bootstrap',
	'ui.bootstrap-slider',
	'ngSanitize',
	utilitiesDowngrade.moduleName,
	componentsDowngrade.moduleName,

	behaviors.moduleName,
	components.moduleName,
	downgrade.moduleName,
	services.moduleName,
]);
