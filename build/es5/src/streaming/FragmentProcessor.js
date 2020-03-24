'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _EventBus=require('./../core/EventBus');var _EventBus2=_interopRequireDefault(_EventBus);var _FactoryMaker=require('../core/FactoryMaker');var _FactoryMaker2=_interopRequireDefault(_FactoryMaker);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
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
 */function FragmentProcessor(config){config=config||{};var context=this.context;var eventBus=(0,_EventBus2.default)(context).getInstance();var events=config.events;var ISOBoxer=config.ISOBoxer;var instance=void 0,processFragment=void 0;function setup(){eventBus.on(events.FRAGMENT_LOADING_COMPLETED,onSegmentMediaLoaded,instance,dashjs.FactoryMaker.getSingletonFactoryByName(eventBus.getClassName()).EVENT_PRIORITY_HIGH);/* jshint ignore:line */processFragment=false;}function reset(){eventBus.off(events.FRAGMENT_LOADING_COMPLETED,onSegmentMediaLoaded,this);}function onSegmentMediaLoaded(e){if(e.error){return;}reduceSampleCount(e,20);}function reduceSampleCount(e,newCount){if(!processFragment){return;}if(e.request.type!=='MediaSegment'){return;}if(e.request.mediaInfo.type!=='video'){return;}console.log('####################################################################################');// e.request contains request description object
// e.response contains fragment bytes
var isoFile=ISOBoxer.parseBuffer(e.response);var trun=isoFile.fetch('trun');// Update sample count and table
trun.sample_count=newCount;trun.samples=trun.samples.slice(0,newCount);// saiz
var saiz=isoFile.fetch('saiz');saiz.sample_count=newCount;// senc
var senc=isoFile.fetch('senc');senc.sample_count=newCount;senc.entry=senc.entry.slice(0,newCount);// Calculate new mdat size
var dataLength=0;for(var i=0;i<newCount;i++){dataLength+=trun.samples[i].sample_size;}// Replace mdat data
var mdat=isoFile.fetch('mdat');mdat.data=mdat.data.slice(0,dataLength);// Update data_offset field that corresponds to first data byte (inside mdat box)
var moof=isoFile.fetch('moof');var length=moof.getLength();trun.data_offset=length+8;// Write transformed/processed fragment into request reponse data
e.response=isoFile.write();processFragment=false;}function processNextFragment(){processFragment=true;}instance={reset:reset,processNextFragment:processNextFragment};setup();return instance;}FragmentProcessor.__dashjs_factory_name='FragmentProcessor';exports.default=_FactoryMaker2.default.getClassFactory(FragmentProcessor);
//# sourceMappingURL=FragmentProcessor.js.map
