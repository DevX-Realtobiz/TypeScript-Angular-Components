/// <reference path='../../../typings/chai/chai.d.ts' />
/// <reference path='../../../typings/mocha/mocha.d.ts' />
/// <reference path='../../../typings/sinon/sinon.d.ts' />
/// <reference path='../../../typings/angularMocks.d.ts' />
/// <reference path='../../../typings/chaiAssertions.d.ts' />
/// <reference path='../../../libraries/typescript-angular-utilities/typings/utility.d.ts' />

/// <reference path='commaList.ts' />

module rl.ui.components.commaList {
	import test = utilities.services.test;
	
	interface ITestObject {
		prop: string;
	}
	
	describe('CommaListController', () => {
		var scope: ng.IScope;
		var commaList: CommaListController;
	
		beforeEach(() => {
			angular.mock.module(moduleName);
		});
	
		it('shoult limit to 3 items on the scope', (): void => {
			buildController(['item1', 'item2', 'item3', 'item4', 'item5'], 3);
			expect(commaList.list).to.have.length(3);
			expect(commaList.remainingItems).to.equal(2);
			expect(commaList.list[0]).to.equal('item1');
			expect(commaList.list[1]).to.equal('item2');
			expect(commaList.list[2]).to.equal('item3');
		});
	
		it('should show all items if no max is provided', (): void => {
			buildController(['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7', 'item8', 'item9', 'item10'], null);
			expect(commaList.list).to.have.length(10);
		});
	
		it('should show none if 0 is specified as the max', (): void => {
			buildController(['item1', 'item2', 'item3', 'item4', 'item5'], 0);
			expect(commaList.list).to.have.length(0);
			expect(commaList.remainingItems).to.equal(5);
		});
	
		it('should transform the list items if a transform function is provided', (): void => {
			var transform: { (item: ITestObject): string } = (item: ITestObject): string => {
				return item.prop;
			};
			var list: ITestObject[] = [
				{ prop: 'item1' },
				{ prop: 'item2' },
				{ prop: 'item3' },
			];
	
			buildController(list, 3, transform);
	
			expect(commaList.list[0]).to.equal('item1');
			expect(commaList.list[1]).to.equal('item2');
			expect(commaList.list[2]).to.equal('item3');
		});
	
		function buildController(list: any[], max?: number, transform?: {(item: any): string}): void {
			var bindings: any = {
				inList: list,
				max: max,
				transform(object: ITransformParam): string {
					return transform(object.item);
				},
			};

			var $attrs: ICommaListAttrs = <any>{
				transform: '',
			};
	
			if (transform != null) {
				$attrs.transform = 'transform';
			}
	
			var controllerResult: test.IControllerResult<CommaListController>
				= test.angularFixture.controllerWithBindings<CommaListController>(controllerName, bindings, { $attrs: $attrs });
	
			scope = <ng.IScope>controllerResult.scope;
			commaList = controllerResult.controller;
		}
	});
}
