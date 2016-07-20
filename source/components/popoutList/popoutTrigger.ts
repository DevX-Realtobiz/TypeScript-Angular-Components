import { Directive, HostListener, ElementRef } from '@angular/core';

import { PopoutListService } from './popoutList.service';

@Directive({
	selector: '[rlPopoutTrigger]',
})
export class PopoutTriggerDirective {
	@HostListener('keyup.arrowdown') downArrow = () => this.next();
	@HostListener('keyup.arrowup') upArrow = () => this.previous();
	@HostListener('blur') onBlur = () => this.select();
	@HostListener('focus') onFocus = () => this.show();
	@HostListener('keyup.enter') onEnter = () => this.elementRef.nativeElement.blur();

	popoutListService: PopoutListService<any>;
	elementRef: ElementRef;

	constructor(popoutListService: PopoutListService<any>
			, elementRef: ElementRef) {
		this.popoutListService = popoutListService;
		this.elementRef = elementRef;
		popoutListService.select.subscribe(() => elementRef.nativeElement.blur());
	}

	show(): void {
		this.popoutListService.open();
	}

	next(): void {
		if (this.popoutListService.showOptions) {
			this.popoutListService.focusNext();
		}
	}

	previous(): void {
		if (this.popoutListService.showOptions) {
			this.popoutListService.focusPrevious();
		}
	}

	select(): void {
		if (this.popoutListService.current) {
			this.popoutListService.selectCurrent();
		} else {
			this.popoutListService.close();
		}
	}
}
