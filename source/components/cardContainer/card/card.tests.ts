import { filter } from 'lodash';

import { services } from 'typescript-angular-utilities';
import __boolean = services.boolean;
import __notification = services.notification;

import { FormService } from '../../../services/form/form.service';

import { CardComponent } from './card';

interface ICardContainerMock {
	openCard: Sinon.SinonSpy;
	dataSource: any;
	registerCard: Sinon.SinonSpy;
	columnTemplates?: any;
}

describe('CardComponent', () => {
	let card: CardComponent<any>;
	let cardContainer: ICardContainerMock;

	beforeEach(() => {
		cardContainer = {
			openCard: sinon.spy((): boolean => { return true; }),
			dataSource: {
				refresh: sinon.spy(),
				remove: sinon.spy(),
			},
			registerCard: sinon.spy(),
		};

		card = new CardComponent(new __boolean.BooleanUtility(), new __notification.NotificationService(<any>{}, <any>{}), new FormService(), <any>cardContainer);
	});

	it('should register with the card container', (): void => {
		sinon.assert.calledOnce(cardContainer.registerCard);
		sinon.assert.calledWith(cardContainer.registerCard, card);
	});

	it('should pass the item to the save handler', (): void => {
		const saveSpy = sinon.spy();
		card.save = saveSpy;
		const item = {};
		card.item = item;

		card.saveForm();

		sinon.assert.calledOnce(saveSpy);
		sinon.assert.calledWith(saveSpy, item);
	});

	it('should provide a function for refreshing the data source', (): void => {
		card.refresh.next(null);
		sinon.assert.calledOnce(<Sinon.SinonSpy>cardContainer.dataSource.refresh);
	});

	it('should provide a function for removing the current item from the data source', (): void => {
		let item: any = { prop: 1 };
		card.item = item;

		card.remove();

		sinon.assert.calledOnce(<Sinon.SinonSpy>cardContainer.dataSource.remove);
		sinon.assert.calledWith(<Sinon.SinonSpy>cardContainer.dataSource.remove, item);
	});

	it('should get a matching column template from the card container', (): void => {
		const template = { name: 'template' };
		cardContainer.columnTemplates = {
			items: [template, { name: 'otherTemplate' }],
			filter: func => filter(cardContainer.columnTemplates.items, func),
		};

		expect(card.getColumnTemplate('template')).to.equal(template);
	});

	describe('toggle', (): void => {
		it('should toggle the card content', (): void => {

			expect(card.showContent).to.be.false;

			card.toggleContent();

			expect(card.showContent).to.be.true;

			card.toggleContent();

			expect(card.showContent).to.be.false;
		});
	});

	describe('open', (): void => {
		it('should call the overridable initCard function', (): void => {
			const initSpy = sinon.spy();
			card.initCard = initSpy;

			card.toggleContent();

			sinon.assert.calledOnce(initSpy);
		});
	});

	describe('close', (): void => {
		it('should close the card content if the submit is successful', (): void => {
			card.showContent = true;
			card.submit = sinon.spy(() => true);

			const closed = card.close();

			expect(card.showContent).to.be.false;
			expect(closed).to.be.true;
		});

		it('should return true if the card isn\'t open', (): void => {
			sinon.spy(card, 'submit');

			const closed = card.close();

			expect(closed).to.be.true;
			sinon.assert.notCalled(<any>card.submit);
		});

		it('should not close the card if submit fails', (): void => {
			card.showContent = true;
			card.submit = sinon.spy(() => false);

			const closed = card.close();

			expect(card.showContent).to.be.true;
			expect(closed).to.be.false;
		});
	});
});
