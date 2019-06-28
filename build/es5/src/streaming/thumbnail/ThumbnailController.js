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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _coreFactoryMaker=require('../../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _constantsConstants=require('../constants/Constants');var _constantsConstants2=_interopRequireDefault(_constantsConstants);var _voThumbnail=require('../vo/Thumbnail');var _voThumbnail2=_interopRequireDefault(_voThumbnail);var _ThumbnailTracks=require('./ThumbnailTracks');var _ThumbnailTracks2=_interopRequireDefault(_ThumbnailTracks);var _voBitrateInfo=require('../vo/BitrateInfo');var _voBitrateInfo2=_interopRequireDefault(_voBitrateInfo);var _dashUtilsSegmentsUtils=require('../../dash/utils/SegmentsUtils');function ThumbnailController(config){var context=this.context;var instance=undefined;var thumbnailTracks=undefined;function setup(){reset();thumbnailTracks = (0,_ThumbnailTracks2['default'])(context).create({dashManifestModel:config.dashManifestModel,adapter:config.adapter,baseURLController:config.baseURLController,stream:config.stream});}function getThumbnail(time){var track=thumbnailTracks.getCurrentTrack();if(!track || track.segmentDuration <= 0){return null;} // Calculate index of the sprite given a time
var seq=Math.floor(time / track.segmentDuration);var offset=time % track.segmentDuration;var thumbIndex=Math.floor(offset * track.tilesHor * track.tilesVert / track.segmentDuration); // Create and return the thumbnail
var thumbnail=new _voThumbnail2['default']();thumbnail.url = buildUrlFromTemplate(track,seq);thumbnail.width = Math.floor(track.widthPerTile);thumbnail.height = Math.floor(track.heightPerTile);thumbnail.x = Math.floor(thumbIndex % track.tilesHor) * track.widthPerTile;thumbnail.y = Math.floor(thumbIndex / track.tilesHor) * track.heightPerTile;return thumbnail;}function buildUrlFromTemplate(track,seq){var seqIdx=seq + track.startNumber;var url=(0,_dashUtilsSegmentsUtils.replaceTokenForTemplate)(track.templateUrl,'Number',seqIdx);url = (0,_dashUtilsSegmentsUtils.replaceTokenForTemplate)(url,'Time',(seqIdx - 1) * track.segmentDuration);url = (0,_dashUtilsSegmentsUtils.replaceTokenForTemplate)(url,'Bandwidth',track.bandwidth);return (0,_dashUtilsSegmentsUtils.unescapeDollarsInTemplate)(url);}function setTrackByIndex(index){thumbnailTracks.setTrackByIndex(index);}function getCurrentTrackIndex(){return thumbnailTracks.getCurrentTrackIndex();}function getBitrateList(){var tracks=thumbnailTracks.getTracks();if(!tracks || tracks.length === 0){return [];}var i=0;return tracks.map(function(t){var bitrateInfo=new _voBitrateInfo2['default']();bitrateInfo.mediaType = _constantsConstants2['default'].IMAGE;bitrateInfo.qualityIndex = i++;bitrateInfo.bitrate = t.bitrate;bitrateInfo.width = t.width;bitrateInfo.height = t.height;return bitrateInfo;});}function reset(){if(thumbnailTracks){thumbnailTracks.reset();}}instance = {get:getThumbnail,setTrackByIndex:setTrackByIndex,getCurrentTrackIndex:getCurrentTrackIndex,getBitrateList:getBitrateList,reset:reset};setup();return instance;}ThumbnailController.__dashjs_factory_name = 'ThumbnailController';exports['default'] = _coreFactoryMaker2['default'].getClassFactory(ThumbnailController);module.exports = exports['default'];
//# sourceMappingURL=ThumbnailController.js.map
