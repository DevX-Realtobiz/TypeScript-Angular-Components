import * as _ from 'lodash';
import { rlFakeAsync, mock } from 'rl-async-testing';

import { services } from 'typescript-angular-utilities';
import __array = services.array;
import test = services.test;

import {
	moduleName,
	factoryName,
	IMessageLog,
	IMessageLogFactory,
	IGetMessagesResult,
} from './messageLog.module';

import * as angular from 'angular';
import 'angular-mocks';


interface ITestDataService {
	saveMessage: sinon.SinonSpy;
	getMessages: sinon.SinonSpy;
	deleteMessage: sinon.SinonSpy;
}

describe('messageLog', () => {
	let messageLog: IMessageLog;
	let dataService: ITestDataService;
	let allMessages: string[];

	beforeEach(() => {
		angular.mock.module(moduleName);

		allMessages = defaultMessages();

		let services: any = test.angularFixture.inject(factoryName);
		let messageLogFactory: IMessageLogFactory = services[factoryName];
		messageLog = messageLogFactory.getInstance();
		messageLog.pageSize = 5;

		dataService = {
			saveMessage: mock.promise((message: any): void => { allMessages.unshift(message); }),
			deleteMessage: mock.promise((message: any): void => { __array.arrayUtility.remove(allMessages, message); }),
			getMessages: mock.promise((startFrom: number, quantity: number): IGetMessagesResult => {
				let hasMoreMessages: boolean = startFrom + quantity < allMessages.length;
				return {
					hasMoreMessages: hasMoreMessages,
					messages: <any>_(allMessages).drop(startFrom).take(quantity).value(),
				};
			}),
		};
	});

	function defaultMessages(): string[] {
		return ['1', '2', '3', '4', '5'
			, '6', '7', '8', '9', '10'
			, '11', '12', '13', '14', '15'
			, '16', '17', '18', '19', '20'];
	}

	it('should load an initial page of messages from the server', rlFakeAsync((): void => {
		messageLog.dataService = <any>dataService;

		sinon.assert.calledOnce(dataService.getMessages);
		mock.flushAll(dataService);

		expect(messageLog.visibleMessages).to.have.length(5);
	}));

	describe('after initial request', (): void => {
		beforeEach(rlFakeAsync((): void => {
			messageLog.dataService = <any>dataService;
			mock.flushAll(dataService);
			dataService.getMessages.reset();
		}));

		it('should load the next page from the server if more messages are available', rlFakeAsync((): void => {
			messageLog.getNextPage();
			sinon.assert.calledOnce(dataService.getMessages);
			mock.flushAll(dataService);

			expect(messageLog.visibleMessages[0]).to.equal('6');
			expect(messageLog.visibleMessages[1]).to.equal('7');
			expect(messageLog.visibleMessages[2]).to.equal('8');
			expect(messageLog.visibleMessages[3]).to.equal('9');
			expect(messageLog.visibleMessages[4]).to.equal('10');
		}));

		it('should not load a full page if not enough messages are available', rlFakeAsync((): void => {
			messageLog.pageSize = 15;
			mock.flushAll(dataService);

			expect(messageLog.visibleMessages).to.have.length(15);

			messageLog.getNextPage();

			mock.flushAll(dataService);

			expect(messageLog.visibleMessages).to.have.length(5);
			expect(messageLog.visibleMessages[0]).to.equal('16');
			expect(messageLog.visibleMessages[1]).to.equal('17');
			expect(messageLog.visibleMessages[2]).to.equal('18');
			expect(messageLog.visibleMessages[3]).to.equal('19');
			expect(messageLog.visibleMessages[4]).to.equal('20');
		}));

		it('should refresh the current page when the page size changes', rlFakeAsync((): void => {
			messageLog.pageSize = 10;
			sinon.assert.calledOnce(dataService.getMessages);
			mock.flushAll(dataService);

			expect(messageLog.visibleMessages).to.have.length(10);
		}));

		it('should load a full page when paging back to the beginning even if less than a full page of messages were paged back'
			, rlFakeAsync((): void => {
				messageLog.getNextPage();
				(<any>dataService.getMessages).flush();

				expect(messageLog.visibleMessages[0]).to.equal('6');
				expect(messageLog.visibleMessages[1]).to.equal('7');
				expect(messageLog.visibleMessages[2]).to.equal('8');
				expect(messageLog.visibleMessages[3]).to.equal('9');
				expect(messageLog.visibleMessages[4]).to.equal('10');

				messageLog.pageSize = 10;
				messageLog.getPreviousPage();
				(<any>dataService.getMessages).flush();

				expect(messageLog.visibleMessages.length).to.equal(10);
				expect(messageLog.visibleMessages[0]).to.equal('1');
				expect(messageLog.visibleMessages[1]).to.equal('2');
				expect(messageLog.visibleMessages[2]).to.equal('3');
				expect(messageLog.visibleMessages[3]).to.equal('4');
				expect(messageLog.visibleMessages[4]).to.equal('5');
				expect(messageLog.visibleMessages[5]).to.equal('6');
				expect(messageLog.visibleMessages[6]).to.equal('7');
				expect(messageLog.visibleMessages[7]).to.equal('8');
				expect(messageLog.visibleMessages[8]).to.equal('9');
				expect(messageLog.visibleMessages[9]).to.equal('10');
			}));

		it('should disable paging forward if no more messages are available', rlFakeAsync((): void => {
			messageLog.pageSize = 20;
			mock.flushAll(dataService);
			dataService.getMessages.reset();

			expect(messageLog.hasForwardMessages).to.be.false;

			messageLog.getNextPage();
			sinon.assert.notCalled(dataService.getMessages);
			expect(messageLog.hasForwardMessages).to.be.false;
		}));

		it('should disable paging backward if at the beginning of the log', (): void => {
			expect(messageLog.hasBackwardMessages).to.be.false;

			messageLog.getPreviousPage();
			sinon.assert.notCalled(dataService.getMessages);
			expect(messageLog.hasBackwardMessages).to.be.false;
		});

		it('should load first page when getTopPage is called', rlFakeAsync((): void => {
			messageLog.getNextPage();
			messageLog.getNextPage();
			sinon.assert.calledTwice(dataService.getMessages);
			mock.flushAll(dataService);

			expect(messageLog.visibleMessages).to.have.length(5);
			expect(messageLog.visibleMessages[0]).to.equal('11');
			expect(messageLog.visibleMessages[1]).to.equal('12');
			expect(messageLog.visibleMessages[2]).to.equal('13');
			expect(messageLog.visibleMessages[3]).to.equal('14');
			expect(messageLog.visibleMessages[4]).to.equal('15');

			messageLog.getTopPage();
			sinon.assert.calledThrice(dataService.getMessages);
			mock.flushAll(dataService);

			expect(messageLog.visibleMessages).to.have.length(5);
			expect(messageLog.visibleMessages[0]).to.equal('1');
			expect(messageLog.visibleMessages[1]).to.equal('2');
			expect(messageLog.visibleMessages[2]).to.equal('3');
			expect(messageLog.visibleMessages[3]).to.equal('4');
			expect(messageLog.visibleMessages[4]).to.equal('5');
		}));

		it('should save a new message, add it to the beginning of the log, and display it if on the first page', rlFakeAsync((): void => {
			messageLog.addMessage(<any>'new message');
			sinon.assert.calledOnce(dataService.saveMessage);
			// save request
			mock.flushAll(dataService);
			// reload request
			mock.flushAll(dataService);

			expect(messageLog.visibleMessages[0]).to.equal('new message');
		}));

		it('should delete the message and refresh the current page', rlFakeAsync((): void => {
			messageLog.getNextPage();
			mock.flushAll(dataService);

			expect(messageLog.visibleMessages[0]).to.equal('6');

			messageLog.deleteMessage(messageLog.visibleMessages[0]);

			sinon.assert.calledOnce(dataService.deleteMessage);

			// delete request
			mock.flushAll(dataService);
			// reload request
			mock.flushAll(dataService);

			expect(messageLog.visibleMessages).to.have.length(5);
			expect(messageLog.visibleMessages[0]).to.equal('7');
			expect(messageLog.visibleMessages[1]).to.equal('8');
			expect(messageLog.visibleMessages[2]).to.equal('9');
			expect(messageLog.visibleMessages[3]).to.equal('10');
			expect(messageLog.visibleMessages[4]).to.equal('11');
		}));

		it('should take the user back to the first page if the user adds a new message', rlFakeAsync((): void => {
			messageLog.getNextPage();
			mock.flushAll(dataService);
			dataService.getMessages.reset();

			messageLog.addMessage(<any>'new message');
			sinon.assert.calledOnce(dataService.saveMessage);

			// create request
			mock.flushAll(dataService);
			// reload request
			mock.flushAll(dataService);

			expect(messageLog.visibleMessages).to.have.length(5);
			expect(messageLog.visibleMessages[0]).to.equal('new message');
			expect(messageLog.visibleMessages[1]).to.equal('1');
			expect(messageLog.visibleMessages[2]).to.equal('2');
			expect(messageLog.visibleMessages[3]).to.equal('3');
			expect(messageLog.visibleMessages[4]).to.equal('4');
		}));
	});
});
