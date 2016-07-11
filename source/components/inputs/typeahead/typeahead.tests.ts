import { services } from 'typescript-angular-utilities';
import __test = services.test;
import mock = __test.mock;
import fakeAsync = __test.fakeAsync;
import flushMicrotasks = __test.flushMicrotasks;

import { TypeaheadComponent } from './typeahead';

interface ITransformMock {
	getValue: Sinon.SinonSpy;
}

interface ITestOption {
	value: string;
}

interface IBusyMock {
	trigger: Sinon.SinonSpy;
}

describe('TypeaheadComponent', () => {
	let typeahead: TypeaheadComponent;
	let setValue: Sinon.SinonSpy;
	let busy: IBusyMock;

	beforeEach(() => {
		const validator: any = {
			validate: sinon.spy(),
			afterInit: sinon.spy(),
		};

		typeahead = new TypeaheadComponent<ITestOption>(null, null, validator, null, null, null);

		setValue = sinon.spy();
		typeahead.setValue = setValue;

		busy = { trigger: sinon.spy() };
		typeahead.busy = <any>busy;
	});

	it('should collapse on init if allowCollapse is specified and a model value is present', (): void => {
		typeahead.allowCollapse = true;
		typeahead.ngModel.$viewValue = 'Item';
		typeahead.ngOnInit();

		expect(typeahead.collapsed).to.be.true;
	});

	describe('loadItems', (): void => {
		let items: string[];

		beforeEach((): void => {
			items = ['Item 1', 'Item 2', 'Another item', 'A fourth item'];
		});

		it('should return an empty list if no text is entered', fakeAsync((): void => {
			let getItemsMock: __test.IMockedRequest<string> = mock.request(items);
			typeahead.getItems = getItemsMock;

			typeahead.refresh('');

			sinon.assert.notCalled(getItemsMock);
			expect(typeahead.visibleItems).to.be.empty;

			getItemsMock.flush();
		}));

		it('should return the result of the getItems function if useClientSearching is off', fakeAsync((): void => {
			// simulate a server-side search
			let getItemsMock: __test.IMockedRequest<string[]> = mock.request([[items[0], items[1]]]);
			typeahead.getItems = getItemsMock;

			typeahead.refresh('Item ');

			sinon.assert.calledOnce(getItemsMock);
			let searchArg: string = getItemsMock.firstCall.args[0];
			expect(searchArg).to.equal('Item ');

			getItemsMock.flush();

			expect(typeahead.visibleItems.length).to.equal(2);
			expect(typeahead.visibleItems[0]).to.equal(items[0]);
			expect(typeahead.visibleItems[1]).to.equal(items[1]);
		}));

		it('should apply the search string if useClientSearching is on', fakeAsync((): void => {
			typeahead.useClientSearching = true;

			let getItemsMock: __test.IMockedRequest<string[]> = mock.request(items);
			typeahead.getItems = getItemsMock;

			typeahead.refresh('A');

			sinon.assert.calledOnce(getItemsMock);
			expect(getItemsMock.firstCall.args).to.be.empty;

			getItemsMock.flush();

			expect(typeahead.visibleItems.length).to.equal(2);
			expect(typeahead.visibleItems[0]).to.equal(items[2]);
			expect(typeahead.visibleItems[1]).to.equal(items[3]);
		}));

		it('should cache the results of the parent getItems function and apply searches aganst the cached data if useClientSearching is on'
			, fakeAsync((): void => {
				typeahead.useClientSearching = true;

				let getItemsMock: __test.IMockedRequest<string> = mock.request(items);
				typeahead.getItems = getItemsMock;
				typeahead.refresh('A');
				getItemsMock.flush();

				getItemsMock.reset();

				typeahead.refresh('2');

				flushMicrotasks();

				sinon.assert.notCalled(getItemsMock);

				expect(typeahead.visibleItems.length).to.equal(1);
				expect(typeahead.visibleItems[0]).to.equal(items[1]);
			}));

		it('should add a special search option to the list if a create handler is provided and no match is found', fakeAsync((): void => {
			let createSpy: Sinon.SinonSpy = sinon.spy();
			typeahead.useClientSearching = true;
			typeahead.create = createSpy;

			let getItemsMock: __test.IMockedRequest<string> = mock.request(items);
			typeahead.getItems = getItemsMock;

			typeahead.refresh('A');

			getItemsMock.flush();

			expect(typeahead.visibleItems.length).to.equal(3);
			expect(typeahead.visibleItems[0].__isSearchOption).to.be.true;
			expect(typeahead.visibleItems[1]).to.equal(items[2]);
			expect(typeahead.visibleItems[2]).to.equal(items[3]);
		}));
	});

	describe('external API', (): void => {
		it('should add the specified item to the cached item list', fakeAsync((): void => {
			typeahead.useClientSearching = true;

			let items: string[] = [];
			let getItemsMock: __test.IMockedRequest<string> = mock.request(items);
			typeahead.getItems = getItemsMock;
			typeahead.refresh('A');
			getItemsMock.flush();

			let newItem: string = 'New item';

			typeahead.add(newItem);

			expect(items.length).to.equal(1);
			expect(items[0]).to.equal(newItem);
		}));

		it('should remove the specified item from the cached items list', fakeAsync((): void => {
			typeahead.useClientSearching = true;

			let items: string[] = ['Item 1'];
			let getItemsMock: __test.IMockedRequest<string> = mock.request(items);
			typeahead.getItems = getItemsMock;
			typeahead.refresh('I');
			getItemsMock.flush();

			typeahead.remove(items[0]);

			expect(items).to.be.empty;
		}));
	});

	describe('select', (): void => {
		let items: string[];

		beforeEach((): void => {
			items = ['Item 1', 'Item 2', 'Another item', 'A fourth item'];
		});

		it('should collapse if no select handler is specified', fakeAsync((): void => {
			typeahead.useClientSearching = true;
			initialLoad();

			typeahead.selection = items[0];

			expect(typeahead.selection).to.equal(items[0]);
			expect(typeahead.collapsed).to.be.true;
		}));

		it('should collapse if a select handler is provided and allowCollapse is turned on', fakeAsync((): void => {
			let selectSpy: Sinon.SinonSpy = sinon.spy();
			typeahead.useClientSearching = true;
			typeahead.allowCollapse = true;
			typeahead.select = selectSpy;
			initialLoad();

			typeahead.selection = items[0];

			expect(typeahead.selection).to.equal(items[0]);
			expect(typeahead.collapsed).to.be.true;

			sinon.assert.calledOnce(selectSpy);
			expect(selectSpy.firstCall.args[0].value).to.equal(items[0]);
		}));

		it('should call the select function without collapsing', fakeAsync((): void => {
			let selectSpy: Sinon.SinonSpy = sinon.spy();
			typeahead.useClientSearching = true;
			typeahead.select = selectSpy;
			initialLoad();

			typeahead.selection = items[0];

			expect(typeahead.selection).to.not.exist;
			expect(typeahead.collapsed).to.be.false;

			sinon.assert.calledOnce(selectSpy);
			expect(selectSpy.firstCall.args[0].value).to.equal(items[0]);
		}));

		it('should call create with the search text if the search option is selected', fakeAsync((): void => {
			let createSpy: Sinon.SinonSpy = sinon.spy(search => { return { value: search }; });
			typeahead.useClientSearching = true;
			typeahead.create = createSpy;
			initialLoad();

			typeahead._searchOption.text = 'search';
			typeahead.selection = typeahead._searchOption;

			sinon.assert.calledOnce(createSpy);
			expect(createSpy.firstCall.args[0].value).to.equal('search');

			expect(typeahead.selection.value).to.equal('search');
			expect(typeahead.collapsed).to.be.true;
		}));

		function initialLoad() {
			let getItemsMock: __test.IMockedRequest<string> = mock.request(items);
			typeahead.getItems = getItemsMock;

			typeahead.refresh('A');
			getItemsMock.flush();
		}
	});
});
