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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _voDashJSError=require('./vo/DashJSError');var _voDashJSError2=_interopRequireDefault(_voDashJSError);var _netHTTPLoader=require('./net/HTTPLoader');var _netHTTPLoader2=_interopRequireDefault(_netHTTPLoader);var _voMetricsHTTPRequest=require('./vo/metrics/HTTPRequest');var _voTextRequest=require('./vo/TextRequest');var _voTextRequest2=_interopRequireDefault(_voTextRequest);var _coreEventBus=require('../core/EventBus');var _coreEventBus2=_interopRequireDefault(_coreEventBus);var _coreEventsEvents=require('../core/events/Events');var _coreEventsEvents2=_interopRequireDefault(_coreEventsEvents);var _coreFactoryMaker=require('../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var XLINK_LOADER_ERROR_LOADING_FAILURE=1;function XlinkLoader(config){config = config || {};var RESOLVE_TO_ZERO='urn:mpeg:dash:resolve-to-zero:2013';var context=this.context;var eventBus=(0,_coreEventBus2['default'])(context).getInstance();var httpLoader=(0,_netHTTPLoader2['default'])(context).create({errHandler:config.errHandler,metricsModel:config.metricsModel,mediaPlayerModel:config.mediaPlayerModel,requestModifier:config.requestModifier});var instance=undefined;function load(url,element,resolveObject){var report=function report(content,resolveToZero){element.resolved = true;element.resolvedContent = content?content:null;eventBus.trigger(_coreEventsEvents2['default'].XLINK_ELEMENT_LOADED,{element:element,resolveObject:resolveObject,error:content || resolveToZero?null:new _voDashJSError2['default'](XLINK_LOADER_ERROR_LOADING_FAILURE,'Failed loading Xlink element: ' + url)});};if(url === RESOLVE_TO_ZERO){report(null,true);}else {var request=new _voTextRequest2['default'](url,_voMetricsHTTPRequest.HTTPRequest.XLINK_TYPE);httpLoader.load({request:request,success:function success(data){report(data);},error:function error(){report(null);}});}}function reset(){if(httpLoader){httpLoader.abort();httpLoader = null;}}instance = {load:load,reset:reset};return instance;}XlinkLoader.__dashjs_factory_name = 'XlinkLoader';var factory=_coreFactoryMaker2['default'].getClassFactory(XlinkLoader);factory.XLINK_LOADER_ERROR_LOADING_FAILURE = XLINK_LOADER_ERROR_LOADING_FAILURE;_coreFactoryMaker2['default'].updateClassFactory(XlinkLoader.__dashjs_factory_name,factory);exports['default'] = factory;module.exports = exports['default'];
//# sourceMappingURL=XlinkLoader.js.map
