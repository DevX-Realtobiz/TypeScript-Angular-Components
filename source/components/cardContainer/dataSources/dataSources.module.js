'use strict';
var angular = require('angular');
var typescript_angular_utilities_1 = require('typescript-angular-utilities');
var sorts_module_1 = require('../sorts/sorts.module');
var clientServerDataSource = require('./clientServerDataSource/clientServerDataSource.service');
exports.clientServerDataSource = clientServerDataSource;
var dataPager = require('./dataPager/dataPager.service');
exports.dataPager = dataPager;
var dataServiceDataSource = require('./dataServiceDataSource/dataServiceDataSource.service');
exports.dataServiceDataSource = dataServiceDataSource;
var serverSideDataSource = require('./serverSideDataSource/serverSideDataSource.service');
exports.serverSideDataSource = serverSideDataSource;
var simpleDataSource = require('./simpleDataSource/simpleDataSource.service');
exports.simpleDataSource = simpleDataSource;
var smartDataSource = require('./smartDataSource/smartDataSource.service');
exports.smartDataSource = smartDataSource;
var events = require('./dataSourceEvents');
exports.events = events;
var dataSourceProcessor = require('./dataSourceProcessor.service');
exports.dataSourceProcessor = dataSourceProcessor;
var dataSourceBase = require('./dataSourceBase.service');
exports.dataSourceBase = dataSourceBase;
exports.moduleName = 'rl.ui.components.cardContainer.dataSources';
angular.module(exports.moduleName, [
    typescript_angular_utilities_1.services.object.moduleName,
    sorts_module_1.moduleName,
    clientServerDataSource.moduleName,
    dataPager.moduleName,
    dataServiceDataSource.moduleName,
    serverSideDataSource.moduleName,
    simpleDataSource.moduleName,
    smartDataSource.moduleName,
])
    .service(dataSourceProcessor.processorServiceName, dataSourceProcessor.DataSourceProcessor);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YVNvdXJjZXMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGF0YVNvdXJjZXMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUViLElBQVksT0FBTyxXQUFNLFNBQVMsQ0FBQyxDQUFBO0FBQ25DLDZDQUF5Qiw4QkFBOEIsQ0FBQyxDQUFBO0FBRXhELDZCQUE4Qyx1QkFBdUIsQ0FBQyxDQUFBO0FBQ3RFLElBQVksc0JBQXNCLFdBQU0seURBQXlELENBQUMsQ0FBQTtBQVdqRyw4QkFBc0I7QUFWdkIsSUFBWSxTQUFTLFdBQU0sK0JBQStCLENBQUMsQ0FBQTtBQVcxRCxpQkFBUztBQVZWLElBQVkscUJBQXFCLFdBQU0sdURBQXVELENBQUMsQ0FBQTtBQVc5Riw2QkFBcUI7QUFWdEIsSUFBWSxvQkFBb0IsV0FBTSxxREFBcUQsQ0FBQyxDQUFBO0FBVzNGLDRCQUFvQjtBQVZyQixJQUFZLGdCQUFnQixXQUFNLDZDQUE2QyxDQUFDLENBQUE7QUFXL0Usd0JBQWdCO0FBVmpCLElBQVksZUFBZSxXQUFNLDJDQUEyQyxDQUFDLENBQUE7QUFXNUUsdUJBQWU7QUFWaEIsSUFBWSxNQUFNLFdBQU0sb0JBQW9CLENBQUMsQ0FBQTtBQVc1QyxjQUFNO0FBVlAsSUFBWSxtQkFBbUIsV0FBTSwrQkFBK0IsQ0FBQyxDQUFBO0FBV3BFLDJCQUFtQjtBQVZwQixJQUFZLGNBQWMsV0FBTSwwQkFBMEIsQ0FBQyxDQUFBO0FBVzFELHNCQUFjO0FBTUosa0JBQVUsR0FBVyw0Q0FBNEMsQ0FBQztBQUU3RSxPQUFPLENBQUMsTUFBTSxDQUFDLGtCQUFVLEVBQUU7SUFDMUIsdUNBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVTtJQUMxQix5QkFBZTtJQUVmLHNCQUFzQixDQUFDLFVBQVU7SUFDakMsU0FBUyxDQUFDLFVBQVU7SUFDcEIscUJBQXFCLENBQUMsVUFBVTtJQUNoQyxvQkFBb0IsQ0FBQyxVQUFVO0lBQy9CLGdCQUFnQixDQUFDLFVBQVU7SUFDM0IsZUFBZSxDQUFDLFVBQVU7Q0FDMUIsQ0FBQztLQUNBLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0IsRUFBRSxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDIn0=