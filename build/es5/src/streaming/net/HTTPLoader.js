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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else {obj[key] = value;}return obj;}var _XHRLoader=require('./XHRLoader');var _XHRLoader2=_interopRequireDefault(_XHRLoader);var _FetchLoader=require('./FetchLoader');var _FetchLoader2=_interopRequireDefault(_FetchLoader);var _voMetricsHTTPRequest=require('../vo/metrics/HTTPRequest');var _coreFactoryMaker=require('../../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _utilsErrorHandler=require('../utils/ErrorHandler');var _utilsErrorHandler2=_interopRequireDefault(_utilsErrorHandler); /**
 * @module HTTPLoader
 * @description Manages download of resources via HTTP.
 * @param {Object} cfg - dependancies from parent
 */function HTTPLoader(cfg){cfg = cfg || {};var context=this.context;var errHandler=cfg.errHandler;var metricsModel=cfg.metricsModel;var mediaPlayerModel=cfg.mediaPlayerModel;var requestModifier=cfg.requestModifier;var useFetch=cfg.useFetch || false;var instance=undefined;var requests=undefined;var delayedRequests=undefined;var retryTimers=undefined;var downloadErrorToRequestTypeMap=undefined;function setup(){var _downloadErrorToRequestTypeMap;requests = [];delayedRequests = [];retryTimers = [];downloadErrorToRequestTypeMap = (_downloadErrorToRequestTypeMap = {},_defineProperty(_downloadErrorToRequestTypeMap,_voMetricsHTTPRequest.HTTPRequest.MPD_TYPE,_utilsErrorHandler2['default'].DOWNLOAD_ERROR_ID_MANIFEST),_defineProperty(_downloadErrorToRequestTypeMap,_voMetricsHTTPRequest.HTTPRequest.XLINK_EXPANSION_TYPE,_utilsErrorHandler2['default'].DOWNLOAD_ERROR_ID_XLINK),_defineProperty(_downloadErrorToRequestTypeMap,_voMetricsHTTPRequest.HTTPRequest.INIT_SEGMENT_TYPE,_utilsErrorHandler2['default'].DOWNLOAD_ERROR_ID_INITIALIZATION),_defineProperty(_downloadErrorToRequestTypeMap,_voMetricsHTTPRequest.HTTPRequest.MEDIA_SEGMENT_TYPE,_utilsErrorHandler2['default'].DOWNLOAD_ERROR_ID_CONTENT),_defineProperty(_downloadErrorToRequestTypeMap,_voMetricsHTTPRequest.HTTPRequest.INDEX_SEGMENT_TYPE,_utilsErrorHandler2['default'].DOWNLOAD_ERROR_ID_CONTENT),_defineProperty(_downloadErrorToRequestTypeMap,_voMetricsHTTPRequest.HTTPRequest.BITSTREAM_SWITCHING_SEGMENT_TYPE,_utilsErrorHandler2['default'].DOWNLOAD_ERROR_ID_CONTENT),_defineProperty(_downloadErrorToRequestTypeMap,_voMetricsHTTPRequest.HTTPRequest.OTHER_TYPE,_utilsErrorHandler2['default'].DOWNLOAD_ERROR_ID_CONTENT),_downloadErrorToRequestTypeMap);}function internalLoad(config,remainingAttempts){var request=config.request;var traces=[];var firstProgress=true;var needFailureReport=true;var requestStartTime=new Date();var lastTraceTime=requestStartTime;var lastTraceReceivedCount=0;var httpRequest=undefined;if(!requestModifier || !metricsModel || !errHandler){throw new Error('config object is not correct or missing');}var handleLoaded=function handleLoaded(success){needFailureReport = false;request.requestStartDate = requestStartTime;request.requestEndDate = new Date();request.firstByteDate = request.firstByteDate || requestStartTime;if(!request.checkExistenceOnly){metricsModel.addHttpRequest(request.mediaType,null,request.type,request.url,httpRequest.response?httpRequest.response.responseURL:null,request.serviceLocation || null,request.range || null,request.requestStartDate,request.firstByteDate,request.requestEndDate,httpRequest.response?httpRequest.response.status:null,request.duration,httpRequest.response && httpRequest.response.getAllResponseHeaders?httpRequest.response.getAllResponseHeaders():httpRequest.response.responseHeaders,success?traces:null);}};var onloadend=function onloadend(){if(requests.indexOf(httpRequest) === -1){return;}else {requests.splice(requests.indexOf(httpRequest),1);}if(needFailureReport){handleLoaded(false);if(remainingAttempts > 0){remainingAttempts--;retryTimers.push(setTimeout(function(){internalLoad(config,remainingAttempts);},mediaPlayerModel.getRetryIntervalForType(request.type)));}else {errHandler.downloadError(downloadErrorToRequestTypeMap[request.type],request.url,request);if(config.error){config.error(request,'error',httpRequest.response.statusText);}if(config.complete){config.complete(request,httpRequest.response.statusText);}}}};var progress=function progress(event){var currentTime=new Date();if(firstProgress){firstProgress = false;if(!event.lengthComputable || event.lengthComputable && event.total !== event.loaded){request.firstByteDate = currentTime;}}if(event.lengthComputable){request.bytesLoaded = event.loaded;request.bytesTotal = event.total;}if(!event.noTrace){traces.push({s:lastTraceTime,d:event.time?event.time:currentTime.getTime() - lastTraceTime.getTime(),b:[event.loaded?event.loaded - lastTraceReceivedCount:0]});lastTraceTime = currentTime;lastTraceReceivedCount = event.loaded;}if(config.progress && event){config.progress(event);}};var onload=function onload(){if(httpRequest.response.status >= 200 && httpRequest.response.status <= 299){handleLoaded(true);if(config.success){config.success(httpRequest.response.response,httpRequest.response.statusText,httpRequest.response.responseURL);}if(config.complete){config.complete(request,httpRequest.response.statusText);}}};var onabort=function onabort(){if(config.abort){config.abort(request);}};var loader=undefined;if(useFetch && window.fetch && request.responseType === 'arraybuffer'){loader = (0,_FetchLoader2['default'])(context).create({requestModifier:requestModifier});}else {loader = (0,_XHRLoader2['default'])(context).create({requestModifier:requestModifier});}var modifiedUrl=requestModifier.modifyRequestURL(request.url);var verb=request.checkExistenceOnly?_voMetricsHTTPRequest.HTTPRequest.HEAD:_voMetricsHTTPRequest.HTTPRequest.GET;var withCredentials=mediaPlayerModel.getXHRWithCredentialsForType(request.type);httpRequest = {url:modifiedUrl,method:verb,withCredentials:withCredentials,request:request,onload:onload,onend:onloadend,onerror:onloadend,progress:progress,onabort:onabort,loader:loader}; // Adds the ability to delay single fragment loading time to control buffer.
var now=new Date().getTime();if(isNaN(request.delayLoadingTime) || now >= request.delayLoadingTime){ // no delay - just send
requests.push(httpRequest);loader.load(httpRequest);}else {(function(){ // delay
var delayedRequest={httpRequest:httpRequest};delayedRequests.push(delayedRequest);delayedRequest.delayTimeout = setTimeout(function(){if(delayedRequests.indexOf(delayedRequest) === -1){return;}else {delayedRequests.splice(delayedRequests.indexOf(delayedRequest),1);}try{requestStartTime = new Date();lastTraceTime = requestStartTime;requests.push(delayedRequest.httpRequest);loader.load(delayedRequest.httpRequest);}catch(e) {delayedRequest.httpRequest.onerror();}},request.delayLoadingTime - now);})();}} /**
     * Initiates a download of the resource described by config.request
     * @param {Object} config - contains request (FragmentRequest or derived type), and callbacks
     * @memberof module:HTTPLoader
     * @instance
     */function load(config){if(config.request){internalLoad(config,mediaPlayerModel.getRetryAttemptsForType(config.request.type));}} /**
     * Aborts any inflight downloads
     * @memberof module:HTTPLoader
     * @instance
     */function abort(){retryTimers.forEach(function(t){return clearTimeout(t);});retryTimers = [];delayedRequests.forEach(function(x){return clearTimeout(x.delayTimeout);});delayedRequests = [];requests.forEach(function(x){ // abort will trigger onloadend which we don't want
// when deliberately aborting inflight requests -
// set them to undefined so they are not called
x.onloadend = x.onerror = x.onprogress = undefined;x.loader.abort(x);x.onabort();});requests = [];}instance = {load:load,abort:abort};setup();return instance;}HTTPLoader.__dashjs_factory_name = 'HTTPLoader';var factory=_coreFactoryMaker2['default'].getClassFactory(HTTPLoader);exports['default'] = factory;module.exports = exports['default'];
//# sourceMappingURL=HTTPLoader.js.map
