import { Component, ContentChildren, AfterContentInit, QueryList } from '@angular/core';

import { services } from 'typescript-angular-utilities';
import test = services.test;

import { TabsetComponent, TabComponent, TabHeaderComponent } from './index';

class MockQueryList<T> extends Array<T>
{
	get first(): T {
		return this[0];
	}
}

describe('TabsetComponent', () => {
	let tabset: TabsetComponent;
	let mockTabComponentQueryList: MockQueryList<TabComponent>;
	let tabsetTabsSpy: Sinon.SinonSpy;
	let tabHeader: TabHeaderComponent;
	beforeEach(() => {
		tabset = new TabsetComponent();
		tabHeader = new TabHeaderComponent({
			nativeElement: {
				innerHTML: 'Header Text'
			}
		});

		mockTabComponentQueryList = new MockQueryList<TabComponent>();
		let tabComponent: TabComponent;

		for (var i = 0; i < 2; i++) {
			tabComponent = new TabComponent();
			tabComponent.header = tabHeader;
			tabComponent.childForm = null;
			tabComponent.isActive = false;
			mockTabComponentQueryList.push(tabComponent);
		}

		tabset.tabs = <any>mockTabComponentQueryList;
	});

	it('should select the first tab', (): void => {
		tabset.ngAfterContentInit();
		expect(tabset.tabs[0].isActive).to.be.true;
		expect(tabset.tabs[1].isActive).to.be.false;
	});

	it('should hide all tabs and show the selected tab', (): void => {
		tabset.ngAfterContentInit();
		tabset.select(mockTabComponentQueryList[1]);

		expect(tabset.tabs[0].isActive).to.be.false;
		expect(tabset.tabs[1].isActive).to.be.true;
	});
});
