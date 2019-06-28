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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _get=function get(_x,_x2,_x3){var _again=true;_function: while(_again) {var object=_x,property=_x2,receiver=_x3;_again = false;if(object === null)object = Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc === undefined){var parent=Object.getPrototypeOf(object);if(parent === null){return undefined;}else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}}else if('value' in desc){return desc.value;}else {var getter=desc.get;if(getter === undefined){return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}var _EventsBase2=require('./EventsBase');var _EventsBase3=_interopRequireDefault(_EventsBase2); /**
 * These are internal events that should not be needed at the player level.
 * If you find and event in here that you would like access to from MediaPlayer level
 * please add an issue at https://github.com/Dash-Industry-Forum/dash.js/issues/new
 * @class
 * @ignore
 */var CoreEvents=(function(_EventsBase){_inherits(CoreEvents,_EventsBase);function CoreEvents(){_classCallCheck(this,CoreEvents);_get(Object.getPrototypeOf(CoreEvents.prototype),'constructor',this).call(this);this.BUFFERING_COMPLETED = 'bufferingCompleted';this.BUFFER_CLEARED = 'bufferCleared';this.BUFFER_LEVEL_UPDATED = 'bufferLevelUpdated';this.BYTES_APPENDED = 'bytesAppended';this.BYTES_APPENDED_END_FRAGMENT = 'bytesAppendedEndFragment';this.CHECK_FOR_EXISTENCE_COMPLETED = 'checkForExistenceCompleted';this.CURRENT_TRACK_CHANGED = 'currentTrackChanged';this.DATA_UPDATE_COMPLETED = 'dataUpdateCompleted';this.DATA_UPDATE_STARTED = 'dataUpdateStarted';this.INITIALIZATION_LOADED = 'initializationLoaded';this.INIT_FRAGMENT_LOADED = 'initFragmentLoaded';this.INIT_REQUESTED = 'initRequested';this.INTERNAL_MANIFEST_LOADED = 'internalManifestLoaded';this.LIVE_EDGE_SEARCH_COMPLETED = 'liveEdgeSearchCompleted';this.LOADING_COMPLETED = 'loadingCompleted';this.LOADING_PROGRESS = 'loadingProgress';this.LOADING_DATA_PROGRESS = 'loadingDataProgress';this.LOADING_ABANDONED = 'loadingAborted';this.MANIFEST_UPDATED = 'manifestUpdated';this.MEDIA_FRAGMENT_LOADED = 'mediaFragmentLoaded';this.QUOTA_EXCEEDED = 'quotaExceeded';this.REPRESENTATION_UPDATED = 'representationUpdated';this.SEGMENTS_LOADED = 'segmentsLoaded';this.SERVICE_LOCATION_BLACKLIST_ADD = 'serviceLocationBlacklistAdd';this.SERVICE_LOCATION_BLACKLIST_CHANGED = 'serviceLocationBlacklistChanged';this.SOURCEBUFFER_REMOVE_COMPLETED = 'sourceBufferRemoveCompleted';this.STREAMS_COMPOSED = 'streamsComposed';this.STREAM_BUFFERING_COMPLETED = 'streamBufferingCompleted';this.STREAM_COMPLETED = 'streamCompleted';this.TEXT_TRACKS_QUEUE_INITIALIZED = 'textTracksQueueInitialized';this.TIMED_TEXT_REQUESTED = 'timedTextRequested';this.TIME_SYNCHRONIZATION_COMPLETED = 'timeSynchronizationComplete';this.URL_RESOLUTION_FAILED = 'urlResolutionFailed';this.VIDEO_CHUNK_RECEIVED = 'videoChunkReceived';this.WALLCLOCK_TIME_UPDATED = 'wallclockTimeUpdated';this.XLINK_ELEMENT_LOADED = 'xlinkElementLoaded';this.XLINK_READY = 'xlinkReady';}return CoreEvents;})(_EventsBase3['default']);exports['default'] = CoreEvents;module.exports = exports['default'];
//# sourceMappingURL=CoreEvents.js.map
