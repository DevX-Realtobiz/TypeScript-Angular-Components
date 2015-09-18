// uses typings/angularjs
// uses typings/lodash
// uses typings/jquery
// uses typescript-angular-utilities

// /// <reference path='../../typings/angularjs/angular.d.ts' />
// /// <reference path='../../typings/lodash/lodash.d.ts' />
// /// <reference path='../../typings/jquery/jquery.d.ts' />
// /// <reference path='../../../libraries/typescript-angular-utilities/typings/utility.d.ts' />

/// <reference path='../../types/viewData.d.ts' />
/// <reference path='dataSources/dataPager/dataPager.service.ts' />
/// <reference path='dataSources/dataSources.module.ts' />
/// <reference path='column.ts' />
/// <reference path='sorts/sorts.module.ts' />
/// <reference path='sorts/sortDirection.ts' />
/// <reference path='../../services/breakpoints/breakpoint.ts' />

module rl.ui.components.cardContainer {
	export var directiveName: string = 'rlCardContainer';
	export var controllerName: string = 'CardContainerController';
	
	export var defaultMaxColumnSorts: number = 2;
	export var defaultSelectionTitle: string = 'Select card';
	
	import __object = rl.utilities.services.object;
	import __array = rl.utilities.services.array;
	import __parentChild = rl.utilities.services.parentChildBehavior;
	
	export interface ICardContainerBindings {
		source: dataSources.IDataSource<any>;
		filters: utilities.filters.IFilter[] | { [index: string]: utilities.filters.IFilter };
		paging: boolean;
		columns: IColumn[];
		containerData: any;
		cardController: string;
		cardControllerAs: string;
		cardAs: string;
		clickableCards: boolean;
		maxColumnSorts: number;
		permanentFooters: boolean;
		selectableCards: boolean;
		disableSelection(item: any): string;
	}
	
	export interface ICardBehavior {
		close(): boolean;
	}
	
	export interface ICardContainerAttrs extends ng.IAttributes {
		disableSelection: string;
	}
	
	export interface ISelectionViewData {
		selected: boolean;
		selectionTitle?: string;
		disabledSelection?: boolean;
	}
	
	export class CardContainerController {
		// bindings
		source: dataSources.IDataSource<any>;
		filters: utilities.filters.IFilter[] | { [index: string]: utilities.filters.IFilter };
		paging: boolean;
		columns: IColumn[];
		containerData: any;
		cardController: string;
		cardControllerAs: string;
		cardAs: string;
		clickableCards: boolean;
		maxColumnSorts: number;
		permanentFooters: boolean;
		selectableCards: boolean;
		disableSelection: {(item: any): string};
		
		dataSource: dataSources.IDataSource<any>;
		sortDirection: sorts.ISortDirections;
		numberSelected: number = 0;
		selectionColumn: IColumn;
		pager: dataSources.dataPager.IDataPager;
		private maxColSorts: number;
		private disablingSelections: boolean;
	
		makeCard: ng.ITranscludeFunction;
	
		static $inject: string[] = ['$scope', '$attrs', __object.serviceName, __array.serviceName, dataSources.dataPager.factoryName, __parentChild.serviceName];
		constructor(private $scope: ng.IScope
				, $attrs: ICardContainerAttrs
				, private object: __object.IObjectUtility
				, private array: __array.IArrayUtility
				, private dataPagerFactory: dataSources.dataPager.IDataPagerFactory
				, private parentChild: __parentChild.IParentChildBehaviorService) {
			this.dataSource = this.source;
			this.permanentFooters = _.isUndefined(this.permanentFooters) ? false : this.permanentFooters;
			this.maxColSorts = this.maxColumnSorts != null ? this.maxColumnSorts : defaultMaxColumnSorts;
			this.disablingSelections = object.isNullOrWhitespace($attrs.disableSelection) === false;
			this.sortDirection = sorts.SortDirection;
	
			this.syncFilters();
	
			this.setupPaging();
	
			this.buildColumnSizes();
	
			if (this.selectableCards) {
				//*use card container event service?
				$scope.$on('selectionChanged', this.updateSelected);
				$scope.$on('updateDisabledSelections', this.updateDisabledSelections);
	
				this.dataSource.watch(this.addViewData, 'changed');
				this.dataSource.watch(this.clearFilteredSelections, 'redrawing');
	
				this.addViewData();
	
				this.selectionColumn = {
					label: null,
					size: null,
					getValue(item: any): boolean {
						return item.viewData.selected;
					},
					flipSort: true,
				};
			}
	
			if (this.dataSource.sorts == null) {
				this.dataSource.sorts = [];
			}
		}
	
		lookupFilter(type: string): utilities.filters.IFilter {
			return this.filters[type];
		}
	
		sortSelected(): void {
			this.sort(this.selectionColumn);
		}
	
		openCard(): boolean {
			var behaviors: ICardBehavior[] = this.parentChild.getAllChildBehaviors<ICardBehavior>(this.dataSource.dataSet);
	
			return _.all(_.map(behaviors, (behavior: ICardBehavior): boolean => { return behavior.close(); }));
		}
	
		sort(column: IColumn): void {
			var sortList: sorts.ISort[] = this.dataSource.sorts;
			var firstSort: sorts.ISort = sortList[0];
	
			// If column is already the primary sort, change the direction
			if (firstSort != null
				&& firstSort.column === column) {
				firstSort.direction = sorts.toggle(firstSort.direction);
	
				// Clear sort
				if (firstSort.direction === sorts.SortDirection.none) {
					this.clearVisualSortIndicator(firstSort);
					firstSort = null;
	
					// If the column has secondary sorts don't fall back to a
					//  secondary sort, instead just clear all sorts
					if (column.secondarySorts != null) {
						sortList.length = 0;
					} else { // otehrwise, clear the primary sort and fallback to previous sort
						sortList.shift();
					}
				}
			} else {
				// Else make column primary ascending sort
	
				// Remove any existing non-primary sorts on column
				this.array.remove(sortList, (sort: sorts.ISort): boolean => {
					return column === sort.column;
				});
	
				// Build ascending sort for column
				var newSort: sorts.ISort = {
					column: column,
					direction: sorts.SortDirection.ascending,
				};
	
				sortList.unshift(newSort);
	
				firstSort = newSort;
			}
	
			this.updateVisualColumnSorting();
	
			// If column has secondary sorts, wipe the sort order and just apply the secondary sorts
			if (firstSort != null && column.secondarySorts != null) {
				sortList.length = 0;
				var secondarySorts: sorts.ISort[] = this.buildSecondarySorts(firstSort.direction, column.secondarySorts);
				sortList.push(firstSort);
				sortList.push.apply(sortList, secondarySorts);
			} else {
				// If not using column secondary sorts, limit the maximum number
				//  of sorts applied to the maximum number of sorts
				this.dataSource.sorts = _.take(sortList, this.maxColSorts);
			}
	
			this.dataSource.refresh();
		}
	
		selectionChanged(): void {
			this.updateSelected();
			this.$scope.$emit('selectionChanged');
		}
	
		private syncFilters(): void {
			if (this.filters != null) {
				// Convert filter array to dictionary if necessary
				if (_.isArray(this.filters)) {
					this.filters = this.array.toDictionary(<utilities.filters.IFilter[]>this.filters, (filter: utilities.filters.IFilter): string => { return filter.type; });
				}
	
				this.dataSource.filters = <{ [index: string]: utilities.filters.IFilter }>this.filters;
				this.dataSource.refresh();
			} else if (this.dataSource.filters != null) {
				this.filters = this.dataSource.filters;
			}
		}
	
		private setupPaging(): void {
			// If paging flag is specified, card container controls pager instance
			if (this.paging != null) {
				if (this.paging === false) {
					this.dataSource.pager = null;
				} else {
					this.pager = this.dataPagerFactory.getInstance();
					this.dataSource.pager = this.pager;
				}
			} else if (this.dataSource.pager) {
				// If the paging flag is not set and the dataSource has a pager, save a reference here
				this.pager = this.dataSource.pager;
			}
		}
	
		private buildColumnSizes(): void {
			_.each(this.columns, (column: IColumn): void => {
				var sizes: IBreakpointSize | number = column.size;
				if (_.isObject(sizes)) {
					sizes[services.breakpoints.xs] = this.object.valueOrDefault(sizes[services.breakpoints.xs], 0);
					sizes[services.breakpoints.sm] = this.object.valueOrDefault(sizes[services.breakpoints.sm], sizes[services.breakpoints.xs]);
					sizes[services.breakpoints.md] = this.object.valueOrDefault(sizes[services.breakpoints.md], sizes[services.breakpoints.sm]);
					sizes[services.breakpoints.lg] = this.object.valueOrDefault(sizes[services.breakpoints.lg], sizes[services.breakpoints.md]);
				} else {
					column.size = {
						xs: <number>sizes,
						sm: <number>sizes,
						md: <number>sizes,
						lg: <number>sizes,
					};
				}
			});
		}
	
		private addViewData: {(): void} = (): void => {
			_.each(this.dataSource.rawDataSet, (item: rl.ui.types.IViewDataEntity<ISelectionViewData>): void => {
				if (_.isUndefined(item.viewData)) {
					item.viewData = {
						selected: false,
					};
				}
			});
	
			this.updateDisabledSelections();
		}
	
		private lookupColumn(label: string): IColumn {
			return _.find(this.columns, (column: IColumn): boolean => {
				return column.label === label;
			});
		}
	
		private clearFilteredSelections: {(): void} = (): void => {
			var nonVisibleItems: any[] = _.difference(this.dataSource.rawDataSet, this.dataSource.filteredDataSet);
	
			_.each(nonVisibleItems, (item: rl.ui.types.IViewDataEntity<ISelectionViewData>): void => {
				if (_.isUndefined(item.viewData)) {
					item.viewData = {
						selected: false,
					};
				}
	
				item.viewData.selected = false;
				item.viewData.selectionTitle = defaultSelectionTitle;
			});
	
			this.updateSelected();
		}
	
		private updateSelected: {(): void} = (): void => {
			this.numberSelected = _.filter(this.dataSource.filteredDataSet, (item: rl.ui.types.IViewDataEntity<ISelectionViewData>): boolean => {
				return item.viewData.selected;
			}).length;
		}
	
		private updateDisabledSelections: {(): void} = (): void => {
			if (this.disablingSelections) {
				_.each(this.dataSource.rawDataSet, (item: rl.ui.types.IViewDataEntity<ISelectionViewData>): void => {
					var disabledReason: string = this.disableSelection({ item: item });
					item.viewData.disabledSelection = (disabledReason != null);
					item.viewData.selectionTitle = (item.viewData.disabledSelection ? disabledReason : defaultSelectionTitle);
				});
			}
		}
	
		private buildSecondarySorts(direction: sorts.SortDirection, secondarySorts: ISecondarySorts): sorts.ISort[] {
			var sortList: sorts.IPartialSort[] = secondarySorts[sorts.getFullName(direction)];
			return _.map(sortList, (sort: sorts.IPartialSort): sorts.ISort => {
				return {
					direction: sort.direction,
					column: this.lookupColumn(sort.column),
				};
			});
		}
	
		private updateVisualColumnSorting(): void {
			_.each(this.dataSource.sorts, (sort: sorts.ISort, index: number): void => {
				// Only first sort should have visible direction
				if (index === 0) {
					this.updateVisualSortIndicator(sort);
				} else {
					this.clearVisualSortIndicator(sort);
				}
			});
		}
	
		private updateVisualSortIndicator(sort: sorts.ISort): void {
			sort.column.sortDirection = sort.direction;
		}
	
		private clearVisualSortIndicator(sort: sorts.ISort): void {
			sort.column.sortDirection = null;
		}
	}
	
	cardContainer.$inject = ['$compile'];
	export function cardContainer($compile: ng.ICompileService): ng.IDirective {
		'use strict';
		return {
			restrict: 'E',
			transclude: true,
			templateUrl: 'components/cardContainer/cardContainer.html',
			controller: controllerName,
			controllerAs: 'cardContainer',
			scope: {},
			bindToController: {
				// summary: The data source for the card container
				// remarks: Can be an array of objects, or an implementation of the data source contract: {
				//     sorts: A list of sorts to apply to the data. Sorts should be in this format: {
				//         column: The name of the column to sort on,
				//         direction: Sort ascending or descending (sortDirection.js)
				//     },
				//     filters: A list of filters to apply to the data source,
				//     pager: A pager that can be optionally used to page the data: {
				//         filter: function(dataSet) {
				//             Takes the data set and filters it down to pages
				//         }
				//     },
				//     refresh: [function] Call to trigger the data source to refresh,
				//     dataSet: Will contain the resulting data provided by the source, after sorts and filters are applied,
				//     count: The number of items available in the data set (used for paging).
				//     loadingDataSet: A boolean indicating if the dataSet is being refreshed / loaded,
				// }
				source: '=',
	
				// summary: A list of filters to be applied to the data source
				// remarks: Each filter should implement the data filter contract: {
				//     type: A name that can be used to look up the filter,
				//     filter: function(item) { takes an item and returns false if it should be removed from the data set },         
				// }
				filters: '=',
	
				// summary: Turn paging on or off (true / false)
				paging: '=',
	
				// summary: A list of the columns for building the column header and card headers.
				// remarks: Each column object should be in the following format: {
				//     label: The label for the column header,
				//     description: A description for the column; shown in tooltips,
				//     size: A description of the column size at breakpoints; either a constant int (for constant size) or breakpoint detail object: {
				//         [xs]: optional size for xs breakpoint (defaults to 0),
				//         [sm]: optional size for sm breakpoint (defaults to xs),
				//         [md]: optional size for md breakpoint (defaults to sm),
				//         [lg]: optional size for lg breakpoint (defaults to md),
				//     },
				//     getValue: A function that takes a data record and retrieves the value for the column,
				//     headerTemplateUrl: The path to an HTML template for the column header,
				//     headerTemplate: An HTML template string for the column header (overriden by headerTemplateUrl if present),
				//     templateUrl: The path to an HTML template for the card header,
				//     template: An HTML template string for the card header (overriden by templateUrl if present),
				//     secondarySorts: A set of secondary sorts to apply on other columns when this column is sorted (ascending and / or descending): {
				//        sortDirection.ascending ('asc'):  [
				//             {
				//                 column: The label of another column to sort on,
				//                 direction: The direction to sort the column,
				//             },
				//             ...
				//        ],
				//        sortDirection.descending ('desc'): [
				//             {
				//                 column: The label of another column to sort on,
				//                 direction: The direction to sort the column,
				//             },
				//             ...
				//        ],
				//     }
				// }
				columns: '=',
	
				// summary: container-wide data available in cards
				containerData: '=',
	
				// summary: controller shared by all components on a card
				// remarks: this controller cannot override any of the following variable names:
				//          columns
				//          item
				//          contentTemplate
				//          footerTemplate
				//          clickable
				//          cardController
				//          cardControllerAs
				//          cardAs
				//          showContent
				//          toggleContent
				//          collapse
				//          selected
				//          setSelected
				cardController: '@',
	
				// summary: controller alias specified using controllerAs syntax
				cardControllerAs: '@',
	
				// summary: name used to access the card data
				cardAs: '@',
	
				// summary: Indicates if cards should show active state on mouse over
				clickableCards: '=',
	
				// summary: The number of sorts that can be applied at a time.
				maxColumnSorts: '=',
	
				permanentFooters: '=',
	
				// summary: If true, turns on selection for cards via the cardData.viewData.selected property
				selectableCards: '=',
				// summary: Function called with each item. If true is returned selection is disabled for this item. 
				//          If function is not defined, selection is enabled for all by default.
				disableSelection: '&',
			},
			link(scope: ng.IScope
				, element: ng.IAugmentedJQuery
				, attrs: ng.IAttributes
				, controller: CardContainerController
				, transclude: ng.ITranscludeFunction): void {
				var headerArea: JQuery = element.find('.container-header-template');
				var footerArea: JQuery = element.find('.container-footer-template');
	
				controller.makeCard = transclude;
	
				transclude(scope, (clone: JQuery): void => {
					var header: JQuery = clone.filter('container-header');
	
					if (header.length === 0) {
						header = $compile('<div ng-include="\''
							+ 'components/cardContainer/defaultCardContainerHeader.html'
							+ '\'"></div>')(scope);
					}
	
					headerArea.append(header);
	
					var footer: JQuery = clone.filter('container-footer');
	
					if (footer.length === 0) {
						footer = $compile('<div ng-include="\''
							+ 'components/cardContainer/defaultCardContainerFooter.html'
							+ '\'"></div>')(scope);
					}
	
					footerArea.append(footer);
				});
			}
		};
	}
}
