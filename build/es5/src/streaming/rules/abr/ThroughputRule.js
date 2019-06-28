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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _controllersBufferController=require('../../controllers/BufferController');var _controllersBufferController2=_interopRequireDefault(_controllersBufferController);var _controllersAbrController=require('../../controllers/AbrController');var _controllersAbrController2=_interopRequireDefault(_controllersAbrController);var _coreFactoryMaker=require('../../../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _coreDebug=require('../../../core/Debug');var _coreDebug2=_interopRequireDefault(_coreDebug);var _SwitchRequest=require('../SwitchRequest');var _SwitchRequest2=_interopRequireDefault(_SwitchRequest);function ThroughputRule(config){config = config || {};var context=this.context;var metricsModel=config.metricsModel;var instance=undefined,logger=undefined;function setup(){logger = (0,_coreDebug2['default'])(context).getInstance().getLogger(instance);}function checkConfig(){if(!metricsModel || !metricsModel.hasOwnProperty('getReadOnlyMetricsFor')){throw new Error('Missing config parameter(s)');}}function getMaxIndex(rulesContext){var switchRequest=(0,_SwitchRequest2['default'])(context).create();if(!rulesContext || !rulesContext.hasOwnProperty('getMediaInfo') || !rulesContext.hasOwnProperty('getMediaType') || !rulesContext.hasOwnProperty('useBufferOccupancyABR') || !rulesContext.hasOwnProperty('getAbrController') || !rulesContext.hasOwnProperty('getStreamProcessor')){return switchRequest;}checkConfig();var mediaInfo=rulesContext.getMediaInfo();var mediaType=rulesContext.getMediaType();var metrics=metricsModel.getReadOnlyMetricsFor(mediaType);var streamProcessor=rulesContext.getStreamProcessor();var abrController=rulesContext.getAbrController();var streamInfo=rulesContext.getStreamInfo();var isDynamic=streamInfo && streamInfo.manifestInfo?streamInfo.manifestInfo.isDynamic:null;var throughputHistory=abrController.getThroughputHistory();var throughput=throughputHistory.getSafeAverageThroughput(mediaType,isDynamic);var latency=throughputHistory.getAverageLatency(mediaType);var bufferStateVO=metrics.BufferState.length > 0?metrics.BufferState[metrics.BufferState.length - 1]:null;var useBufferOccupancyABR=rulesContext.useBufferOccupancyABR();if(!metrics || isNaN(throughput) || !bufferStateVO || useBufferOccupancyABR){return switchRequest;}if(abrController.getAbandonmentStateFor(mediaType) !== _controllersAbrController2['default'].ABANDON_LOAD){if(bufferStateVO.state === _controllersBufferController2['default'].BUFFER_LOADED || isDynamic){switchRequest.quality = abrController.getQualityForBitrate(mediaInfo,throughput,latency);streamProcessor.getScheduleController().setTimeToLoadDelay(0);logger.info('requesting switch to index: ',switchRequest.quality,'type: ',mediaType,'Average throughput',Math.round(throughput),'kbps');switchRequest.reason = {throughput:throughput,latency:latency};}}return switchRequest;}function reset(){ // no persistent information to reset
}instance = {getMaxIndex:getMaxIndex,reset:reset};setup();return instance;}ThroughputRule.__dashjs_factory_name = 'ThroughputRule';exports['default'] = _coreFactoryMaker2['default'].getClassFactory(ThroughputRule);module.exports = exports['default'];
//# sourceMappingURL=ThroughputRule.js.map
