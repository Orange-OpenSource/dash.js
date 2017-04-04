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

var OrangeAbandonRequestsRule;

function OrangeAbandonRequestsRuleClass() {

    const ABANDON_MULTIPLIER = 2;
    const GRACE_TIME_THRESHOLD = 0.5;
    const BANDWITH_SAFETY_FACTOR = 0.9;

    const context = this.context;
    let factory = dashjs.FactoryMaker;

    let AbrController = factory.getSingletonFactoryByName('AbrController');
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let MediaPlayerModel = factory.getSingletonFactoryByName('MediaPlayerModel');
    let DashMetrics = factory.getSingletonFactoryByName('DashMetrics');
    let MetricsModel = factory.getSingletonFactoryByName('MetricsModel');
    let Debug = factory.getSingletonFactoryByName('Debug');

    const log = Debug(context).getInstance().log;

    let fragmentDict,
        abandonDict,
        throughputArray,
        mediaPlayerModel,
        dashMetrics,
        metricsModel,
        abrController;

    function setup() {
        fragmentDict = {};
        abandonDict = {};
        throughputArray = [];
        mediaPlayerModel = MediaPlayerModel(context).getInstance();
        dashMetrics = DashMetrics(context).getInstance();
        metricsModel = MetricsModel(context).getInstance();
        abrController = AbrController(context).getInstance();
    }

    function shouldAbandon(rulesContext) {

        const mediaInfo = rulesContext.getMediaInfo();
        const type = mediaInfo.type;
        var request = rulesContext.getCurrentRequest();
        var switchRequest = SwitchRequest(context).create(SwitchRequest.NO_CHANGE, {name: OrangeAbandonRequestsRuleClass.__dashjs_factory_name}/*, SwitchRequest.WEAK*/);

        var now = new Date().getTime(),
            elapsedTime,
            measuredBandwidth,
            estimatedTimeOfDownload;

        if (request.firstByteDate === null || request.aborted) {
            log("[OrangeRules][" + type + "][AbandonRequestsRule] Request has already been aborted.");
            return switchRequest;
        }

        elapsedTime = (now - request.firstByteDate.getTime()) / 1000;

        if (request.bytesLoaded < request.bytesTotal && elapsedTime >= (request.duration * GRACE_TIME_THRESHOLD)) {

            measuredBandwidth = request.bytesLoaded / elapsedTime;
            estimatedTimeOfDownload = request.bytesTotal / measuredBandwidth;

            if ((estimatedTimeOfDownload) > (request.duration * ABANDON_MULTIPLIER)) {

                const measuredBandwidthInKbps = (measuredBandwidth * 8 / 1000).toFixed(3);
                const newQuality = abrController.getQualityForBitrate(mediaInfo, measuredBandwidthInKbps * BANDWITH_SAFETY_FACTOR);

                log("[OrangeRules][" + type + "][AbandonRequestsRule] BW = " + measuredBandwidthInKbps * BANDWITH_SAFETY_FACTOR + " kb/s => switch quality : " + newQuality);
                switchRequest = SwitchRequest(context).create(newQuality, {name: OrangeAbandonRequestsRuleClass.__dashjs_factory_name} /*, SwitchRequest.STRONG*/);
            }
        }
        return switchRequest;
    }

    function reset() {
        setup();
    }

    const instance = {
        shouldAbandon: shouldAbandon,
        reset: reset
    };

    setup();
    return instance;
}

OrangeAbandonRequestsRuleClass.__dashjs_factory_name = 'OrangeAbandonRequestsRule';
OrangeAbandonRequestsRule = dashjs.FactoryMaker.getClassFactory(OrangeAbandonRequestsRuleClass);

