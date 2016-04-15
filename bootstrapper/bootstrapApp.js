"use strict";
var ui_module_1 = require('../source/ui.module');
var inputsTemplate = require('./inputs/inputs.html');
var buttonsTemplate = require('./buttons/buttons.html');
var popupTemplate = require('./popup/popup.html');
var cardsTemplate = require('./cards/cards.html');
var tabsTemplate = require('./tabs/tabs.html');
var formsTemplate = require('./forms/forms.html');
var messageLogTemplate = require('./messageLog/messageLogTest.html');
var miscTemplate = require('./misc/misc.html');
angular.module('app', [ui_module_1.moduleName, 'ui.router'])
    .config(RouteConfig);
RouteConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
function RouteConfig($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/', {
        url: '/',
        template: '<h3>Welcome to typescript-angular-components</h3>',
    })
        .state('inputs', {
        url: '/inputs',
        template: inputsTemplate,
        controller: 'InputTestController',
        controllerAs: 'input',
    })
        .state('buttons', {
        url: '/buttons',
        template: buttonsTemplate,
        controller: 'ButtonTestController',
        controllerAs: 'button',
    })
        .state('popup', {
        url: '/popup',
        template: popupTemplate,
        controller: 'PopupTestController',
        controllerAs: 'popup',
    })
        .state('cards', {
        url: '/cards',
        template: cardsTemplate,
        controller: 'CardTestController',
        controllerAs: 'cards',
    })
        .state('tabs', {
        url: '/tabs',
        template: tabsTemplate,
        controller: 'TabTestController',
        controllerAs: 'tabs',
    })
        .state('forms', {
        url: '/forms',
        template: formsTemplate,
        controller: 'FormTestController',
        controllerAs: 'forms',
    })
        .state('messageLog', {
        url: '/messageLog',
        template: messageLogTemplate,
        controller: 'MessageLogTestController',
        controllerAs: 'messageLog',
    })
        .state('misc', {
        url: '/misc',
        template: miscTemplate,
        controller: 'MiscTestController',
        controllerAs: 'misc',
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYm9vdHN0cmFwQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQkFBK0MscUJBQXFCLENBQUMsQ0FBQTtBQUVyRSxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUN2RCxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUMxRCxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNwRCxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNwRCxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNqRCxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNwRCxJQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0FBQ3ZFLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRWpELE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsc0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDcEQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRXRCLFdBQVcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQy9ELHFCQUFxQixrQkFBa0IsRUFBRSxjQUFjO0lBQ3RELGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQyxjQUFjO1NBQ1osS0FBSyxDQUFDLEdBQUcsRUFBRTtRQUNYLEdBQUcsRUFBRSxHQUFHO1FBQ1IsUUFBUSxFQUFFLG1EQUFtRDtLQUM3RCxDQUFDO1NBQ0QsS0FBSyxDQUFDLFFBQVEsRUFBRTtRQUNoQixHQUFHLEVBQUUsU0FBUztRQUNkLFFBQVEsRUFBRSxjQUFjO1FBQ3hCLFVBQVUsRUFBRSxxQkFBcUI7UUFDakMsWUFBWSxFQUFFLE9BQU87S0FDckIsQ0FBQztTQUNELEtBQUssQ0FBQyxTQUFTLEVBQUU7UUFDakIsR0FBRyxFQUFFLFVBQVU7UUFDZixRQUFRLEVBQUUsZUFBZTtRQUN6QixVQUFVLEVBQUUsc0JBQXNCO1FBQ2xDLFlBQVksRUFBRSxRQUFRO0tBQ3RCLENBQUM7U0FDRCxLQUFLLENBQUMsT0FBTyxFQUFFO1FBQ2YsR0FBRyxFQUFFLFFBQVE7UUFDYixRQUFRLEVBQUUsYUFBYTtRQUN2QixVQUFVLEVBQUUscUJBQXFCO1FBQ2pDLFlBQVksRUFBRSxPQUFPO0tBQ3JCLENBQUM7U0FDRCxLQUFLLENBQUMsT0FBTyxFQUFFO1FBQ2YsR0FBRyxFQUFFLFFBQVE7UUFDYixRQUFRLEVBQUUsYUFBYTtRQUN2QixVQUFVLEVBQUUsb0JBQW9CO1FBQ2hDLFlBQVksRUFBRSxPQUFPO0tBQ3JCLENBQUM7U0FDRCxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQ2QsR0FBRyxFQUFFLE9BQU87UUFDWixRQUFRLEVBQUUsWUFBWTtRQUN0QixVQUFVLEVBQUUsbUJBQW1CO1FBQy9CLFlBQVksRUFBRSxNQUFNO0tBQ3BCLENBQUM7U0FDRCxLQUFLLENBQUMsT0FBTyxFQUFFO1FBQ2YsR0FBRyxFQUFFLFFBQVE7UUFDYixRQUFRLEVBQUUsYUFBYTtRQUN2QixVQUFVLEVBQUUsb0JBQW9CO1FBQ2hDLFlBQVksRUFBRSxPQUFPO0tBQ3JCLENBQUM7U0FDRCxLQUFLLENBQUMsWUFBWSxFQUFFO1FBQ3BCLEdBQUcsRUFBRSxhQUFhO1FBQ2xCLFFBQVEsRUFBRSxrQkFBa0I7UUFDNUIsVUFBVSxFQUFFLDBCQUEwQjtRQUN0QyxZQUFZLEVBQUUsWUFBWTtLQUMxQixDQUFDO1NBQ0QsS0FBSyxDQUFDLE1BQU0sRUFBRTtRQUNkLEdBQUcsRUFBRSxPQUFPO1FBQ1osUUFBUSxFQUFFLFlBQVk7UUFDdEIsVUFBVSxFQUFFLG9CQUFvQjtRQUNoQyxZQUFZLEVBQUUsTUFBTTtLQUNwQixDQUFDLENBQUM7QUFDTCxDQUFDIn0=