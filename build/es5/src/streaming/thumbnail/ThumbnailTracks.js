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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _constantsConstants=require('../constants/Constants');var _constantsConstants2=_interopRequireDefault(_constantsConstants);var _dashConstantsDashConstants=require('../../dash/constants/DashConstants');var _dashConstantsDashConstants2=_interopRequireDefault(_dashConstantsDashConstants);var _coreFactoryMaker=require('../../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _voThumbnailTrackInfo=require('../vo/ThumbnailTrackInfo');var _voThumbnailTrackInfo2=_interopRequireDefault(_voThumbnailTrackInfo);var _streamingUtilsURLUtils=require('../../streaming/utils/URLUtils');var _streamingUtilsURLUtils2=_interopRequireDefault(_streamingUtilsURLUtils);var _dashUtilsSegmentsUtils=require('../../dash/utils/SegmentsUtils');var THUMBNAILS_SCHEME_ID_URI='http://dashif.org/thumbnail_tile';function ThumbnailTracks(config){var context=this.context;var dashManifestModel=config.dashManifestModel;var adapter=config.adapter;var baseURLController=config.baseURLController;var stream=config.stream;var urlUtils=(0,_streamingUtilsURLUtils2['default'])(context).getInstance();var instance=undefined,tracks=undefined,currentTrackIndex=undefined;function initialize(){reset(); // parse representation and create tracks
addTracks();}function addTracks(){if(!stream || !dashManifestModel || !adapter){return;}var streamInfo=stream?stream.getStreamInfo():null;if(!streamInfo){return;} // Extract thumbnail tracks
var mediaInfo=adapter.getMediaInfoForType(streamInfo,_constantsConstants2['default'].IMAGE);if(!mediaInfo){return;}var voAdaptation=adapter.getDataForMedia(mediaInfo);if(!voAdaptation){return;}var voReps=dashManifestModel.getRepresentationsForAdaptation(voAdaptation);if(voReps && voReps.length > 0){voReps.forEach(function(rep){if(rep.segmentInfoType === _dashConstantsDashConstants2['default'].SEGMENT_TEMPLATE && rep.segmentDuration > 0 && rep.media)createTrack(rep);});}if(tracks.length > 0){ // Sort bitrates and select the lowest bitrate rendition
tracks.sort(function(a,b){return a.bitrate - b.bitrate;});currentTrackIndex = tracks.length - 1;}}function createTrack(representation){var track=new _voThumbnailTrackInfo2['default']();track.id = representation.id;track.bitrate = representation.bandwidth;track.width = representation.width;track.height = representation.height;track.tilesHor = 1;track.tilesVert = 1;track.startNumber = representation.startNumber;track.segmentDuration = representation.segmentDuration;track.timescale = representation.timescale;track.templateUrl = buildTemplateUrl(representation);if(representation.essentialProperties){representation.essentialProperties.forEach(function(p){if(p.schemeIdUri === THUMBNAILS_SCHEME_ID_URI && p.value){var vars=p.value.split('x');if(vars.length === 2 && !isNaN(vars[0]) && !isNaN(vars[1])){track.tilesHor = parseInt(vars[0],10);track.tilesVert = parseInt(vars[1],10);}}});}if(track.tilesHor > 0 && track.tilesVert > 0){ // Precalculate width and heigth per tile for perf reasons
track.widthPerTile = track.width / track.tilesHor;track.heightPerTile = track.height / track.tilesVert;tracks.push(track);}}function buildTemplateUrl(representation){var templateUrl=urlUtils.isRelative(representation.media)?urlUtils.resolve(representation.media,baseURLController.resolve(representation.path).url):representation.media;if(!templateUrl){return '';}return (0,_dashUtilsSegmentsUtils.replaceIDForTemplate)(templateUrl,representation.id);}function getTracks(){return tracks;}function getCurrentTrackIndex(){return currentTrackIndex;}function getCurrentTrack(){if(currentTrackIndex < 0){return null;}return tracks[currentTrackIndex];}function setTrackByIndex(index){if(!tracks || tracks.length === 0){return;} // select highest bitrate in case selected index is higher than bitrate list length
if(index >= tracks.length){index = tracks.length - 1;}currentTrackIndex = index;}function reset(){tracks = [];currentTrackIndex = -1;}instance = {initialize:initialize,getTracks:getTracks,reset:reset,setTrackByIndex:setTrackByIndex,getCurrentTrack:getCurrentTrack,getCurrentTrackIndex:getCurrentTrackIndex};initialize();return instance;}ThumbnailTracks.__dashjs_factory_name = 'ThumbnailTracks';exports['default'] = _coreFactoryMaker2['default'].getClassFactory(ThumbnailTracks);module.exports = exports['default'];
//# sourceMappingURL=ThumbnailTracks.js.map
