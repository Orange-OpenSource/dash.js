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
 */

/*global dashjs*/
var OrangeInsufficientBufferRule;

function OrangeInsufficientBufferRuleClass() {

    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let OrangeConfig = factory.getSingletonFactoryByName('OrangeConfig');
    let MetricsModel = factory.getSingletonFactoryByName('MetricsModel');
    let DashMetrics = factory.getSingletonFactoryByName('DashMetrics');
    let BufferController = factory.getClassFactoryByName('BufferController');
    let EventBus = factory.getSingletonFactoryByName('EventBus');
    let Debug = factory.getSingletonFactoryByName('Debug');

    let context = this.context;
    let config = OrangeConfig(context).getInstance();
    let metricsModel = MetricsModel(context).getInstance();
    let dashMetrics = DashMetrics(context).getInstance();
    let debug = Debug(context).getInstance();
    let eventBus = EventBus(context).getInstance();
    let instance,
        bufferStateDict,
        lastSwitchTime,
        waitToSwitchTime;

    function setup() {
        bufferStateDict = {};
        lastSwitchTime = 0;
        waitToSwitchTime = 1000;
        eventBus.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKING, onPlaybackSeeking, instance);
    }

    function setBufferInfo(type, state) {
        bufferStateDict[type] = bufferStateDict[type] || {};
        bufferStateDict[type].state = state;
        if (state === BufferController.BUFFER_LOADED && !bufferStateDict[type].firstBufferLoadedEvent) {
            bufferStateDict[type].firstBufferLoadedEvent = true;
        }
    }

    function onPlaybackSeeking() {
        bufferStateDict = {};
    }

    function getMaxIndex(rulesContext) {

        var mediaType = rulesContext.getMediaInfo().type;
        var metrics = metricsModel.getReadOnlyMetricsFor(mediaType);

        var bufferLevel = dashMetrics.getCurrentBufferLevel(metrics) ? dashMetrics.getCurrentBufferLevel(metrics) : 0.0,
            minBufferTime,
            switchLowerBufferRatio,
            switchLowerBufferTime,
            switchDownBufferRatio,
            switchDownBufferTime,
            switchUpBufferRatio,
            switchUpBufferTime,
            q = SwitchRequest.NO_CHANGE,
            p = SwitchRequest.PRIORITY.DEFAULT;

        if (bufferLevel === 0.0) {
            return SwitchRequest(context).create();
        }

        var lastBufferStateVO = (metrics.BufferState.length > 0) ? metrics.BufferState[metrics.BufferState.length - 1] : null;
        if(lastBufferStateVO === null) {
            return SwitchRequest(context).create();
        }

        setBufferInfo(mediaType, lastBufferStateVO.state);

        // get configuration
        minBufferTime = config.getParamFor(mediaType, "BufferController.minBufferTime", "number", rulesContext.getManifestInfo().minBufferTime);
        switchLowerBufferRatio = config.getParamFor(mediaType, "ABR.switchLowerBufferRatio", "number", 0.25);
        switchLowerBufferTime = config.getParamFor(mediaType, "ABR.switchLowerBufferTime", "number", switchLowerBufferRatio * minBufferTime);
        switchDownBufferRatio = config.getParamFor(mediaType, "ABR.switchDownBufferRatio", "number", 0.5);
        switchDownBufferTime = config.getParamFor(mediaType, "ABR.switchDownBufferTime", "number", switchDownBufferRatio * minBufferTime);
        switchUpBufferRatio = config.getParamFor(mediaType, "ABR.switchUpBufferRatio", "number", 0.75);
        switchUpBufferTime = config.getParamFor(mediaType, "ABR.switchUpBufferTime", "number", switchUpBufferRatio * minBufferTime);


        if ((bufferLevel < switchDownBufferTime) && (!bufferStateDict[mediaType].firstBufferLoadedEvent)) {
            return SwitchRequest(context).create();
        } else {

            if (bufferLevel <= switchLowerBufferTime) {
                q = 0;
                p = SwitchRequest.PRIORITY.STRONG;
            } else if (bufferLevel <= switchDownBufferTime) {
                q = (rulesContext.getCurrentValue() > 0) ? (rulesContext.getCurrentValue() - 1) : 0;
                p = SwitchRequest.PRIORITY.DEFAULT;
            }

            debug.log("[OrangeRules][" + mediaType + "][InsufficientBufferRule] SwitchRequest: q=" + q  + ", p=" + p);
            return SwitchRequest(context).create( q, /*p, */{name: OrangeInsufficientBufferRuleClass.__dashjs_factory_name}, p);

        }
    }

    function reset() {
        eventBus.off(dashjs.MediaPlayer.events.PLAYBACK_SEEKING, onPlaybackSeeking, instance);
        bufferStateDict = {};
        lastSwitchTime = 0;
    }

    instance = {
        getMaxIndex: getMaxIndex,
        reset: reset
    };

    setup();
    return instance;
}

OrangeInsufficientBufferRuleClass.__dashjs_factory_name = 'OrangeInsufficientBufferRule';
OrangeInsufficientBufferRule = dashjs.FactoryMaker.getClassFactory(OrangeInsufficientBufferRuleClass);

