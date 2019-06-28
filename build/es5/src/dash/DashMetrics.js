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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _streamingVoMetricsHTTPRequest=require('../streaming/vo/metrics/HTTPRequest');var _coreFactoryMaker=require('../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _streamingConstantsMetricsConstants=require('../streaming/constants/MetricsConstants');var _streamingConstantsMetricsConstants2=_interopRequireDefault(_streamingConstantsMetricsConstants);var _utilsRound10=require('./utils/Round10');var _utilsRound102=_interopRequireDefault(_utilsRound10); /**
 * @module DashMetrics
 * @param {object} config configuration passed to DashMetrics
 */function DashMetrics(config){config = config || {};var instance=undefined;var dashManifestModel=config.dashManifestModel;var manifestModel=config.manifestModel;function getBandwidthForRepresentation(representationId,periodId){var representation=undefined;var manifest=manifestModel.getValue();var period=manifest.Period_asArray[periodId];representation = findRepresentation(period,representationId);if(representation === null){return null;}return representation.bandwidth;} /**
     *
     * @param {string} representationId
     * @param {number} periodIdx
     * @returns {*}
     */function getIndexForRepresentation(representationId,periodIdx){var representationIndex=undefined;var manifest=manifestModel.getValue();var period=manifest.Period_asArray[periodIdx];representationIndex = findRepresentationIndex(period,representationId);return representationIndex;} /**
     * This method returns the current max index based on what is defined in the MPD.
     *
     * @param {string} bufferType - String 'audio' or 'video',
     * @param {number} periodIdx - Make sure this is the period index not id
     * @return {number}
     * @memberof module:DashMetrics
     * @instance
     */function getMaxIndexForBufferType(bufferType,periodIdx){var maxIndex=undefined;var manifest=manifestModel.getValue();if(!manifest){return -1;}var period=manifest.Period_asArray[periodIdx];maxIndex = findMaxBufferIndex(period,bufferType);return maxIndex;} /**
     * @param {MetricsList} metrics
     * @returns {*}
     * @memberof module:DashMetrics
     * @instance
     */function getCurrentRepresentationSwitch(metrics){return getCurrent(metrics,_streamingConstantsMetricsConstants2['default'].TRACK_SWITCH);} /**
     * @param {MetricsList} metrics
     * @returns {*}
     * @memberof module:DashMetrics
     * @instance
     */function getLatestBufferLevelVO(metrics){return getCurrent(metrics,_streamingConstantsMetricsConstants2['default'].BUFFER_LEVEL);} /**
     * @param {MetricsList} metrics
     * @returns {number}
     * @memberof module:DashMetrics
     * @instance
     */function getCurrentBufferLevel(metrics){var vo=getLatestBufferLevelVO(metrics);if(vo){return _utilsRound102['default'].round10(vo.level / 1000,-3);}return 0;} /**
     * @param {MetricsList} metrics
     * @returns {null|*|vo}
     * @memberof module:DashMetrics
     * @instance
     */function getRequestsQueue(metrics){return metrics?metrics.RequestsQueue:null;} /**
     * @param {MetricsList} metrics
     * @returns {*}
     * @memberof module:DashMetrics
     * @instance
     */function getCurrentHttpRequest(metrics){if(!metrics){return null;}var httpList=metrics.HttpList;var currentHttpList=null;var httpListLength=undefined,httpListLastIndex=undefined;if(!httpList || httpList.length <= 0){return null;}httpListLength = httpList.length;httpListLastIndex = httpListLength - 1;while(httpListLastIndex >= 0) {if(httpList[httpListLastIndex].responsecode){currentHttpList = httpList[httpListLastIndex];break;}httpListLastIndex--;}return currentHttpList;} /**
     * @param {MetricsList} metrics
     * @returns {*}
     * @memberof module:DashMetrics
     * @instance
     */function getHttpRequests(metrics){if(!metrics){return [];}return !!metrics.HttpList?metrics.HttpList:[];} /**
     * @param {MetricsList} metrics
     * @param {string} metricName
     * @returns {*}
     * @memberof module:DashMetrics
     * @instance
     */function getCurrent(metrics,metricName){if(!metrics){return null;}var list=metrics[metricName];if(!list){return null;}var length=list.length;if(length <= 0){return null;}return list[length - 1];} /**
     * @param {MetricsList} metrics
     * @returns {*}
     * @memberof module:DashMetrics
     * @instance
     */function getCurrentDroppedFrames(metrics){return getCurrent(metrics,_streamingConstantsMetricsConstants2['default'].DROPPED_FRAMES);} /**
     * @param {MetricsList} metrics
     * @returns {*}
     * @memberof module:DashMetrics
     * @instance
     */function getCurrentSchedulingInfo(metrics){return getCurrent(metrics,_streamingConstantsMetricsConstants2['default'].SCHEDULING_INFO);} /**
     * @param {MetricsList} metrics
     * @returns {*}
     * @memberof module:DashMetrics
     * @instance
     */function getCurrentManifestUpdate(metrics){return getCurrent(metrics,_streamingConstantsMetricsConstants2['default'].MANIFEST_UPDATE);} /**
     * @param {MetricsList} metrics
     * @returns {*}
     * @memberof module:DashMetrics
     * @instance
     */function getCurrentDVRInfo(metrics){return getCurrent(metrics,_streamingConstantsMetricsConstants2['default'].DVR_INFO);} /**
     * @param {MetricsList} metrics
     * @param {string} id
     * @returns {*}
     * @memberof module:DashMetrics
     * @instance
     */function getLatestMPDRequestHeaderValueByID(metrics,id){var headers={};var httpRequestList=undefined,httpRequest=undefined,i=undefined;httpRequestList = getHttpRequests(metrics);for(i = httpRequestList.length - 1;i >= 0;i--) {httpRequest = httpRequestList[i];if(httpRequest.type === _streamingVoMetricsHTTPRequest.HTTPRequest.MPD_TYPE){headers = parseResponseHeaders(httpRequest._responseHeaders);break;}}return headers[id] === undefined?null:headers[id];} /**
     * @param {MetricsList} metrics
     * @param {string} id
     * @returns {*}
     * @memberof module:DashMetrics
     * @instance
     */function getLatestFragmentRequestHeaderValueByID(metrics,id){var headers={};var httpRequest=getCurrentHttpRequest(metrics);if(httpRequest){headers = parseResponseHeaders(httpRequest._responseHeaders);}return headers[id] === undefined?null:headers[id];}function parseResponseHeaders(headerStr){var headers={};if(!headerStr){return headers;} // Trim headerStr to fix a MS Edge bug with xhr.getAllResponseHeaders method
// which send a string starting with a "\n" character
var headerPairs=headerStr.trim().split('\r\n');for(var i=0,ilen=headerPairs.length;i < ilen;i++) {var headerPair=headerPairs[i];var index=headerPair.indexOf(': ');if(index > 0){headers[headerPair.substring(0,index)] = headerPair.substring(index + 2);}}return headers;}function findRepresentationIndex(period,representationId){var index=findRepresentation(period,representationId,true);if(index !== null){return index;}return -1;}function findRepresentation(period,representationId,returnIndex){var adaptationSet=undefined,adaptationSetArray=undefined,representation=undefined,representationArray=undefined,adaptationSetArrayIndex=undefined,representationArrayIndex=undefined;if(period){adaptationSetArray = period.AdaptationSet_asArray;for(adaptationSetArrayIndex = 0;adaptationSetArrayIndex < adaptationSetArray.length;adaptationSetArrayIndex = adaptationSetArrayIndex + 1) {adaptationSet = adaptationSetArray[adaptationSetArrayIndex];representationArray = adaptationSet.Representation_asArray;for(representationArrayIndex = 0;representationArrayIndex < representationArray.length;representationArrayIndex = representationArrayIndex + 1) {representation = representationArray[representationArrayIndex];if(representationId === representation.id){if(returnIndex){return representationArrayIndex;}else {return representation;}}}}}return null;}function adaptationIsType(adaptation,bufferType){return dashManifestModel.getIsTypeOf(adaptation,bufferType);}function findMaxBufferIndex(period,bufferType){var adaptationSet=undefined,adaptationSetArray=undefined,representationArray=undefined,adaptationSetArrayIndex=undefined;if(!period || !bufferType)return -1;adaptationSetArray = period.AdaptationSet_asArray;for(adaptationSetArrayIndex = 0;adaptationSetArrayIndex < adaptationSetArray.length;adaptationSetArrayIndex = adaptationSetArrayIndex + 1) {adaptationSet = adaptationSetArray[adaptationSetArrayIndex];representationArray = adaptationSet.Representation_asArray;if(adaptationIsType(adaptationSet,bufferType)){return representationArray.length;}}return -1;}instance = {getBandwidthForRepresentation:getBandwidthForRepresentation,getIndexForRepresentation:getIndexForRepresentation,getMaxIndexForBufferType:getMaxIndexForBufferType,getCurrentRepresentationSwitch:getCurrentRepresentationSwitch,getLatestBufferLevelVO:getLatestBufferLevelVO,getCurrentBufferLevel:getCurrentBufferLevel,getCurrentHttpRequest:getCurrentHttpRequest,getHttpRequests:getHttpRequests,getCurrentDroppedFrames:getCurrentDroppedFrames,getCurrentSchedulingInfo:getCurrentSchedulingInfo,getCurrentDVRInfo:getCurrentDVRInfo,getCurrentManifestUpdate:getCurrentManifestUpdate,getLatestFragmentRequestHeaderValueByID:getLatestFragmentRequestHeaderValueByID,getLatestMPDRequestHeaderValueByID:getLatestMPDRequestHeaderValueByID,getRequestsQueue:getRequestsQueue};return instance;}DashMetrics.__dashjs_factory_name = 'DashMetrics';exports['default'] = _coreFactoryMaker2['default'].getSingletonFactory(DashMetrics);module.exports = exports['default'];
//# sourceMappingURL=DashMetrics.js.map
