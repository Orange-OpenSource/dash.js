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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _controllersBufferController=require('../../controllers/BufferController');var _controllersBufferController2=_interopRequireDefault(_controllersBufferController);var _coreEventBus=require('../../../core/EventBus');var _coreEventBus2=_interopRequireDefault(_coreEventBus);var _coreEventsEvents=require('../../../core/events/Events');var _coreEventsEvents2=_interopRequireDefault(_coreEventsEvents);var _coreFactoryMaker=require('../../../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _coreDebug=require('../../../core/Debug');var _coreDebug2=_interopRequireDefault(_coreDebug);var _SwitchRequest=require('../SwitchRequest');var _SwitchRequest2=_interopRequireDefault(_SwitchRequest);function InsufficientBufferRule(config){config = config || {};var INSUFFICIENT_BUFFER_SAFETY_FACTOR=0.5;var context=this.context;var eventBus=(0,_coreEventBus2['default'])(context).getInstance();var metricsModel=config.metricsModel;var dashMetrics=config.dashMetrics;var instance=undefined,logger=undefined,bufferStateDict=undefined;function setup(){logger = (0,_coreDebug2['default'])(context).getInstance().getLogger(instance);resetInitialSettings();eventBus.on(_coreEventsEvents2['default'].PLAYBACK_SEEKING,onPlaybackSeeking,instance);}function checkConfig(){if(!metricsModel || !metricsModel.hasOwnProperty('getReadOnlyMetricsFor') || !dashMetrics || !dashMetrics.hasOwnProperty('getCurrentBufferLevel')){throw new Error('Missing config parameter(s)');}} /*
     * InsufficientBufferRule does not kick in before the first BUFFER_LOADED event happens. This is reset at every seek.
     *
     * If a BUFFER_EMPTY event happens, then InsufficientBufferRule returns switchRequest.quality=0 until BUFFER_LOADED happens.
     *
     * Otherwise InsufficientBufferRule gives a maximum bitrate depending on throughput and bufferLevel such that
     * a whole fragment can be downloaded before the buffer runs out, subject to a conservative safety factor of 0.5.
     * If the bufferLevel is low, then InsufficientBufferRule avoids rebuffering risk.
     * If the bufferLevel is high, then InsufficientBufferRule give a high MaxIndex allowing other rules to take over.
     */function getMaxIndex(rulesContext){var switchRequest=(0,_SwitchRequest2['default'])(context).create();if(!rulesContext || !rulesContext.hasOwnProperty('getMediaType')){return switchRequest;}checkConfig();var mediaType=rulesContext.getMediaType();var metrics=metricsModel.getReadOnlyMetricsFor(mediaType);var lastBufferStateVO=metrics.BufferState.length > 0?metrics.BufferState[metrics.BufferState.length - 1]:null;var representationInfo=rulesContext.getRepresentationInfo();var fragmentDuration=representationInfo.fragmentDuration; // Don't ask for a bitrate change if there is not info about buffer state or if fragmentDuration is not defined
if(!lastBufferStateVO || !wasFirstBufferLoadedEventTriggered(mediaType,lastBufferStateVO) || !fragmentDuration){return switchRequest;}if(lastBufferStateVO.state === _controllersBufferController2['default'].BUFFER_EMPTY){logger.info('Switch to index 0; buffer is empty.');switchRequest.quality = 0;switchRequest.reason = 'InsufficientBufferRule: Buffer is empty';}else {var mediaInfo=rulesContext.getMediaInfo();var abrController=rulesContext.getAbrController();var throughputHistory=abrController.getThroughputHistory();var bufferLevel=dashMetrics.getCurrentBufferLevel(metrics);var throughput=throughputHistory.getAverageThroughput(mediaType);var latency=throughputHistory.getAverageLatency(mediaType);var bitrate=throughput * (bufferLevel / fragmentDuration) * INSUFFICIENT_BUFFER_SAFETY_FACTOR;switchRequest.quality = abrController.getQualityForBitrate(mediaInfo,bitrate,latency);switchRequest.reason = 'InsufficientBufferRule: being conservative to avoid immediate rebuffering';}return switchRequest;}function wasFirstBufferLoadedEventTriggered(mediaType,currentBufferState){bufferStateDict[mediaType] = bufferStateDict[mediaType] || {};var wasTriggered=false;if(bufferStateDict[mediaType].firstBufferLoadedEvent){wasTriggered = true;}else if(currentBufferState && currentBufferState.state === _controllersBufferController2['default'].BUFFER_LOADED){bufferStateDict[mediaType].firstBufferLoadedEvent = true;wasTriggered = true;}return wasTriggered;}function resetInitialSettings(){bufferStateDict = {};}function onPlaybackSeeking(){resetInitialSettings();}function reset(){resetInitialSettings();eventBus.off(_coreEventsEvents2['default'].PLAYBACK_SEEKING,onPlaybackSeeking,instance);}instance = {getMaxIndex:getMaxIndex,reset:reset};setup();return instance;}InsufficientBufferRule.__dashjs_factory_name = 'InsufficientBufferRule';exports['default'] = _coreFactoryMaker2['default'].getClassFactory(InsufficientBufferRule);module.exports = exports['default'];
//# sourceMappingURL=InsufficientBufferRule.js.map
