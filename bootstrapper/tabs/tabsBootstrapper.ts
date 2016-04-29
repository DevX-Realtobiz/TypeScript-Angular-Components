import * as angular from 'angular';

import { IStep } from '../../source/components/multiStepIndicator/multiStepIndicator';

export const moduleName: string = 'TabTestModule';

class TabTestController {
	steps: IStep[];

	$onInit(): void {
		this.steps = [
			{
				title: 'Step 1',
				subtitle: 'Do something',
				onClick: (): void => console.log('Visited step 1'),
			},
			{
				title: 'Step 2',
				subtitle: 'Do more work',
				onClick: (): void => console.log('Visited step 2'),
			},
		];
	}
}

angular.module(moduleName, [])
	.controller('TabTestController', TabTestController);