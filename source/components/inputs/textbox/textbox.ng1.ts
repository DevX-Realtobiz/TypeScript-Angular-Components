import * as angular from 'angular';
import * as _ from 'lodash';

import { buildInput, moduleName as inputModule } from '../input.ng1';

export const moduleName: string = 'rl.ui.components.textbox';
export const componentName: string = 'rlTextbox';

const textbox: angular.IComponentOptions = buildInput({
	template: require('./textbox.ng1.html'),
	bindings: {
		maxlength: '<?',
	},
});

angular.module(moduleName, [inputModule])
	.component(componentName, textbox);
