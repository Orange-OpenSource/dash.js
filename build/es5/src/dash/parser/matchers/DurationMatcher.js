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
 */ /**
 * @classdesc matches and converts xs:duration to seconds
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _get=function get(_x,_x2,_x3){var _again=true;_function: while(_again) {var object=_x,property=_x2,receiver=_x3;_again = false;if(object === null)object = Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc === undefined){var parent=Object.getPrototypeOf(object);if(parent === null){return undefined;}else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}}else if('value' in desc){return desc.value;}else {var getter=desc.get;if(getter === undefined){return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}var _BaseMatcher2=require('./BaseMatcher');var _BaseMatcher3=_interopRequireDefault(_BaseMatcher2);var _streamingConstantsConstants=require('../../../streaming/constants/Constants');var _streamingConstantsConstants2=_interopRequireDefault(_streamingConstantsConstants);var _constantsDashConstants=require('../../constants/DashConstants');var _constantsDashConstants2=_interopRequireDefault(_constantsDashConstants);var durationRegex=/^([-])?P(([\d.]*)Y)?(([\d.]*)M)?(([\d.]*)D)?T?(([\d.]*)H)?(([\d.]*)M)?(([\d.]*)S)?/;var SECONDS_IN_YEAR=365 * 24 * 60 * 60;var SECONDS_IN_MONTH=30 * 24 * 60 * 60;var SECONDS_IN_DAY=24 * 60 * 60;var SECONDS_IN_HOUR=60 * 60;var SECONDS_IN_MIN=60;var DurationMatcher=(function(_BaseMatcher){_inherits(DurationMatcher,_BaseMatcher);function DurationMatcher(){_classCallCheck(this,DurationMatcher);_get(Object.getPrototypeOf(DurationMatcher.prototype),'constructor',this).call(this,function(attr){var attributeList=[_constantsDashConstants2['default'].MIN_BUFFER_TIME,_constantsDashConstants2['default'].MEDIA_PRESENTATION_DURATION,_constantsDashConstants2['default'].MINIMUM_UPDATE_PERIOD,_constantsDashConstants2['default'].TIMESHIFT_BUFFER_DEPTH,_constantsDashConstants2['default'].MAX_SEGMENT_DURATION,_constantsDashConstants2['default'].MAX_SUBSEGMENT_DURATION,_streamingConstantsConstants2['default'].SUGGESTED_PRESENTATION_DELAY,_constantsDashConstants2['default'].START,_streamingConstantsConstants2['default'].START_TIME,_constantsDashConstants2['default'].DURATION];var len=attributeList.length;for(var i=0;i < len;i++) {if(attr.nodeName === attributeList[i]){return durationRegex.test(attr.value);}}return false;},function(str){ //str = "P10Y10M10DT10H10M10.1S";
var match=durationRegex.exec(str);var result=parseFloat(match[2] || 0) * SECONDS_IN_YEAR + parseFloat(match[4] || 0) * SECONDS_IN_MONTH + parseFloat(match[6] || 0) * SECONDS_IN_DAY + parseFloat(match[8] || 0) * SECONDS_IN_HOUR + parseFloat(match[10] || 0) * SECONDS_IN_MIN + parseFloat(match[12] || 0);if(match[1] !== undefined){result = -result;}return result;});}return DurationMatcher;})(_BaseMatcher3['default']);exports['default'] = DurationMatcher;module.exports = exports['default'];
//# sourceMappingURL=DurationMatcher.js.map
