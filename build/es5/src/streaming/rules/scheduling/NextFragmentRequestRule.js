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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _constantsConstants=require('../../constants/Constants');var _constantsConstants2=_interopRequireDefault(_constantsConstants);var _coreDebug=require('../../../core/Debug');var _coreDebug2=_interopRequireDefault(_coreDebug);var _coreFactoryMaker=require('../../../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _streamingVoFragmentRequest=require('../../../streaming/vo/FragmentRequest');var _streamingVoFragmentRequest2=_interopRequireDefault(_streamingVoFragmentRequest);function NextFragmentRequestRule(config){config = config || {};var context=this.context;var adapter=config.adapter;var textController=config.textController;var instance=undefined,logger=undefined;function setup(){logger = (0,_coreDebug2['default'])(context).getInstance().getLogger(instance);}function execute(streamProcessor,requestToReplace){var representationInfo=streamProcessor.getCurrentRepresentationInfo();var mediaInfo=representationInfo.mediaInfo;var mediaType=mediaInfo.type;var scheduleController=streamProcessor.getScheduleController();var seekTarget=scheduleController.getSeekTarget();var hasSeekTarget=!isNaN(seekTarget);var bufferController=streamProcessor.getBufferController();var currentTime=streamProcessor.getPlaybackController().getTime();var time=hasSeekTarget?seekTarget:adapter.getIndexHandlerTime(streamProcessor);var bufferIsDivided=false;if(isNaN(time) || mediaType === _constantsConstants2['default'].FRAGMENTED_TEXT && !textController.isTextEnabled()){return null;}if(hasSeekTarget){scheduleController.setSeekTarget(NaN);} /**
         * This is critical for IE/Safari/EDGE
         * */if(bufferController){var range=bufferController.getRangeAt(time);var playingRange=bufferController.getRangeAt(currentTime);var bufferRanges=bufferController.getBuffer().getAllBufferRanges();var numberOfBuffers=bufferRanges?bufferRanges.length:0;if((range !== null || playingRange !== null) && !hasSeekTarget){if(!range || playingRange && playingRange.start != range.start && playingRange.end != range.end){if(numberOfBuffers > 1){streamProcessor.getFragmentModel().removeExecutedRequestsAfterTime(playingRange.end);bufferIsDivided = true;}range = playingRange;}logger.debug('Prior to making a request for time, NextFragmentRequestRule is aligning index handler\'s currentTime with bufferedRange.end for',mediaType,'.',time,'was changed to',range.end);time = range.end;}}var request=undefined;if(requestToReplace){time = requestToReplace.startTime + requestToReplace.duration / 2;request = adapter.getFragmentRequestForTime(streamProcessor,representationInfo,time,{timeThreshold:0,ignoreIsFinished:true});}else {request = adapter.getFragmentRequestForTime(streamProcessor,representationInfo,time,{keepIdx:!hasSeekTarget && !bufferIsDivided}); // Then, check if this request was downloaded or not
while(request && request.action !== _streamingVoFragmentRequest2['default'].ACTION_COMPLETE && streamProcessor.getFragmentModel().isFragmentLoaded(request)) { // loop until we found not loaded fragment, or no fragment
request = adapter.getNextFragmentRequest(streamProcessor,representationInfo);}if(request){if(!isNaN(request.startTime + request.duration)){adapter.setIndexHandlerTime(streamProcessor,request.startTime + request.duration);}request.delayLoadingTime = new Date().getTime() + scheduleController.getTimeToLoadDelay();scheduleController.setTimeToLoadDelay(0);}}return request;}instance = {execute:execute};setup();return instance;}NextFragmentRequestRule.__dashjs_factory_name = 'NextFragmentRequestRule';exports['default'] = _coreFactoryMaker2['default'].getClassFactory(NextFragmentRequestRule);module.exports = exports['default'];
//# sourceMappingURL=NextFragmentRequestRule.js.map
