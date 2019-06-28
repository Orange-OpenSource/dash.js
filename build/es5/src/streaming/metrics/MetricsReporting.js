/**
 * The copyright in this software is being made available under the BSD License,
 * included below. This software may be subject to other third party and contributor
 * rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Dash Industry Forum.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation and/or
 *  other materials provided with the distribution.
 *  * Neither the name of Dash Industry Forum nor the names of its
 *  contributors may be used to endorse or promote products derived from this software
 *  without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 *  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _utilsDVBErrorsTranslator=require('./utils/DVBErrorsTranslator');var _utilsDVBErrorsTranslator2=_interopRequireDefault(_utilsDVBErrorsTranslator);var _MetricsReportingEvents=require('./MetricsReportingEvents');var _MetricsReportingEvents2=_interopRequireDefault(_MetricsReportingEvents);var _controllersMetricsCollectionController=require('./controllers/MetricsCollectionController');var _controllersMetricsCollectionController2=_interopRequireDefault(_controllersMetricsCollectionController);var _metricsMetricsHandlerFactory=require('./metrics/MetricsHandlerFactory');var _metricsMetricsHandlerFactory2=_interopRequireDefault(_metricsMetricsHandlerFactory);var _reportingReportingFactory=require('./reporting/ReportingFactory');var _reportingReportingFactory2=_interopRequireDefault(_reportingReportingFactory);function MetricsReporting(){var context=this.context;var instance=undefined;var dvbErrorsTranslator=undefined; /**
     * Create a MetricsCollectionController, and a DVBErrorsTranslator
     * @param {Object} config - dependancies from owner
     * @return {MetricsCollectionController} Metrics Collection Controller
     */function createMetricsReporting(config){dvbErrorsTranslator = (0,_utilsDVBErrorsTranslator2['default'])(context).getInstance({eventBus:config.eventBus,metricsModel:config.metricsModel,metricsConstants:config.metricsConstants,events:config.events});return (0,_controllersMetricsCollectionController2['default'])(context).create(config);} /**
     * Get the ReportingFactory to allow new reporters to be registered
     * @return {ReportingFactory} Reporting Factory
     */function getReportingFactory(){return (0,_reportingReportingFactory2['default'])(context).getInstance();} /**
     * Get the MetricsHandlerFactory to allow new handlers to be registered
     * @return {MetricsHandlerFactory} Metrics Handler Factory
     */function getMetricsHandlerFactory(){return (0,_metricsMetricsHandlerFactory2['default'])(context).getInstance();}instance = {createMetricsReporting:createMetricsReporting,getReportingFactory:getReportingFactory,getMetricsHandlerFactory:getMetricsHandlerFactory};return instance;}MetricsReporting.__dashjs_factory_name = 'MetricsReporting';var factory=dashjs.FactoryMaker.getClassFactory(MetricsReporting); /* jshint ignore:line */factory.events = _MetricsReportingEvents2['default'];dashjs.FactoryMaker.updateClassFactory(MetricsReporting.__dashjs_factory_name,factory); /* jshint ignore:line */exports['default'] = factory;module.exports = exports['default'];
//# sourceMappingURL=MetricsReporting.js.map
