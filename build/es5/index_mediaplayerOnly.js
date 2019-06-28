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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _srcStreamingMediaPlayer=require('./src/streaming/MediaPlayer');var _srcStreamingMediaPlayer2=_interopRequireDefault(_srcStreamingMediaPlayer);var _srcCoreFactoryMaker=require('./src/core/FactoryMaker');var _srcCoreFactoryMaker2=_interopRequireDefault(_srcCoreFactoryMaker);var _srcCoreDebug=require('./src/core/Debug');var _srcCoreDebug2=_interopRequireDefault(_srcCoreDebug);var _srcCoreVersion=require('./src/core/Version'); // Shove both of these into the global scope
var context=typeof window !== 'undefined' && window || global;var dashjs=context.dashjs;if(!dashjs){dashjs = context.dashjs = {};}dashjs.MediaPlayer = _srcStreamingMediaPlayer2['default'];dashjs.FactoryMaker = _srcCoreFactoryMaker2['default'];dashjs.Debug = _srcCoreDebug2['default'];dashjs.Version = (0,_srcCoreVersion.getVersionString)();exports['default'] = dashjs;exports.MediaPlayer = _srcStreamingMediaPlayer2['default'];exports.FactoryMaker = _srcCoreFactoryMaker2['default'];exports.Debug = _srcCoreDebug2['default'];
//# sourceMappingURL=index_mediaplayerOnly.js.map
