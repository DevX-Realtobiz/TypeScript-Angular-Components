import { Component, ContentChildren, AfterContentInit, QueryList } from '@angular/core';

import { TabComponent } from './tab/tab';

@Component({
	selector: 'rlTabset',
	template: require('./tabset.html'),
})
export class TabsetComponent implements AfterContentInit {

	constructor(){ }
	@ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

	select(tab: TabComponent): void {
		this.tabs.forEach(thisTab => {
			thisTab.isActive = false;
		});

		tab.isActive = true;
	}

	ngAfterContentInit() {
		if (this.tabs) {
			this.select(this.tabs[0]);
		}
	}
}
