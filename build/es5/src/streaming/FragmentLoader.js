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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _netHTTPLoader=require('./net/HTTPLoader');var _netHTTPLoader2=_interopRequireDefault(_netHTTPLoader);var _voHeadRequest=require('./vo/HeadRequest');var _voHeadRequest2=_interopRequireDefault(_voHeadRequest);var _voDashJSError=require('./vo/DashJSError');var _voDashJSError2=_interopRequireDefault(_voDashJSError);var _coreEventBus=require('./../core/EventBus');var _coreEventBus2=_interopRequireDefault(_coreEventBus);var _coreEventsEvents=require('./../core/events/Events');var _coreEventsEvents2=_interopRequireDefault(_coreEventsEvents);var _coreFactoryMaker=require('../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var FRAGMENT_LOADER_ERROR_LOADING_FAILURE=1;var FRAGMENT_LOADER_ERROR_NULL_REQUEST=2;var FRAGMENT_LOADER_MESSAGE_NULL_REQUEST='request is null';function FragmentLoader(config){config = config || {};var context=this.context;var eventBus=(0,_coreEventBus2['default'])(context).getInstance();var instance=undefined,httpLoader=undefined;function setup(){httpLoader = (0,_netHTTPLoader2['default'])(context).create({errHandler:config.errHandler,metricsModel:config.metricsModel,mediaPlayerModel:config.mediaPlayerModel,requestModifier:config.requestModifier,useFetch:config.mediaPlayerModel.getLowLatencyEnabled()});}function checkForExistence(request){var report=function report(success){eventBus.trigger(_coreEventsEvents2['default'].CHECK_FOR_EXISTENCE_COMPLETED,{request:request,exists:success});};if(request){var headRequest=new _voHeadRequest2['default'](request.url);httpLoader.load({request:headRequest,success:function success(){report(true);},error:function error(){report(false);}});}else {report(false);}}function load(request){var report=function report(data,error){eventBus.trigger(_coreEventsEvents2['default'].LOADING_COMPLETED,{request:request,response:data || null,error:error || null,sender:instance});};if(request){httpLoader.load({request:request,progress:function progress(event){eventBus.trigger(_coreEventsEvents2['default'].LOADING_PROGRESS,{request:request});if(event.data){eventBus.trigger(_coreEventsEvents2['default'].LOADING_DATA_PROGRESS,{request:request,response:event.data || null,error:null,sender:instance});}},success:function success(data){report(data);},error:function error(request,statusText,errorText){report(undefined,new _voDashJSError2['default'](FRAGMENT_LOADER_ERROR_LOADING_FAILURE,errorText,statusText));},abort:function abort(request){if(request){eventBus.trigger(_coreEventsEvents2['default'].LOADING_ABANDONED,{request:request,mediaType:request.mediaType,sender:instance});}}});}else {report(undefined,new _voDashJSError2['default'](FRAGMENT_LOADER_ERROR_NULL_REQUEST,FRAGMENT_LOADER_MESSAGE_NULL_REQUEST));}}function abort(){if(httpLoader){httpLoader.abort();}}function reset(){if(httpLoader){httpLoader.abort();httpLoader = null;}}instance = {checkForExistence:checkForExistence,load:load,abort:abort,reset:reset};setup();return instance;}FragmentLoader.__dashjs_factory_name = 'FragmentLoader';var factory=_coreFactoryMaker2['default'].getClassFactory(FragmentLoader);factory.FRAGMENT_LOADER_ERROR_LOADING_FAILURE = FRAGMENT_LOADER_ERROR_LOADING_FAILURE;factory.FRAGMENT_LOADER_ERROR_NULL_REQUEST = FRAGMENT_LOADER_ERROR_NULL_REQUEST;_coreFactoryMaker2['default'].updateClassFactory(FragmentLoader.__dashjs_factory_name,factory);exports['default'] = factory;module.exports = exports['default'];
//# sourceMappingURL=FragmentLoader.js.map
