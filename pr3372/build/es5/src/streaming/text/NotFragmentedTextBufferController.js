'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _Constants=require('../constants/Constants');var _Constants2=_interopRequireDefault(_Constants);var _EventBus=require('../../core/EventBus');var _EventBus2=_interopRequireDefault(_EventBus);var _Events=require('../../core/events/Events');var _Events2=_interopRequireDefault(_Events);var _FactoryMaker=require('../../core/FactoryMaker');var _FactoryMaker2=_interopRequireDefault(_FactoryMaker);var _InitCache=require('../utils/InitCache');var _InitCache2=_interopRequireDefault(_InitCache);var _SourceBufferSink=require('../SourceBufferSink');var _SourceBufferSink2=_interopRequireDefault(_SourceBufferSink);var _TextController=require('../../streaming/text/TextController');var _TextController2=_interopRequireDefault(_TextController);var _DashJSError=require('../../streaming/vo/DashJSError');var _DashJSError2=_interopRequireDefault(_DashJSError);var _Errors=require('../../core/errors/Errors');var _Errors2=_interopRequireDefault(_Errors);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var BUFFER_CONTROLLER_TYPE='NotFragmentedTextBufferController';/**
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
 */function NotFragmentedTextBufferController(config){config=config||{};var context=this.context;var eventBus=(0,_EventBus2.default)(context).getInstance();var textController=(0,_TextController2.default)(context).getInstance();var errHandler=config.errHandler;var streamInfo=config.streamInfo;var type=config.type;var mimeType=config.mimeType;var fragmentModel=config.fragmentModel;var instance=void 0,isBufferingCompleted=void 0,initialized=void 0,mediaSource=void 0,buffer=void 0,initCache=void 0;function setup(){initialized=false;mediaSource=null;isBufferingCompleted=false;eventBus.on(_Events2.default.DATA_UPDATE_COMPLETED,onDataUpdateCompleted,instance);eventBus.on(_Events2.default.INIT_FRAGMENT_LOADED,onInitFragmentLoaded,instance);}function getBufferControllerType(){return BUFFER_CONTROLLER_TYPE;}function initialize(source){setMediaSource(source);initCache=(0,_InitCache2.default)(context).getInstance();}function createBuffer(mediaInfoArr){var mediaInfo=mediaInfoArr[0];try{buffer=(0,_SourceBufferSink2.default)(context).create(mediaSource,mediaInfo);if(!initialized){var textBuffer=buffer.getBuffer();if(textBuffer.hasOwnProperty(_Constants2.default.INITIALIZE)){textBuffer.initialize(mimeType,streamInfo,mediaInfoArr,fragmentModel);}initialized=true;}return buffer;}catch(e){if(mediaInfo&&(mediaInfo.isText||mediaInfo.codec.indexOf('codecs="stpp')!==-1||mediaInfo.codec.indexOf('codecs="wvtt')!==-1)){try{buffer=textController.getTextSourceBuffer();}catch(e){errHandler.error(new _DashJSError2.default(_Errors2.default.MEDIASOURCE_TYPE_UNSUPPORTED_CODE,_Errors2.default.MEDIASOURCE_TYPE_UNSUPPORTED_MESSAGE+type+' : '+e.message));}}else{errHandler.error(new _DashJSError2.default(_Errors2.default.MEDIASOURCE_TYPE_UNSUPPORTED_CODE,_Errors2.default.MEDIASOURCE_TYPE_UNSUPPORTED_MESSAGE+type));}}}function getType(){return type;}function getBuffer(){return buffer;}function setMediaSource(value){mediaSource=value;}function getMediaSource(){return mediaSource;}function getIsPruningInProgress(){return false;}function dischargePreBuffer(){}function getBufferLevel(){return 0;}function getIsBufferingCompleted(){return isBufferingCompleted;}function reset(errored){eventBus.off(_Events2.default.DATA_UPDATE_COMPLETED,onDataUpdateCompleted,instance);eventBus.off(_Events2.default.INIT_FRAGMENT_LOADED,onInitFragmentLoaded,instance);if(!errored&&buffer){buffer.abort();buffer.reset();buffer=null;}}function onDataUpdateCompleted(e){if(initCache.extract(streamInfo.id,e.currentRepresentation.id)!==null){return;}// Representation has changed, clear buffer
isBufferingCompleted=false;// // Text data file is contained in initialization segment
eventBus.trigger(_Events2.default.INIT_FRAGMENT_NEEDED,{representationId:e.currentRepresentation.id},streamInfo.id,type);}function appendInitSegment(representationId){// If text data file already in cache then no need to append it again
return initCache.extract(streamInfo.id,representationId)!==null;}function onInitFragmentLoaded(e){if(!e.chunk.bytes)return;initCache.save(e.chunk);buffer.append(e.chunk);isBufferingCompleted=true;eventBus.trigger(_Events2.default.STREAM_COMPLETED,{request:e.request});}function getRangeAt(){return null;}function updateTimestampOffset(MSETimeOffset){if(buffer.timestampOffset!==MSETimeOffset&&!isNaN(MSETimeOffset)){buffer.timestampOffset=MSETimeOffset;}}instance={getBufferControllerType:getBufferControllerType,initialize:initialize,createBuffer:createBuffer,getType:getType,getBuffer:getBuffer,getBufferLevel:getBufferLevel,setMediaSource:setMediaSource,getMediaSource:getMediaSource,getIsBufferingCompleted:getIsBufferingCompleted,getIsPruningInProgress:getIsPruningInProgress,dischargePreBuffer:dischargePreBuffer,appendInitSegment:appendInitSegment,getRangeAt:getRangeAt,reset:reset,updateTimestampOffset:updateTimestampOffset};setup();return instance;}NotFragmentedTextBufferController.__dashjs_factory_name=BUFFER_CONTROLLER_TYPE;exports.default=_FactoryMaker2.default.getClassFactory(NotFragmentedTextBufferController);
//# sourceMappingURL=NotFragmentedTextBufferController.js.map
