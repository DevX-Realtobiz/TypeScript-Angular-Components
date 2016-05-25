import { Component, Optional, Inject, Input, Output, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';
import { isUndefined } from 'lodash';
import * as moment from 'moment';
import * as $ from 'jquery';
import '../../../libraries/bootstrap-datetimepicker/index';

import { services, filters } from 'typescript-angular-utilities';
import __object = services.object;
import __array = services.array;
import __guid = services.guid;
import __date = services.date;
import __dateFormats = __date.defaultFormats;
import __timezone = services.timezone;

import { ButtonComponent } from '../button/button.ng2';
import { ValidatedInputComponent, validationInputs, baseOutputs } from '../input/input.ng2';
import { ComponentValidator } from '../../services/componentValidator/componentValidator.service.ng2';
import { FormComponent } from '../form/form.ng2';

@Component({
	selector: 'rlDateTime',
	template: require('./dateTime.ng2.html'),
	inputs: validationInputs,
	outputs: baseOutputs,
	directives: [ButtonComponent],
	providers: [ComponentValidator],
	pipes: [filters.isEmpty.IsEmptyPipe],
})
export class DateTimeComponent extends ValidatedInputComponent<moment.Moment> implements AfterViewInit {
	@Input() useDate: boolean;
	@Input() useTime: boolean;
	@Input() min: string | Date | moment.Moment;
	@Input() max: string | Date | moment.Moment;
	@Input() minuteStepping: number;
	@Input() showClear: boolean;
	@Output() clear: EventEmitter<any> = new EventEmitter();

	valueAsString: string;
	validFormat: boolean;
	format: string;
	timezone: __timezone.ITimezone;
	private timezoneService: __timezone.ITimezoneService;
	private dateService: __date.IDateUtility;
	private elementRef: ElementRef;
	private rendering: boolean = false;
	private touchspin: JQuery;

	constructor(elementRef: ElementRef
			, @Inject(__timezone.timezoneToken) timezoneService: __timezone.ITimezoneService
			, @Inject(__date.dateToken) dateService: __date.IDateUtility
			, @Optional() rlForm: FormComponent
			, componentValidator: ComponentValidator
			, @Inject(__object.objectToken) object: __object.IObjectUtility
			, @Inject(__array.arrayToken) array: __array.IArrayUtility
			, @Inject(__guid.guidToken) guid: __guid.IGuidService) {
		super(rlForm, componentValidator, object, array, guid);
		this.inputType = 'dateTime';
		this.timezoneService = timezoneService;
		this.dateService = dateService;
		this.elementRef = elementRef;
		this.timezone = this.timezoneService.currentTimezone;
	}

	ngOnInit(): void {
		super.ngOnInit();
		this.valueAsString = this.value != null
							? this.formatDate(this.value)
							: '';
	}

	ngAfterViewInit(): void {
		super.ngAfterViewInit();

		this.useDate = isUndefined(this.useDate) ? true : this.useDate;
		this.useTime = isUndefined(this.useTime) ? true : this.useTime;

		const defaults: bootstrapDateTimePicker.IConfiguration = $(this.elementRef.nativeElement).datetimepicker.defaults;
		this.min = this.min != null ? this.min : defaults.minDate;
		this.max = this.max != null ? this.max : defaults.maxDate;
		this.setValidity(this.value);

		this.control.valueChanges.subscribe(value => {
			this.valueAsString = this.formatDate(value);
		});

		$(this.elementRef.nativeElement).find('.show-date-picker').datetimepicker({
			stepping: this.minuteStepping || 1,
			format: this.getFormatOrDefault(),
			direction: 'bottom',
			elementHeight: 2,
			pickDate: this.useDate,
			pickTime: this.useTime,
			minDate: this.min,
			maxDate: this.max,
		}).on('change.dp', (): void => {
			const newValue: string = $(this.elementRef.nativeElement).find('input').val();
			this.setValue(this.parseDate(newValue));
		});
	}

	onClear(): void {
		this.setValue(null);
		this.clear.emit(null);
	}

	private formatDate(value: moment.Moment): string {
		if (value == null) {
			this.timezone = this.timezoneService.currentTimezone;
			return null;
		}

		const date: moment.Moment = moment(value);

		this.setValidity(date);

		this.timezone = __timezone.timezones.get(date.tz());
		return date.format(this.getFormatOrDefault());
	}

	private parseDate(value: string): moment.Moment {
		if (this.object.isNullOrEmpty(value)) {
			return null;
		}

		const newMoment: moment.Moment = this.timezoneService.buildMomentWithTimezone(value, this.timezone, this.getFormatOrDefault());
		this.setValidity(newMoment);
		return newMoment;
	}

	private getFormatOrDefault(): string {
		return this.format || <string>this.defaultFormat(this.useDate, this.useTime);
	}

	private defaultFormat(hasDate: boolean, hasTime: boolean): string | boolean {
		if (hasDate && hasTime) {
			return __dateFormats.dateTimeFormat;
		} else if (hasDate) {
			return __dateFormats.dateFormat;
		} else if (hasTime) {
			return __dateFormats.timeFormat;
		} else {
			// revert to default format
			return false;
		}
	}

	private setValidity(date: moment.Moment): void {
		this.validFormat = __object.objectUtility.isNullOrEmpty(date)
			? true
			: moment(date).isValid();
	}
}