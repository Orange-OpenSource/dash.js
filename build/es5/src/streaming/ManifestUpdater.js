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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _coreEventBus=require('../core/EventBus');var _coreEventBus2=_interopRequireDefault(_coreEventBus);var _coreEventsEvents=require('../core/events/Events');var _coreEventsEvents2=_interopRequireDefault(_coreEventsEvents);var _coreFactoryMaker=require('../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _coreDebug=require('../core/Debug');var _coreDebug2=_interopRequireDefault(_coreDebug);function ManifestUpdater(){var context=this.context;var eventBus=(0,_coreEventBus2['default'])(context).getInstance();var instance=undefined,logger=undefined,refreshDelay=undefined,refreshTimer=undefined,isPaused=undefined,isUpdating=undefined,manifestLoader=undefined,manifestModel=undefined,dashManifestModel=undefined,mediaPlayerModel=undefined,errHandler=undefined;function setup(){logger = (0,_coreDebug2['default'])(context).getInstance().getLogger(instance);}function setConfig(config){if(!config)return;if(config.manifestModel){manifestModel = config.manifestModel;}if(config.dashManifestModel){dashManifestModel = config.dashManifestModel;}if(config.mediaPlayerModel){mediaPlayerModel = config.mediaPlayerModel;}if(config.manifestLoader){manifestLoader = config.manifestLoader;}if(config.errHandler){errHandler = config.errHandler;}}function initialize(){resetInitialSettings();eventBus.on(_coreEventsEvents2['default'].STREAMS_COMPOSED,onStreamsComposed,this);eventBus.on(_coreEventsEvents2['default'].PLAYBACK_STARTED,onPlaybackStarted,this);eventBus.on(_coreEventsEvents2['default'].PLAYBACK_PAUSED,onPlaybackPaused,this);eventBus.on(_coreEventsEvents2['default'].INTERNAL_MANIFEST_LOADED,onManifestLoaded,this);}function setManifest(manifest){update(manifest);}function resetInitialSettings(){refreshDelay = NaN;isUpdating = false;isPaused = true;stopManifestRefreshTimer();}function reset(){eventBus.off(_coreEventsEvents2['default'].PLAYBACK_STARTED,onPlaybackStarted,this);eventBus.off(_coreEventsEvents2['default'].PLAYBACK_PAUSED,onPlaybackPaused,this);eventBus.off(_coreEventsEvents2['default'].STREAMS_COMPOSED,onStreamsComposed,this);eventBus.off(_coreEventsEvents2['default'].INTERNAL_MANIFEST_LOADED,onManifestLoaded,this);resetInitialSettings();}function stopManifestRefreshTimer(){if(refreshTimer !== null){clearInterval(refreshTimer);refreshTimer = null;}}function startManifestRefreshTimer(delay){stopManifestRefreshTimer();if(isNaN(delay) && !isNaN(refreshDelay)){delay = refreshDelay * 1000;}if(!isNaN(delay)){logger.debug('Refresh manifest in ' + delay + ' milliseconds.');refreshTimer = setTimeout(onRefreshTimer,delay);}}function refreshManifest(){isUpdating = true;var manifest=manifestModel.getValue();var url=manifest.url;var location=dashManifestModel.getLocation(manifest);if(location){url = location;}manifestLoader.load(url);}function update(manifest){manifestModel.setValue(manifest);var date=new Date();var latencyOfLastUpdate=(date.getTime() - manifest.loadedTime.getTime()) / 1000;refreshDelay = dashManifestModel.getManifestUpdatePeriod(manifest,latencyOfLastUpdate); // setTimeout uses a 32 bit number to store the delay. Any number greater than it
// will cause event associated with setTimeout to trigger immediately
if(refreshDelay * 1000 > 0x7FFFFFFF){refreshDelay = 0x7FFFFFFF / 1000;}eventBus.trigger(_coreEventsEvents2['default'].MANIFEST_UPDATED,{manifest:manifest});logger.info('Manifest has been refreshed at ' + date + '[' + date.getTime() / 1000 + '] ');if(!isPaused){startManifestRefreshTimer();}}function onRefreshTimer(){if(isPaused && !mediaPlayerModel.getScheduleWhilePaused()){return;}if(isUpdating){startManifestRefreshTimer(mediaPlayerModel.getManifestUpdateRetryInterval());return;}refreshManifest();}function onManifestLoaded(e){if(!e.error){update(e.manifest);}else {errHandler.manifestError(e.error.message,e.error.code);}}function onPlaybackStarted() /*e*/{isPaused = false;startManifestRefreshTimer();}function onPlaybackPaused() /*e*/{isPaused = true;stopManifestRefreshTimer();}function onStreamsComposed() /*e*/{ // When streams are ready we can consider manifest update completed. Resolve the update promise.
isUpdating = false;}instance = {initialize:initialize,setManifest:setManifest,refreshManifest:refreshManifest,setConfig:setConfig,reset:reset};setup();return instance;}ManifestUpdater.__dashjs_factory_name = 'ManifestUpdater';exports['default'] = _coreFactoryMaker2['default'].getClassFactory(ManifestUpdater);module.exports = exports['default'];
//# sourceMappingURL=ManifestUpdater.js.map
