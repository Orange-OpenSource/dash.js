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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _modelsBaseURLTreeModel=require('../models/BaseURLTreeModel');var _modelsBaseURLTreeModel2=_interopRequireDefault(_modelsBaseURLTreeModel);var _utilsBaseURLSelector=require('../utils/BaseURLSelector');var _utilsBaseURLSelector2=_interopRequireDefault(_utilsBaseURLSelector);var _utilsURLUtils=require('../utils/URLUtils');var _utilsURLUtils2=_interopRequireDefault(_utilsURLUtils);var _dashVoBaseURL=require('../../dash/vo/BaseURL');var _dashVoBaseURL2=_interopRequireDefault(_dashVoBaseURL);var _coreFactoryMaker=require('../../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _coreEventBus=require('../../core/EventBus');var _coreEventBus2=_interopRequireDefault(_coreEventBus);var _coreEventsEvents=require('../../core/events/Events');var _coreEventsEvents2=_interopRequireDefault(_coreEventsEvents);function BaseURLController(){var instance=undefined;var dashManifestModel=undefined;var context=this.context;var eventBus=(0,_coreEventBus2['default'])(context).getInstance();var urlUtils=(0,_utilsURLUtils2['default'])(context).getInstance();var baseURLTreeModel=undefined,baseURLSelector=undefined;function onBlackListChanged(e){baseURLTreeModel.invalidateSelectedIndexes(e.entry);}function setup(){baseURLTreeModel = (0,_modelsBaseURLTreeModel2['default'])(context).create();baseURLSelector = (0,_utilsBaseURLSelector2['default'])(context).create();eventBus.on(_coreEventsEvents2['default'].SERVICE_LOCATION_BLACKLIST_CHANGED,onBlackListChanged,instance);}function setConfig(config){if(config.baseURLTreeModel){baseURLTreeModel = config.baseURLTreeModel;}if(config.baseURLSelector){baseURLSelector = config.baseURLSelector;}if(config.dashManifestModel){dashManifestModel = config.dashManifestModel;}}function update(manifest){baseURLTreeModel.update(manifest);baseURLSelector.chooseSelectorFromManifest(manifest);}function resolve(path){var baseUrls=baseURLTreeModel.getForPath(path);var baseUrl=baseUrls.reduce(function(p,c){var b=baseURLSelector.select(c);if(b){if(!urlUtils.isRelative(b.url)){p.url = b.url;p.serviceLocation = b.serviceLocation;}else {p.url = urlUtils.resolve(b.url,p.url);}p.availabilityTimeOffset = b.availabilityTimeOffset;p.availabilityTimeComplete = b.availabilityTimeComplete;}else {return new _dashVoBaseURL2['default']();}return p;},new _dashVoBaseURL2['default']());if(!urlUtils.isRelative(baseUrl.url)){return baseUrl;}}function reset(){baseURLTreeModel.reset();baseURLSelector.reset();}function initialize(data){ // report config to baseURLTreeModel and baseURLSelector
baseURLTreeModel.setConfig({dashManifestModel:dashManifestModel});baseURLSelector.setConfig({dashManifestModel:dashManifestModel});update(data);}instance = {reset:reset,initialize:initialize,resolve:resolve,setConfig:setConfig};setup();return instance;}BaseURLController.__dashjs_factory_name = 'BaseURLController';exports['default'] = _coreFactoryMaker2['default'].getSingletonFactory(BaseURLController);module.exports = exports['default'];
//# sourceMappingURL=BaseURLController.js.map
