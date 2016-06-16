import { Component, Optional, Inject, Input, Output, ViewChild, ContentChild, OnInit, AfterViewInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { isArray, clone } from 'lodash';

import { services } from 'typescript-angular-utilities';
import __object = services.object;
import __array = services.array;
import __guid = services.guid;
import __transform = services.transform;

import { ValidatedInputComponent, validationInputs, baseOutputs } from '../validationInput';
import { ComponentValidator } from '../../../services/componentValidator/componentValidator.service';
import { FormComponent } from '../../form/form';
import { BusyComponent } from '../../busy/busy';
import { OffClickDirective } from '../../../behaviors/offClick/offClick';
import { TemplateRenderer } from '../../templateRenderer/templateRenderer';

@Component({
	selector: 'rlSelect',
	template: require('./select.html'),
	inputs: validationInputs,
	outputs: baseOutputs,
	providers: [ComponentValidator],
	directives: [BusyComponent, OffClickDirective, TemplateRenderer],
})
export class SelectComponent<T> extends ValidatedInputComponent<T> implements OnInit, AfterViewInit {
	@Input() options: T[] | Observable<T[]>;
	@Input() transform: __transform.ITransform<T, string>;
	@Input() nullOption: string;

	// used for select filter only
	@Input() externalTemplate: TemplateRef<any>;

	@ViewChild(BusyComponent) busy: BusyComponent;
	@ContentChild(TemplateRef) template: TemplateRef<any>;

	wrappedOptions: Observable<T[]>;
	showOptions: boolean;
	private transformService: __transform.ITransformService;

	constructor(@Inject(__transform.transformToken) transformService: __transform.ITransformService
			, @Optional() rlForm: FormComponent
			, componentValidator: ComponentValidator
			, @Inject(__object.objectToken) object: __object.IObjectUtility
			, @Inject(__array.arrayToken) array: __array.IArrayUtility
			, @Inject(__guid.guidToken) guid: __guid.IGuidService) {
		super(rlForm, componentValidator, object, array, guid);
		this.transformService = transformService;
		this.inputType = 'select';
	}

	ngOnInit(): void {
		super.ngOnInit();
		this.template = this.template || this.externalTemplate;
	}

	ngAfterViewInit(): void {
		super.ngAfterViewInit();
		this.wrappedOptions = isArray(this.options)
							? Observable.of(<T[]>this.options)
							: <Observable<T[]>>this.options;
		this.busy.trigger(this.wrappedOptions);
	}

	toggle(): void {
		this.showOptions = !this.showOptions;
	}

	close: { (): void } = () => {
		if (this.showOptions) {
			this.showOptions = false;
		}
	}

	select(value: T): void {
		this.setValue(value);
		this.showOptions = false;
	}

	getDisplayName(item: T): string {
		return this.transformService.getValue(item, this.transform);
	}

	newTemplate(): TemplateRef<any> {
		return clone(this.template);
	}
}