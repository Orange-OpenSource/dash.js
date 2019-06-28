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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _handlersBufferLevelHandler=require('./handlers/BufferLevelHandler');var _handlersBufferLevelHandler2=_interopRequireDefault(_handlersBufferLevelHandler);var _handlersDVBErrorsHandler=require('./handlers/DVBErrorsHandler');var _handlersDVBErrorsHandler2=_interopRequireDefault(_handlersDVBErrorsHandler);var _handlersHttpListHandler=require('./handlers/HttpListHandler');var _handlersHttpListHandler2=_interopRequireDefault(_handlersHttpListHandler);var _handlersGenericMetricHandler=require('./handlers/GenericMetricHandler');var _handlersGenericMetricHandler2=_interopRequireDefault(_handlersGenericMetricHandler);function MetricsHandlerFactory(config){config = config || {};var instance=undefined;var debug=config.debug; // group 1: key, [group 3: n [, group 5: type]]
var keyRegex=/([a-zA-Z]*)(\(([0-9]*)(\,\s*([a-zA-Z]*))?\))?/;var context=this.context;var knownFactoryProducts={BufferLevel:_handlersBufferLevelHandler2['default'],DVBErrors:_handlersDVBErrorsHandler2['default'],HttpList:_handlersHttpListHandler2['default'],PlayList:_handlersGenericMetricHandler2['default'],RepSwitchList:_handlersGenericMetricHandler2['default'],TcpList:_handlersGenericMetricHandler2['default']};function create(listType,reportingController){var matches=listType.match(keyRegex);var handler;if(!matches){return;}try{handler = knownFactoryProducts[matches[1]](context).create({eventBus:config.eventBus,metricsConstants:config.metricsConstants});handler.initialize(matches[1],reportingController,matches[3],matches[5]);}catch(e) {handler = null;debug.error('MetricsHandlerFactory: Could not create handler for type ' + matches[1] + ' with args ' + matches[3] + ', ' + matches[5] + ' (' + e.message + ')');}return handler;}function register(key,handler){knownFactoryProducts[key] = handler;}function unregister(key){delete knownFactoryProducts[key];}instance = {create:create,register:register,unregister:unregister};return instance;}MetricsHandlerFactory.__dashjs_factory_name = 'MetricsHandlerFactory';exports['default'] = dashjs.FactoryMaker.getSingletonFactory(MetricsHandlerFactory); /* jshint ignore:line */module.exports = exports['default'];
//# sourceMappingURL=MetricsHandlerFactory.js.map
