import { services } from 'typescript-angular-utilities';
import __test = services.test;
import mock = __test.mock;
import fakeAsync = __test.fakeAsync;
import flushMicrotasks = __test.flushMicrotasks;
import __object = services.object;
import __array = services.array;
import __guid = services.guid;
import __search = services.search;
import __transform = services.transform;

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
	let typeahead: TypeaheadComponent<any>;
	let setValue: Sinon.SinonSpy;
	let busy: IBusyMock;

	beforeEach(() => {
		const validator: any = {
			setValidators: sinon.spy(),
			validate: sinon.spy(),
			afterInit: sinon.spy(),
		};

		typeahead = new TypeaheadComponent<any>(__transform.transform, null, validator, __object.objectUtility, __array.arrayUtility, __guid.guid, __search.searchUtility);

		setValue = sinon.spy();
		typeahead.setValue = setValue;

		busy = { trigger: sinon.spy() };
		typeahead.busy = <any>busy;
	});

	it('should collapse on init if allowCollapse is specified and a model value is present', (): void => {
		typeahead.allowCollapse = true;
		typeahead.value = 'Item';
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

			let visibleItems: string[];
			typeahead.refresh('').subscribe(result => visibleItems = result);

			sinon.assert.notCalled(getItemsMock);
			expect(visibleItems).to.be.empty;

			getItemsMock.flush();
		}));

		it('should return the result of the getItems function if useClientSearching is off', fakeAsync((): void => {
			// simulate a server-side search
			let getItemsMock: __test.IMockedRequest<string[]> = mock.request([items[0], items[1]]);
			typeahead.getItems = getItemsMock;

			let visibleItems: string[];
			typeahead.refresh('Item ').subscribe(result => visibleItems = result);

			sinon.assert.calledOnce(getItemsMock);
			sinon.assert.calledWith(getItemsMock, 'Item ');

			getItemsMock.flush();

			expect(visibleItems.length).to.equal(2);
			expect(visibleItems[0]).to.equal(items[0]);
			expect(visibleItems[1]).to.equal(items[1]);
		}));

		it('should apply the search string if useClientSearching is on', fakeAsync((): void => {
			typeahead.clientSearch = true;

			let getItemsMock: __test.IMockedRequest<string[]> = mock.request(items);
			typeahead.getItems = getItemsMock;

			let visibleItems: string[];
			typeahead.refresh('A').subscribe(result => visibleItems = result);

			sinon.assert.calledOnce(getItemsMock);
			expect(getItemsMock.firstCall.args).to.be.empty;

			getItemsMock.flush();

			expect(visibleItems.length).to.equal(2);
			expect(visibleItems[0]).to.equal(items[2]);
			expect(visibleItems[1]).to.equal(items[3]);
		}));

		it('should cache the results of the parent getItems function and apply searches aganst the cached data if useClientSearching is on'
			, fakeAsync((): void => {
				typeahead.clientSearch = true;

				let getItemsMock: __test.IMockedRequest<string> = mock.request(items);
				typeahead.getItems = getItemsMock;
				let visibleItems: string[];
				typeahead.refresh('A').subscribe(result => visibleItems = result);
				getItemsMock.flush();

				getItemsMock.reset();

				typeahead.refresh('2').subscribe(result => visibleItems = result);

				flushMicrotasks();

				sinon.assert.notCalled(getItemsMock);

				expect(visibleItems.length).to.equal(1);
				expect(visibleItems[0]).to.equal(items[1]);
			}));

		it('should set the search value', (): void => {
			let getItemsMock: __test.IMockedRequest<string> = mock.request(items);
			typeahead.getItems = getItemsMock;

			typeahead.refresh('A');

			expect(typeahead.search).to.equal('A');
		});
	});

	describe('external API', (): void => {
		it('should add the specified item to the cached item list', fakeAsync((): void => {
			typeahead.clientSearch = true;

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
			typeahead.clientSearch = true;

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

		it('should collapse if allowCollapse is turned on', fakeAsync((): void => {
			let selectSpy: Sinon.SinonSpy = sinon.spy();
			typeahead.select = <any>{ emit: selectSpy };
			typeahead.clientSearch = true;
			typeahead.allowCollapse = true;
			initialLoad();

			typeahead.selectItem(items[0]);

			sinon.assert.calledOnce(setValue);
			sinon.assert.calledWith(setValue, items[0]);
			sinon.assert.calledOnce(selectSpy);
			sinon.assert.calledWith(selectSpy, items[0]);
			expect(typeahead.collapsed).to.be.true;
		}));

		it('should call the select function without collapsing', fakeAsync((): void => {
			let selectSpy: Sinon.SinonSpy = sinon.spy();
			typeahead.clientSearch = true;
			typeahead.select = <any>{ emit: selectSpy };
			initialLoad();

			typeahead.selectItem(items[0]);

			sinon.assert.notCalled(setValue);
			expect(typeahead.collapsed).to.be.false;
			sinon.assert.calledOnce(selectSpy);
			sinon.assert.calledWith(selectSpy, items[0]);
		}));

		it('should call create with the search text if the search option is selected', fakeAsync((): void => {
			let createSpy: Sinon.SinonSpy = sinon.spy(search => { return { value: search }; });
			typeahead.clientSearch = true;
			typeahead.allowCollapse = true;
			typeahead.create = createSpy;
			initialLoad();

			typeahead.search = 'search';
			typeahead.selectCustom();

			sinon.assert.calledOnce(createSpy);
			sinon.assert.calledWith(createSpy, 'search');
			sinon.assert.calledOnce(setValue);
			sinon.assert.calledWith(setValue, { value: 'search' });
			expect(typeahead.collapsed).to.be.true;
		}));

		it('should clear the current selection', (): void => {
			typeahead.collapsed = true;

			typeahead.clear();

			sinon.assert.calledOnce(setValue);
			sinon.assert.calledWith(setValue, null);
			expect(typeahead.collapsed).to.be.false;
		});

		it('should clear the search value', (): void => {
			typeahead.search = 'search';

			typeahead.selectItem('item');

			expect(typeahead.search).to.be.empty;
		});

		function initialLoad() {
			let getItemsMock: __test.IMockedRequest<string> = mock.request(items);
			typeahead.getItems = getItemsMock;

			typeahead.refresh('A');
			getItemsMock.flush();
		}
	});

	describe('showOptions', (): void => {
		it('should toggle the options', (): void => {
			expect(typeahead.showOptions).to.be.false;

			typeahead.toggle();

			expect(typeahead.showOptions).to.be.true;

			typeahead.toggle();

			expect(typeahead.showOptions).to.be.false;
		});

		it('should close the options', (): void => {
			typeahead.showOptions = true;
			typeahead.close();
			expect(typeahead.showOptions).to.be.false;
		});

		it('should do nothing if the options are already closed', (): void => {
			typeahead.showOptions = false;
			typeahead.close();
			expect(typeahead.showOptions).to.be.false;
		});

		it('should close the options when an item is selected', (): void => {
			typeahead.showOptions = true;
			typeahead.selectItem('option');
			expect(typeahead.showOptions).to.be.false;
		});

		it('should open the options when a search returns', fakeAsync((): void => {
			let getItemsMock: __test.IMockedRequest<string> = mock.request(['item']);
			typeahead.getItems = getItemsMock;
			typeahead.refresh('I');
			getItemsMock.flush();

			expect(typeahead.showOptions).to.be.true;
		}));

		it('should return false if loading', (): void => {
			typeahead.busy.loading = true;
			typeahead.showOptions = true;
			expect(typeahead.showOptionsWrapper).to.be.false;
		});

		it('should return false if search is empty', (): void => {
			typeahead.search = '';
			typeahead.showOptions = true;
			expect(typeahead.showOptionsWrapper).to.be.false;
		});

		it('should return showOptions if not loading and a search is present', (): void => {
			typeahead.search = 'search';
			typeahead.busy.loading = false;
			typeahead.showOptions = true;
			expect(typeahead.showOptionsWrapper).to.be.true;
		});
	});

	describe('ngOnChanges', (): void => {
		it('should update the search value on a value change', (): void => {
			typeahead.getDisplayName = item => item;
			typeahead.ngOnChanges({
				value: <any>{ currentValue: 'search' },
			});

			expect(typeahead.search).to.equal('search');
		});

		it('should collapse the typeahead on a value change if a value is specified and collapse is enabled', (): void => {
			typeahead.allowCollapse = true;
			typeahead.ngOnChanges({
				value: <any>{ currentValue: 'search' },
			});

			expect(typeahead.collapsed).to.be.true;
		});

		it('should uncollapse if the value changes to null', (): void => {
			typeahead.allowCollapse = true;
			typeahead.collapsed = true;
			typeahead.ngOnChanges({
				value: <any>{ currentValue: null },
			});

			expect(typeahead.collapsed).to.be.false;
		});
	});

	it('should return a clone of the template', (): void => {
		const template: any = {};
		typeahead.template = template;

		const clone: any = typeahead.newTemplate();

		expect(clone).to.not.equal(template);
		expect(clone).to.deep.equal(template);
	});
});
