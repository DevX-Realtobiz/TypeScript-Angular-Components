import { Component, Optional, Input, AfterViewInit, OnChanges, AfterViewChecked, ElementRef, SimpleChange, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import '../../../../libraries/bootstrap-touchspin/index';

import { services } from 'typescript-angular-utilities';
import __object = services.object;
import __array = services.array;
import __guid = services.guid;
import __number = services.number;
import __string = services.string;

import { ValidatedInputComponent, validationInputs, baseOutputs, IInputChanges } from '../validationInput';
import { ComponentValidator } from '../../../services/componentValidator/componentValidator.service';
import { FormComponent } from '../../form/form';

import { baseAnimations } from '../input';

export const defaultMaxValue: number = 100000000000000000000;

export interface ISpinnerChanges extends IInputChanges {
	disabled: SimpleChange;
}

@Component({
	selector: 'rlSpinner',
	template: require('./spinner.html'),
	inputs: validationInputs,
	outputs: baseOutputs,
	providers: [ComponentValidator],
	animations: baseAnimations,
})
export class SpinnerComponent extends ValidatedInputComponent<number> implements AfterViewInit, OnChanges, AfterViewChecked {
	@Input() min: number;
	@Input() max: number;
	@Input() step: number;
	@Input() decimals: number;
	@Input() prefix: string;
	@Input() postfix: string;
	@Input() roundToStep: boolean;
	@Input() spinnerId: string;

	@ViewChild('spinner') spinner: ElementRef;

	private numberUtility: __number.INumberUtility;
	private stringUtility: __string.IStringUtility;
	private rendering: boolean = false;
	private touchspin: JQuery;

	constructor(number: __number.NumberUtility
			, string: __string.StringUtility
			, @Optional() rlForm: FormComponent
			, componentValidator: ComponentValidator
			, object: __object.ObjectUtility
			, array: __array.ArrayUtility
			, guid: __guid.GuidService) {
		super(rlForm, componentValidator, object, array, guid);
		this.inputType = 'spinner';
		this.numberUtility = number;
		this.stringUtility = string;
	}

	focus(): void {
		this.spinner.nativeElement.focus();
	}

	ngAfterViewInit(): void {
		if (this.roundToStep && this.decimals == null) {
			throw new Error('You must specify the number of decimals to show when forcing to the step amount');
		}

		super.ngAfterViewInit();
		this.value = this.value;
		this.setDisabled(this.disabled);
		this.control.valueChanges.subscribe(value => {
			const roundedValue: number = this.round(value);
			if (value !== roundedValue) {
				this.control.setValue(roundedValue);
				this.value = roundedValue;
			}

			if (this.touchspin) {
				this.touchspin.val(roundedValue != null ? roundedValue.toString() : '');
			}
		});
	}

	ngOnChanges(changes: ISpinnerChanges): void {
		super.ngOnChanges(changes);
		if (changes.disabled) {
			this.setDisabled(changes.disabled.currentValue);
		}
	}

	ngAfterViewChecked(): void {
		if (this.rendering && this.spinner) {
			this.touchspin = $(this.spinner.nativeElement).TouchSpin({
				min: (this.min != null ? this.min : 0),
				max: (this.max != null ? this.max : defaultMaxValue),
				step: this.step,
				prefix: this.prefix,
				postfix: this.postfix,
				decimals: this.decimals,
				initval: this.value,
				forcestepdivisibility: this.roundToStep ? 'round' : 'none',
			});

			this.touchspin.on('change', (): void => {
				const spinValue: string = this.touchspin.val();
				const valueAsNumber: number = this.stringUtility.toNumber(spinValue);
				this.setValue(this.round(valueAsNumber));
			});
			this.rendering = false;
		}
	}

	private round(num: number): number {
		if (num != null && this.roundToStep) {
			num = __number.numberUtility.roundToStep(num, this.step);
			num = __number.numberUtility.preciseRound(num, this.decimals);
		}

		return num;
	}

	private setDisabled(disabled: boolean): void {
		if (!disabled) {
			this.rendering = true;
		} else {
			this.touchspin = null;
		}
	}
}
