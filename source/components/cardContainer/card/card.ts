import { Component, Inject, forwardRef, Optional, SkipSelf, ChangeDetectionStrategy, Input } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { isFunction, assign } from 'lodash';

import { services } from 'typescript-angular-utilities';
import __notification = services.notification;

import { IDataSourceOld } from '../dataSources/dataSource';
import { IColumn } from '../column';
import { CardContainerComponent } from '../cardContainer';
import { FormComponent, baseInputs, IBaseFormInputs } from '../../form/form';
import { AsyncHelper } from '../../../services/async/async.service';
import { FormService } from '../../../services/form/form.service';
import { CardContentTemplate, CardFooterTemplate } from '../../cards/index';
import { ColumnContentTemplate } from '../templates/index';

export interface ICardInputs extends IBaseFormInputs {
	item: string,
}

export const cardInputs: ICardInputs = <ICardInputs>assign({}, baseInputs, {
	item: 'item',
});

@Component({
	selector: 'rlCard',
	template: require('./card.html'),
	inputs: [cardInputs.item],
	providers: [
		{
			provide: FormComponent,
			useExisting: forwardRef(() => CardComponent),
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent<T> extends FormComponent {
	item: T;

	@Input() permanentFooter:boolean = false;

	// consumer properties
	initCard: { (): void } = () => null;
	clickCard: { (): void } = () => null;

	showContent$: BehaviorSubject<boolean>;

	cardContainer: CardContainerComponent<T>;

	constructor(notification: __notification.NotificationService
			, asyncHelper: AsyncHelper
			, formService: FormService
			, @Optional() @SkipSelf() parentForm: FormComponent
			, @Inject(forwardRef(() => CardContainerComponent)) cardContainer: CardContainerComponent<T>) {
		super(notification, asyncHelper, formService, parentForm);
		this.cardContainer = cardContainer;
		this.showContent$ = new BehaviorSubject(false);
	}

	toggleContent(): void {

		if (this.showContent$.getValue()) {
			this.close();
		} else {
			this.open();
		}
	}

	open(): void {
		if (isFunction(this.initCard)) {
			this.initCard();
		}

		if (this.cardContainer.openCard()) {
			this.showContent$.next(true);
		}
	}

	close(): boolean {
		if (!this.showContent$.getValue()) {
			return true;
		}

		let canClose = true;

		//hack to stop auto save when non needed or available
		let obs = this.saveForm()
		if (obs) { canClose = !!this.submit(); }

		if (canClose) {
			this.showContent$.next(false);
		}

		return canClose;
	}

	remove(): void {
		this.cardContainer.dataSource.remove(this.item);
	}

	saveForm(): any {
		return this.save(this.item);
	}

	getColumnTemplate(columnName: string): ColumnContentTemplate {
		return this.cardContainer.columnTemplates.filter(column => column.name === columnName)[0];
	}
}
