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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _IsoFile=require('./IsoFile');var _IsoFile2=_interopRequireDefault(_IsoFile);var _coreFactoryMaker=require('../../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _codemIsoboxer=require('codem-isoboxer');var _codemIsoboxer2=_interopRequireDefault(_codemIsoboxer);var _voIsoBoxSearchInfo=require('../vo/IsoBoxSearchInfo');var _voIsoBoxSearchInfo2=_interopRequireDefault(_voIsoBoxSearchInfo);function BoxParser() /*config*/{var instance=undefined;var context=this.context; /**
     * @param {ArrayBuffer} data
     * @returns {IsoFile|null}
     * @memberof BoxParser#
     */function parse(data){if(!data)return null;if(data.fileStart === undefined){data.fileStart = 0;}var parsedFile=_codemIsoboxer2['default'].parseBuffer(data);var dashIsoFile=(0,_IsoFile2['default'])(context).create();dashIsoFile.setData(parsedFile);return dashIsoFile;} /**
     * From the list of type boxes to look for, returns the latest one that is fully completed (header + payload). This
     * method only looks into the list of top boxes and doesn't analyze nested boxes.
     * @param {string[]} types
     * @param {ArrayBuffer|uint8Array} buffer
     * @param {number} offset
     * @returns {IsoBoxSearchInfo}
     * @memberof BoxParser#
     */function findLastTopIsoBoxCompleted(types,buffer,offset){if(offset === undefined){offset = 0;} // 8 = size (uint32) + type (4 characters)
if(!buffer || offset + 8 >= buffer.byteLength){return new _voIsoBoxSearchInfo2['default'](0,false);}var data=buffer instanceof ArrayBuffer?new Uint8Array(buffer):buffer;var boxInfo=undefined;var lastCompletedOffset=0;while(offset < data.byteLength) {var boxSize=parseUint32(data,offset);var boxType=parseIsoBoxType(data,offset + 4);if(boxSize === 0){break;}if(offset + boxSize <= data.byteLength){if(types.indexOf(boxType) >= 0){boxInfo = new _voIsoBoxSearchInfo2['default'](offset,true,boxSize);}else {lastCompletedOffset = offset + boxSize;}}offset += boxSize;}if(!boxInfo){return new _voIsoBoxSearchInfo2['default'](lastCompletedOffset,false);}return boxInfo;}function parseUint32(data,offset){return data[offset + 3] >>> 0 | data[offset + 2] << 8 >>> 0 | data[offset + 1] << 16 >>> 0 | data[offset] << 24 >>> 0;}function parseIsoBoxType(data,offset){return String.fromCharCode(data[offset++]) + String.fromCharCode(data[offset++]) + String.fromCharCode(data[offset++]) + String.fromCharCode(data[offset]);}instance = {parse:parse,findLastTopIsoBoxCompleted:findLastTopIsoBoxCompleted};return instance;}BoxParser.__dashjs_factory_name = 'BoxParser';exports['default'] = _coreFactoryMaker2['default'].getSingletonFactory(BoxParser);module.exports = exports['default'];
//# sourceMappingURL=BoxParser.js.map
