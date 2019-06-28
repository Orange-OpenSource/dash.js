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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _constantsDashConstants=require('../constants/DashConstants');var _constantsDashConstants2=_interopRequireDefault(_constantsDashConstants);var _coreFactoryMaker=require('../../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _TimelineSegmentsGetter=require('./TimelineSegmentsGetter');var _TimelineSegmentsGetter2=_interopRequireDefault(_TimelineSegmentsGetter);var _TemplateSegmentsGetter=require('./TemplateSegmentsGetter');var _TemplateSegmentsGetter2=_interopRequireDefault(_TemplateSegmentsGetter);var _ListSegmentsGetter=require('./ListSegmentsGetter');var _ListSegmentsGetter2=_interopRequireDefault(_ListSegmentsGetter);function SegmentsGetter(config,isDynamic){var context=this.context;var instance=undefined,timelineSegmentsGetter=undefined,templateSegmentsGetter=undefined,listSegmentsGetter=undefined;function setup(){timelineSegmentsGetter = (0,_TimelineSegmentsGetter2['default'])(context).create(config,isDynamic);templateSegmentsGetter = (0,_TemplateSegmentsGetter2['default'])(context).create(config,isDynamic);listSegmentsGetter = (0,_ListSegmentsGetter2['default'])(context).create(config,isDynamic);} // availabilityUpperLimit parameter is not used directly by any dash.js function, but it is needed as a helper
// for other developments that extend dash.js, and provide their own transport layers (ex: P2P transport)
function getSegments(representation,requestedTime,index,onSegmentListUpdatedCallback,availabilityUpperLimit){var segments=undefined;var type=representation.segmentInfoType; // Already figure out the segments.
if(type === _constantsDashConstants2['default'].SEGMENT_BASE || type === _constantsDashConstants2['default'].BASE_URL || !isSegmentListUpdateRequired(representation,index)){segments = representation.segments;}else {if(type === _constantsDashConstants2['default'].SEGMENT_TIMELINE){segments = timelineSegmentsGetter.getSegments(representation,requestedTime,index,availabilityUpperLimit);}else if(type === _constantsDashConstants2['default'].SEGMENT_TEMPLATE){segments = templateSegmentsGetter.getSegments(representation,requestedTime,index,availabilityUpperLimit);}else if(type === _constantsDashConstants2['default'].SEGMENT_LIST){segments = listSegmentsGetter.getSegments(representation,requestedTime,index,availabilityUpperLimit);}if(onSegmentListUpdatedCallback){onSegmentListUpdatedCallback(representation,segments);}}}function isSegmentListUpdateRequired(representation,index){var segments=representation.segments;var updateRequired=false;var upperIdx=undefined,lowerIdx=undefined;if(!segments || segments.length === 0){updateRequired = true;}else {lowerIdx = segments[0].availabilityIdx;upperIdx = segments[segments.length - 1].availabilityIdx;updateRequired = index < lowerIdx || index > upperIdx;}return updateRequired;}instance = {getSegments:getSegments};setup();return instance;}SegmentsGetter.__dashjs_factory_name = 'SegmentsGetter';var factory=_coreFactoryMaker2['default'].getClassFactory(SegmentsGetter);exports['default'] = factory;module.exports = exports['default'];
//# sourceMappingURL=SegmentsGetter.js.map
