import { NgModule, Injector, FactoryProvider, ValueProvider } from '@angular/core';

import { services } from 'typescript-angular-utilities';

import { CARD_CONTAINER_PROVIDERS } from'./components/cardContainer/index';
import { DIALOG_PROVIDERS } from'./components/dialog/index';

import { DialogRootService } from './components/dialog/dialogRoot.service';

import { CardContainerBuilderOld, DataSourceBuilderOld, FilterBuilderOld } from './components/cardContainer/builder/index';
import { ColumnSearchFilter } from './components/cardContainer/filters/columnSearchFilter/columnSearchFilter.service';
import { DataPagerOld } from './components/cardContainer/paging/index';
import { Sorter } from './components/cardContainer/sorts/sorter/sorter.service';
import { MergeSort } from './components/cardContainer/sorts/mergeSort/mergeSort.service';

import { AsyncHelper } from './services/async/async.service';
import { AutosaveActionService } from './services/autosaveAction/autosaveAction.service';
import { DocumentService } from './services/documentWrapper/documentWrapper.service';
import { FormService } from './services/form/form.service';
import { JQUERY_PROVIDER } from './services/jquery/jquery.provider';
import { WindowService } from './services/windowWrapper/windowWrapper.service';

import { cardContainerBuilderServiceName } from './componentsDowngrade';

import { BreakpointService, VisibleBreakpointService } from './services/breakpoints/index';

import { DefaultTheme } from './components/componentsDefaultTheme';

const cardContainerBuilderFactoryProvider: FactoryProvider = {
	provide: cardContainerBuilderServiceName,
	deps: [Injector, DataSourceBuilderOld, FilterBuilderOld],
	useFactory: (injector: Injector, dataSourceBuilder: DataSourceBuilderOld, filterBuilder: FilterBuilderOld) => {
		return {
			getInstance: () => new CardContainerBuilderOld(injector, dataSourceBuilder, filterBuilder),
		};
	},
};
const dataPagerFactoryProvider: ValueProvider = {
	provide: DataPagerOld,
	useValue: {
		getInstance: () => new DataPagerOld(),
	},
};
const columnSearchFactoryProvider: ValueProvider = {
	provide: ColumnSearchFilter,
	useValue: {
		getInstance: () => new ColumnSearchFilter(services.object.objectUtility, services.string.stringUtility, services.transform.transform),
	},
};
const defaultThemeNg1: FactoryProvider = {
	provide: 'defaultThemeNg1',
	deps: [DefaultTheme],
	useFactory: (defaultTheme: DefaultTheme) => defaultTheme.useDefaultTheme,
};

@NgModule({
	providers: [
		CARD_CONTAINER_PROVIDERS,
		DIALOG_PROVIDERS,

		DataSourceBuilderOld,
		FilterBuilderOld,

		AsyncHelper,
		AutosaveActionService,
		DefaultTheme,
		defaultThemeNg1,
		DialogRootService,
		FormService,
		DocumentService,
		BreakpointService,
		VisibleBreakpointService,
		JQUERY_PROVIDER,
		WindowService,
		dataPagerFactoryProvider,
		columnSearchFactoryProvider,
		Sorter,
		MergeSort,
		cardContainerBuilderFactoryProvider,
	],
})
export class ComponentProvidersModule { }
