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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _coreFactoryMaker=require('../../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _coreDebug=require('../../core/Debug');var _coreDebug2=_interopRequireDefault(_coreDebug);var _objectiron=require('./objectiron');var _objectiron2=_interopRequireDefault(_objectiron);var _externalsXml2json=require('../../../externals/xml2json');var _externalsXml2json2=_interopRequireDefault(_externalsXml2json);var _matchersStringMatcher=require('./matchers/StringMatcher');var _matchersStringMatcher2=_interopRequireDefault(_matchersStringMatcher);var _matchersDurationMatcher=require('./matchers/DurationMatcher');var _matchersDurationMatcher2=_interopRequireDefault(_matchersDurationMatcher);var _matchersDateTimeMatcher=require('./matchers/DateTimeMatcher');var _matchersDateTimeMatcher2=_interopRequireDefault(_matchersDateTimeMatcher);var _matchersNumericMatcher=require('./matchers/NumericMatcher');var _matchersNumericMatcher2=_interopRequireDefault(_matchersNumericMatcher);var _mapsRepresentationBaseValuesMap=require('./maps/RepresentationBaseValuesMap');var _mapsRepresentationBaseValuesMap2=_interopRequireDefault(_mapsRepresentationBaseValuesMap);var _mapsSegmentValuesMap=require('./maps/SegmentValuesMap');var _mapsSegmentValuesMap2=_interopRequireDefault(_mapsSegmentValuesMap);function DashParser(){var context=this.context;var instance=undefined,logger=undefined,matchers=undefined,converter=undefined,objectIron=undefined;function setup(){logger = (0,_coreDebug2['default'])(context).getInstance().getLogger(instance);matchers = [new _matchersDurationMatcher2['default'](),new _matchersDateTimeMatcher2['default'](),new _matchersNumericMatcher2['default'](),new _matchersStringMatcher2['default']() // last in list to take precedence over NumericMatcher
];converter = new _externalsXml2json2['default']({escapeMode:false,attributePrefix:'',arrayAccessForm:'property',emptyNodeForm:'object',stripWhitespaces:false,enableToStringFunc:false,ignoreRoot:true,matchers:matchers});objectIron = (0,_objectiron2['default'])(context).create({adaptationset:new _mapsRepresentationBaseValuesMap2['default'](),period:new _mapsSegmentValuesMap2['default']()});}function getMatchers(){return matchers;}function getIron(){return objectIron;}function parse(data){var manifest=undefined;var startTime=window.performance.now();manifest = converter.xml_str2json(data);if(!manifest){throw new Error('parsing the manifest failed');}var jsonTime=window.performance.now();objectIron.run(manifest);var ironedTime=window.performance.now();logger.info('Parsing complete: ( xml2json: ' + (jsonTime - startTime).toPrecision(3) + 'ms, objectiron: ' + (ironedTime - jsonTime).toPrecision(3) + 'ms, total: ' + ((ironedTime - startTime) / 1000).toPrecision(3) + 's)');return manifest;}instance = {parse:parse,getMatchers:getMatchers,getIron:getIron};setup();return instance;}DashParser.__dashjs_factory_name = 'DashParser';exports['default'] = _coreFactoryMaker2['default'].getClassFactory(DashParser);module.exports = exports['default'];
//# sourceMappingURL=DashParser.js.map
